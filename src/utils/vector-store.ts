import fs from "node:fs";
import path from "node:path";

import type { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config as dotenvConfig } from "dotenv";
import type { Document } from "langchain/document";

dotenvConfig({ path: ".env.local" });

const baseURL = `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID_EMBEDDING}/openai/v1`;

const embeddings = new OpenAIEmbeddings(
	{
		apiKey: process.env.RUNPOD_API_KEY,
		batchSize: 512,
		model: "intfloat/multilingual-e5-large-instruct",
		dimensions: 1024,
	},
	{ baseURL }
);

class VectorStore {
	private static instance: HNSWLib | null = null;
	private static vectorStorePath: string | null = null;

	/**
	 * Initializes the vector store with the given path.
	 * @param vectorStorePath - The path to the vector store.
	 */
	public static init(vectorStorePath: string): void {
		this.vectorStorePath = vectorStorePath;
	}

	/**
	 * Gets the instance of the HNSWLib vector store. If it doesn't exist, it will be created or loaded from the given path.
	 * @returns A promise that resolves to the HNSWLib instance or null if not initialized.
	 */
	public static async getInstance(): Promise<HNSWLib | null> {
		if (this.vectorStorePath === null) {
			console.log("VectorStore not initialized. Call VectorStore.init() first.");
			return null;
		}

		if (this.instance === null) {
			const { HNSWLib } = await import("@langchain/community/vectorstores/hnswlib");

			this.instance = fs.existsSync(path.join(this.vectorStorePath, "args.json"))
				? await HNSWLib.load(this.vectorStorePath, embeddings)
				: new HNSWLib(embeddings, { space: "cosine", numDimensions: 1024 });
		}

		return this.instance;
	}

	/**
	 * Saves the current state of the vector store to the path specified during initialization.
	 * @returns A promise that resolves when the save operation is complete.
	 */
	public static async save(): Promise<void> {
		const store = await this.getInstance();

		if (store) {
			await store.save(this.vectorStorePath!);
		}
	}

	/**
	 * Adds documents to the vector store and saves the updated store.
	 * @param documents - An array of documents to add to the vector store.
	 * @returns A promise that resolves when the documents have been added and the store saved.
	 */
	public static async addDocuments(documents: Document<Record<string, any>>[]): Promise<void> {
		const store = await this.getInstance();

		if (store) {
			await store.addDocuments(documents);
			await this.save();
		}
	}

	/**
	 * Deletes the vector store from the directory specified during initialization.
	 * @returns A promise that resolves when the vector store has been deleted.
	 */
	public static async delete(): Promise<void> {
		const store = await this.getInstance();

		if (store && fs.existsSync(path.join(this.vectorStorePath!, "args.json"))) {
			await store.delete({ directory: this.vectorStorePath! });

			this.instance = null;
		}
	}
}

export default VectorStore;

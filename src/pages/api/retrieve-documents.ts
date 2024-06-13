import type { Document } from "langchain/document";
import type { NextApiRequest, NextApiResponse } from "next";

import { PATH_VECTOR_STORE } from "@/config/config";
import VectorStore from "@/utils/vector-store";

VectorStore.init(PATH_VECTOR_STORE);

async function retrieveDocuments(query: string): Promise<Document<Record<string, any>>[]> {
	const store = await VectorStore.getInstance();

	if (store) {
		const documents = await store.similaritySearch(query, 3);
		return documents;
	}

	return [];
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method === "POST") {
		const { query } = request.body;

		if (!query) {
			return response.status(400).json({ error: "Query is required" });
		}

		try {
			const documents = await retrieveDocuments(query);
			return response.status(200).json({ documents });
		} catch (error) {
			console.error("Error retrieving documents:", error);
			return response.status(500).json({ error: "Failed to retrieve documents" });
		}
	} else {
		response.setHeader("Allow", ["POST"]);
		response.status(405).end(`Method ${request.method} Not Allowed`);
	}
}

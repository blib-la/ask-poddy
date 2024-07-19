import path from "node:path";

import type { Document } from "langchain/document";
import { UnknownHandling } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

import { minifyMarkdown } from "./minify";

import { config } from "@/config/config";
import { DirectoryLoaderPro } from "@/utils/directory-loader-pro";

export async function loadDocuments({
	type,
	realPath,
	directory,
	split,
	minify = true,
}: {
	type: string;
	realPath: string;
	directory: string;
	split: string;
	minify: boolean;
}): Promise<Document<Record<string, any>>[]> {
	let loader = null;

	const loaders: { [extension: string]: (path: string | Blob) => TextLoader } = {};
	// eslint-disable-next-line unicorn/no-array-for-each
	config.get(`dataType.${type}.extensions`).forEach((extension: string) => {
		loaders[extension] = (path: string | Blob) => new TextLoader(path);
	});

	loader = new DirectoryLoaderPro(
		path.join(realPath, directory),
		loaders,
		config.get(`dataType.${type}.ignorePaths`),
		true,
		UnknownHandling.Ignore
	);

	if (loader === null) {
		throw new Error("No loader specified");
	}

	const documents = await loader.load();

	await documents.map(async (document_: { pageContent: string; metadata: { source: any } }) => {
		const {
			metadata: { source },
			pageContent,
		} = document_;

		// Fix the "source" to point to relative path instead of full local path
		const localPath = source.split(split)[1].replaceAll("\\", "/");
		const newSource = `${localPath}`;
		document_.metadata.source = newSource;

		// Minify
		if (minify) {
			document_.pageContent = await minifyMarkdown(pageContent);
		}

		// If (newSource.match("manage-endpoints")) {
		// 	console.log(document_);
		// 	console.log("-------------------------------------");
		// 	console.log("-------------------------------------");
		// }

		return document_;
	});

	return documents;
}

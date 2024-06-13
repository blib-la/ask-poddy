import type { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { config } from "@/config/config";

export async function splitDocuments(type: string, documents: Document<Record<string, any>>[]) {
	let splitter = null;

	if (config.get(`dataType.${type}.enabled`)) {
		switch (type) {
			case "ts":
			case "js": {
				splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
					chunkSize: config.get(`dataType.${type}.chunkSize`),
					chunkOverlap: config.get(`dataType.${type}.chunkOverlap`),
					keepSeparator: false,
				});
				break;
			}

			case "markdown": {
				splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
					chunkSize: config.get(`dataType.${type}.chunkSize`),
					chunkOverlap: config.get(`dataType.${type}.chunkOverlap`),
					keepSeparator: false,
				});
				break;
			}

			default: {
				break;
			}
		}
	}

	if (splitter === null) {
		throw new Error("no splitter specified");
	}

	const chunks = await splitter.splitDocuments(documents);

	return chunks;
}

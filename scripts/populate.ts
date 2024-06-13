import path from "node:path";

import { config as dotenvConfig } from "dotenv";

import { PATH_VECTOR_STORE, config } from "@/config/config";
import { getDirectories } from "@/utils/get-directories";
import { loadDocuments } from "@/utils/load-documents";
import { splitDocuments } from "@/utils/split-documents";
import VectorStore from "@/utils/vector-store";

dotenvConfig({ path: ".env.local" });

export const PATH_DATA = path.join(process.cwd(), "data");
export const PATH_SPLIT = path.join("ask-poddy", "data");

(async () => {
	try {
		VectorStore.init(PATH_VECTOR_STORE);
	} catch (error) {
		console.error(error);
	}

	// Make sure that no outdated data is in the store
	await VectorStore.delete();

	const store = await VectorStore.getInstance();

	const directories = await getDirectories(PATH_DATA);

	// For each directory inside of /data
	for (const directory of directories) {
		const dataType = config.get("dataType");

		// Iterate over all types (like markdown) from the config
		for (const type in dataType) {
			if (dataType[type].enabled) {
				try {
					const documents = await loadDocuments({
						type,
						directory: directory.name,
						realPath: PATH_DATA,
						split: PATH_SPLIT,
					});

					console.log(`${directory.name}: ${documents.length} ${type} file(s)`);

					// Split the documents into smaller chunks
					const chunks = await splitDocuments(type, documents);

					// eslint-disable-next-line max-depth
					if (store) {
						await VectorStore.addDocuments(chunks);
					}
				} catch (error) {
					console.error(`There was an error when processing ${type}:`, error);
				}
			}
		}
	}
})();

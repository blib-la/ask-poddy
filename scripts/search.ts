import { config as dotenvConfig } from "dotenv";

import { PATH_VECTOR_STORE } from "@/config/config";
import VectorStore from "@/utils/vector-store";

dotenvConfig({ path: ".env.local" });

(async () => {
	try {
		VectorStore.init(PATH_VECTOR_STORE);
	} catch (error) {
		console.error(error);
	}

	const store = await VectorStore.getInstance();

	const result = await store?.similaritySearch("What is RunPod?", 10);

	console.log(result);
})();

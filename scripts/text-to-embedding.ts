import { OpenAIEmbeddings } from "@langchain/openai";
import { config as dotenvConfig } from "dotenv";

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

(async () => {
	const text1 = `## Community Cloud

GPU instances connect individual compute providers to consumers through a vetted, secure peer-to-peer system.`;

	const text2 = `## Datacenter

A data center is a secure location where RunPod's cloud computing services, such as Secure Cloud and GPU Instances, are hosted.`;

	//
	// const result = await embeddings.embedQuery("What is RunPod?");

	// console.log(result);
	// console.log(`Dimensions: ${result.length}`);

	const text1result = await embeddings.embedQuery(text1);
	const text2result = await embeddings.embedQuery(text2);

	console.log(text1result);
	console.log(text2result);
})();

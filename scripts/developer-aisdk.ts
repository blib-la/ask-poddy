import path from "node:path";

import { createOpenAI } from "@ai-sdk/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { generateText } from "ai";
import { config as dotenvConfig } from "dotenv";
import type { Document } from "langchain/document";

dotenvConfig({ path: ".env.local" });

const llmEndpoint = `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID_VLLM}/openai/v1`;
const embeddingsEndpoint = `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID_EMBEDDING}/openai/v1`;
const vectorStorePath = path.join(process.cwd(), "store");

const embeddings = new OpenAIEmbeddings(
	{
		apiKey: process.env.RUNPOD_API_KEY,
		batchSize: 512,
		model: "intfloat/multilingual-e5-large-instruct",
		dimensions: 1024,
	},
	{ baseURL: embeddingsEndpoint }
);

const llmProvider = createOpenAI({
	baseURL: llmEndpoint,
	apiKey: process.env.RUNPOD_API_KEY,
});

const llm = llmProvider.chat("meta-llama/Meta-Llama-3-8B-Instruct");

function createSystemPrompt(context: string) {
	return `You are a helpful assistant with all questions related to RunPod. 
You provide precise answers and how to guides, always with the focus on RunPod. 
Your answers are always complete.
You don't come up with answers if you have no idea on how to answer a question. 
You format your message so that they are easier to consume and make sure to include links from the CONTEXT.
You use the CONTEXT to answer the query from the user, but never mention that you are using the CONTEXT.

## CONTEXT
${context}
`;
}

(async () => {
	const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);

	const prompt = "What is RunPod?";

	// Find 5 relevant data documents
	const documents = await vectorStore.similaritySearch(prompt, 5);

	// Combine the documents
	const context = documents.map((document: Document) => document.pageContent).join("\n");

	// Call the LLM including the message history + context
	const response = await generateText({
		model: llm,
		system: createSystemPrompt(context),
		prompt,
		maxTokens: 6000,
		temperature: 0.1,
		maxRetries: 5,
	});

	console.log(JSON.stringify(response.responseMessages, undefined, 2));
})();

import path from "node:path";

import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";

config({ path: ".env.local" });

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

const llm = new ChatOpenAI(
	{
		apiKey: process.env.RUNPOD_API_KEY,
		model: "meta-llama/Meta-Llama-3-8B-Instruct",
		temperature: 0.1,
		maxRetries: 5,
		maxTokens: 6000,
	},
	{ baseURL: llmEndpoint }
);

(async () => {
	// The question of user
	const prompt = "What is RunPod?";

	// Load vector store from file
	const vectorStore = await HNSWLib.load(vectorStorePath, embeddings);

	// Retrieval: Find 5 relevant data documents
	const documents = await vectorStore.similaritySearch(prompt, 5);
	// Combine the content of the documents into one string
	const data = documents.map(document => document.pageContent).join("\n");

	// Augmented: Create the context by adding data and prompt
	const context = [
		new SystemMessage(
			`You are a helpful assistant and answer all questions related to RunPod. 
You don't come up with answers if you have no idea on how to answer a question. 
You format your message so that its easy to consume by the user and make sure to include links from DATA.
You use DATA to answer the question from the user, but never mention that you are using DATA.
		
## DATA
${data}`
		),
		new HumanMessage(prompt),
	];

	// Generation: Send the context to the LLM and receive a response
	const response = await llm.invoke(context);

	console.log(response.content);
})();

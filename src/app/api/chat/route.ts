import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import axios from "axios";
import type { Document } from "langchain/document";

const baseURL = `https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID_VLLM}/openai/v1`;

const provider = createOpenAI({
	baseURL,
	apiKey: process.env.RUNPOD_API_KEY,
});

const model = provider.chat("meta-llama/Meta-Llama-3-8B-Instruct");

function createSystemPrompt(data: string) {
	return `You are a helpful assistant with all questions related to RunPod. 
You provide precise answers and how to guides, always with the focus on RunPod. 
Your answers are always complete.
You don't come up with answers if you have no idea on how to answer a question. 
You format your message so that they are easier to consume and make sure to include links from the DATA.
You use the DATA to answer the query from the user, but never mention that you are using the DATA.

## DATA
${data}
`;
}

export async function POST(request: Request) {
	const { messages } = await request.json();
	const query = messages.at(-1).content;

	let documents = [];
	try {
		// Get related documents from the Vector Store
		const response = await axios.post("http://localhost:3000/api/retrieve-documents", {
			query,
		});

		documents = response.data.documents;
	} catch (error) {
		console.error("Error calling retrieve-documents API:", error);
	}

	// Combine the documents
	const data = documents.map((document: Document) => document.pageContent).join("\n");

	console.log(data);

	// Call the LLM including the message history + data
	const result = await streamText({
		model,
		system: createSystemPrompt(data),
		messages,
		maxTokens: 6000,
		temperature: 0.1,
		maxRetries: 5,
	});

	return result.toAIStreamResponse();
}

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("D:\\dev\\blibla\\ask-poddy\\data\\runpod-docs\\docs\\glossary.md");

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 100,
	chunkOverlap: 0,
});

(async () => {
	const documents = await loader.load();

	const output = await splitter.createDocuments([documents[0].pageContent]);

	console.log(output);
})();

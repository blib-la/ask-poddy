import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

/**
 * Minifies the content of a markdown file by removing unnecessary whitespace and new lines.
 * @param filePath The path to the markdown file.
 * @returns The minified content.
 */
export async function minifyMarkdown(pageContent: string): Promise<string> {
	const file = await unified()
		.use(remarkParse) // Parse markdown to AST
		.use(rehypeRemark) // Convert markdown AST to rehype AST
		.use(rehypeParse) // Parse HTML to AST
		.use(rehypeStringify) // Convert HTML AST to string, stripping tags
		.use(remarkStringify, {
			bullet: "*",
			fences: true,
			listItemIndent: "one",
			rule: "-",
			strong: "*",
		})
		.process(pageContent);

	// Minify the content
	const minifiedContent = String(file)
		// Replace all whitespace sequences with a single space
		.replaceAll(/\s+/g, " ")
		// Remove lines with excessive hyphens
		.replaceAll(/-{10,}/g, "")
		// Trim leading and trailing whitespace
		.trim();

	return minifiedContent;
}

import type { PropsWithChildren } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children }: PropsWithChildren<object>) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ node, ...properties }) => (
					<h1 className="text-3xl font-bold my-4" {...properties} />
				),
				h2: ({ node, ...properties }) => (
					<h2 className="text-2xl font-bold my-3" {...properties} />
				),
				h3: ({ node, ...properties }) => (
					<h3 className="text-xl font-bold my-2" {...properties} />
				),
				p: ({ node, ...properties }) => <p className="my-4" {...properties} />,
				ul: ({ node, ...properties }) => (
					<ul className="list-disc list-inside my-2" {...properties} />
				),
				ol: ({ node, ...properties }) => (
					<ol className="list-decimal list-inside my-2" {...properties} />
				),
				li: ({ node, ...properties }) => <li className="pl-1 my-1" {...properties} />,
				code: ({ node, ...properties }) => (
					<code className="bg-gray-200 rounded p-1" {...properties} />
				),
				pre: ({ node, ...properties }) => (
					<pre className="bg-gray-200 rounded p-2 my-2" {...properties} />
				),
				a: ({ node, ...properties }) => (
					<a className="text-indigo-300 hover:underline" {...properties} />
				),
			}}
		>
			{children as string}
		</ReactMarkdown>
	);
}

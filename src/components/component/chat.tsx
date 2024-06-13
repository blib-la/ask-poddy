import { useChat } from "ai/react";
import { useState } from "react";

import { LoaderPinwheelIcon } from "@/components/atoms/loader-pinwheel-icon";
import Markdown from "@/components/atoms/markdown";
import { SendIcon } from "@/components/atoms/send-icon";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Chat() {
	const [error, setError] = useState<string | null>(null);

	function onError(error_: Error) {
		console.error("Chat error:", error_);
		setError("An error occurred while processing your request. Please try again.");
	}

	const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ onError });

	return (
		<div className="flex flex-col h-screen bg-gray-800">
			<header className="bg-gray-900 text-white py-4 px-6 text-4xl">
				<div className="flex items-center justify-center">
					<div className="flex items-center">
						<Avatar className="mr-4">
							<AvatarImage alt="Chatbot Avatar" src="/poddy.png" />
							<AvatarFallback>CB</AvatarFallback>
						</Avatar>
						<h1 className="font-bold">Ask Poddy</h1>
					</div>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto p-6 w-full flex justify-center">
				<div className="w-full max-w-screen-lg space-y-4">
					{messages.map(m => (
						<div
							key={m.id}
							className={`flex items-start ${m.role === "user" ? "justify-end" : ""}`}
						>
							{m.role === "assistant" && (
								<Avatar className="mr-4">
									<AvatarImage alt="Chatbot Avatar" src="/poddy.png" />
									<AvatarFallback>Poddy</AvatarFallback>
								</Avatar>
							)}
							<div
								className={`rounded-lg p-4 max-w-[70%] ${
									m.role === "user"
										? "bg-indigo-500 text-white"
										: "bg-gray-100 dark:bg-gray-700"
								}`}
							>
								<Markdown>{m.content}</Markdown>
							</div>
							{m.role === "user" && (
								<Avatar className="ml-4">
									<AvatarImage alt="User Avatar" src="/placeholder-user.jpg" />
									<AvatarFallback>User</AvatarFallback>
								</Avatar>
							)}
						</div>
					))}
				</div>
			</div>

			<form className="p-4 flex justify-center w-full" onSubmit={handleSubmit}>
				<div className="w-full max-w-screen-lg flex items-center">
					<Input
						className="flex-1 mr-4 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
						placeholder="How can I help you?"
						type="text"
						value={input}
						onChange={handleInputChange}
					/>
					<Button
						type="submit"
						disabled={isLoading}
						className="!bg-deep-purple-500 !text-white"
					>
						{isLoading ? (
							<LoaderPinwheelIcon className="h-5 w-5 animate-spin" />
						) : (
							<SendIcon className="h-5 w-5" />
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}

import { Chat } from "@/components/component/chat";
import { useChat } from "ai/react";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();
	return <Chat />;
}

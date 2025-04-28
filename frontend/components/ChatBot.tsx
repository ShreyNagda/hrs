"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageSquare, X } from "lucide-react";

// Define the Message interface
interface Message {
    role: "user" | "model";
    text: string;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]); // Store messages
    const [input, setInput] = useState<string>(""); // Store user input
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // State to toggle chatbot visibility

    // Instantiate the GoogleGenerativeAI model
    const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
    if (!apikey) {
        console.error("API key undefined");
    }

    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({
        model: "tunedModels/hair-care-chatbot-79gfra2j6upl",
    });

    // Send a message to the model
    const sendMessage = async () => {
        if (!input.trim()) return; // Don't send empty messages

        setLoading(true); // Set loading to true while waiting for a response
        const userMessage: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]); // Add user message to state
        setInput(""); // Clear input field

        try {
            // Start a chat session with the model
            const chatSession = model.startChat({
                history: messages.map((msg) => ({
                    role: msg.role,
                    parts: [{ text: msg.text }],
                })),
            });

            // Send the message and get a response
            const result = await chatSession.sendMessage(input);

            // Process the response
            const responseText = result.response.text();
            if (responseText) {
                const botMessage: Message = {
                    role: "model",
                    text: responseText,
                };
                setMessages((prev) => [...prev, botMessage]); // Add bot message to state
            } else {
                console.error("No valid response from Gemini API:", result);
                const botMessage: Message = {
                    role: "model",
                    text: "Sorry, I couldn't process that. Please try again.",
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            const botMessage: Message = {
                role: "model",
                text: "An error occurred. Please try again later.",
            };
            setMessages((prev) => [...prev, botMessage]);
        }
        setLoading(false); // Set loading to false once done
    };
    return (
        <div>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsChatOpen((prev) => !prev)} // Toggle chatbot visibility
                className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-full shadow-lg z-50"
            >
                {isChatOpen ? <X /> : <MessageSquare />}
            </button>

            {/* Chatbot UI */}
            {isChatOpen && (
                <div className=" md:max-w-lg bg-gray-900 text-white rounded-2xl shadow-lg fixed bottom-20 right-0 w-80 z-40 no-scrollbar">
                    <h1 className="text-lg bg-gray-800 py-2 px-1">
                        Hair Care Chatbot
                    </h1>
                    <div className="h-96 overflow-y-auto p-2 border-b border-gray-700">
                        {/* Render messages */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 p-2 rounded-lg ${
                                    msg.role === "user"
                                        ? "bg-indigo-500 ml-auto"
                                        : "bg-gray-700 mr-auto"
                                } w-fit max-w-xs`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-4 p-2 ">
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-l-lg bg-gray-800 border border-gray-600 text-white"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                        />
                        <button
                            className="bg-indigo-500 p-2 rounded-r-lg text-white disabled:opacity-50"
                            onClick={sendMessage}
                            disabled={loading}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;

"use client"
import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import MessageInput from "@/components/ChatUI/MessageInput"
import Message from "@/components/ChatUI/Message"

interface MessageType {
    id: number
    content: string
    sender: {
        name: string
        avatar: string
    }
    isOwnMessage: boolean
    timestamp: Date
}

const initialMessages: MessageType[] = [
    {
        id: 1,
        content: "Hey, how are you?",
        sender: { name: "Alice", avatar: "/alice.jpg" },
        isOwnMessage: false,
        timestamp: new Date(2023, 5, 1, 14, 30),
    },
    {
        id: 2,
        content: "I'm doing great, thanks for asking! How about you?",
        sender: { name: "You", avatar: "/your-avatar.jpg" },
        isOwnMessage: true,
        timestamp: new Date(2023, 5, 1, 14, 32),
    },
    {
        id: 3,
        content: "I'm good too. Did you finish the project?",
        sender: { name: "Alice", avatar: "/alice.jpg" },
        isOwnMessage: false,
        timestamp: new Date(2023, 5, 1, 14, 35),
    },
]

export default function ChatArea() {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages)

    const handleSendMessage = (content: string) => {
        const newMessage: MessageType = {
            id: messages.length + 1,
            content,
            sender: { name: "You", avatar: "/your-avatar.jpg" },
            isOwnMessage: true,
            timestamp: new Date(),
        }
        setMessages([...messages, newMessage])
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-white p-4 border-b">
                <h2 className="text-xl font-semibold">Alice</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <Message key={message.id} {...message} />
                    ))}
                </div>
            </ScrollArea>
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    )
}


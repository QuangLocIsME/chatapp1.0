"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/lib/constants";
import Message from './Message';
import MessageInput from './MessageInput';

interface MessageType {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name: string;
        avatar: string;
    };
    timestamp: string;
}

export default function ChatArea({ recipientId }: { recipientId: string }) {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS);
                setCurrentUser(response.data);
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`${API_ROUTES.GET_CONVERSATION}?recipientId=${recipientId}`);
                setMessages(response.data);
            } catch (err) {
                setError("Error loading messages");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (recipientId) {
            fetchMessages();
        }
    }, [recipientId]);

    const handleSendMessage = async (content: string) => {
        try {
            const response = await axiosInstance.post(API_ROUTES.CHAT, {
                recipientId,
                content,
                messageType: "text"
            });
            setMessages(prev => [...prev, response.data]);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                {loading && <div className="text-center">Loading messages...</div>}
                {error && <div className="text-red-500 text-center">{error}</div>}
                {!loading && messages.length === 0 && (
                    <div className="text-center text-gray-500">No messages yet</div>
                )}
                <div className="space-y-4">
                    {messages.map((message) => (
                        <Message
                            key={message._id}
                            content={message.content}
                            sender={message.sender}
                            isOwnMessage={currentUser?._id === message.sender._id}
                            timestamp={new Date(message.timestamp)}
                        />
                    ))}
                </div>
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
}

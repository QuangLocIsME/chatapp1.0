"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/lib/constants";
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '@/context/SocketContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Phone, Video, MoreVertical } from 'lucide-react'

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
    const { socket } = useSocket();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch user details
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

    // Fetch messages function
    const fetchMessages = async () => {
        try {
            const response = await axiosInstance.get(`${API_ROUTES.GET_CONVERSATION}?recipientId=${recipientId}`);
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Error loading messages");
        }
    };

    // Initial fetch
    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            await fetchMessages();
            setLoading(false);
        };

        if (recipientId) {
            initialFetch();
        }
    }, [recipientId]);

    // Socket effect
    useEffect(() => {
        if (socket) {
            socket.emit('join chat', recipientId);

            // Fetch messages when receiving new message
            socket.on('message received', async () => {
                await fetchMessages();
            });
        }

        return () => {
            if (socket) {
                socket.off('message received');
            }
        };
    }, [recipientId, socket]);

    const handleSendMessage = async (content: string) => {
        try {
            const response = await axiosInstance.post(API_ROUTES.SEND_MESSAGE, {
                recipientId,
                content,
                messageType: "text"
            });

            if (response.data) {
                await fetchMessages(); // Fetch messages after sending

                if (socket) {
                    socket.emit('new message', {
                        ...response.data,
                        chat: { users: [currentUser, { _id: recipientId }] }
                    });
                }
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={messages[0]?.sender.avatar} alt={messages[0]?.sender.name} />
                        <AvatarFallback>{messages[0]?.sender.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold">{messages[0]?.sender.name}</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" aria-label="Voice call">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Video call">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="More options">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-200px)] p-6">
                    {loading && (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center items-center h-full text-destructive">
                            {error}
                        </div>
                    )}
                    {!loading && messages.length === 0 && (
                        <div className="flex flex-col justify-center items-center h-full text-muted-foreground space-y-2">
                            <MessageSquare className="h-12 w-12" />
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <Message
                                key={`${message._id}-${index}`}
                                content={message.content}
                                sender={message.sender}
                                isOwnMessage={message.sender._id === currentUser?._id}
                                timestamp={new Date(message.timestamp)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 border-t">
                <MessageInput
                    onSendMessage={handleSendMessage}
                    recipientId={recipientId}
                />
            </CardFooter>
        </Card>
    );
}


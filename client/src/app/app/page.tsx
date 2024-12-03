"use client";

import { useState } from 'react';
import Sidebar from '@/components/ChatUI/Sidebar';
import ChatArea from '@/components/ChatUI/ChatArea';
import { withAuth } from '@/HOC/nextwithauth';
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from 'lucide-react';

function Home() {
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 border-r">
                <Sidebar onSelectConversation={(recipientId) => setSelectedRecipient(recipientId)} />
            </div>

            <Separator orientation="vertical" />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedRecipient ? (
                    <ChatArea recipientId={selectedRecipient} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground">Select a conversation</h2>
                        <p className="text-sm">Choose a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuth(Home);


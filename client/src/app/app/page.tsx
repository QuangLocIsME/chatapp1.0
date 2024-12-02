"use client";

import { useState } from 'react';
import Sidebar from '@/components/ChatUI/Sidebar';
import ChatArea from '@/components/ChatUI/ChatArea';
import { withAuth } from '@/HOC/nextwithauth';

function Home() {
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

    return (
        <div className="flex h-screen">
            <Sidebar onSelectConversation={(recipientId) => setSelectedRecipient(recipientId)} />
            {selectedRecipient ? (
                <ChatArea recipientId={selectedRecipient} />
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start chatting
                </div>
            )}
        </div>
    );
}

export default withAuth(Home);

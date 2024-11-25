
"use client";

import Sidebar from '@/components/ChatUI/Sidebar';
import ChatArea from '@/components/ChatUI/ChatArea';
import { withAuth } from '@/HOC/nextwithauth';

function Home() {
    return (
        <>
            <Sidebar />
            <ChatArea />
        </>
    );
}
export default withAuth(Home);

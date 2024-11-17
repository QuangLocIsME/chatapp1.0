import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/components/Message/message"
import { MessageInput } from "@/components/Message/message-input"

export function ChatWindow() {
    return (
        <div className="flex flex-col flex-1">
            <div className="border-b p-4">
                <h2 className="text-2xl font-bold"># General</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
                <Message
                    user="Alice"
                    content="Hey everyone! How's it going?"
                    timestamp="2:30 PM"
                />
                <Message
                    user="Bob"
                    content="Hi Alice! All good here, how about you?"
                    timestamp="2:32 PM"
                />
                {/* Add more messages as needed */}
            </ScrollArea>
            <MessageInput />
        </div>
    )
}
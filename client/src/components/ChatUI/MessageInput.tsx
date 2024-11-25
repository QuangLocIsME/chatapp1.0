import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'

interface MessageInputProps {
    onSendMessage: (content: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            onSendMessage(message)
            setMessage('')
        }
    }

    return (
        <div className="p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                    className="flex-1"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                </Button>
            </form>
        </div>
    )
}


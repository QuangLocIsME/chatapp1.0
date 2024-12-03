import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Smile } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MessageInputProps {
    onSendMessage: (content: string) => void
    recipientId: string
}

export default function MessageInput({ onSendMessage, recipientId }: MessageInputProps) {
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || isSending) return

        setIsSending(true)
        try {
            await onSendMessage(message.trim())
            setMessage('')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size="icon" variant="ghost">
                                <Paperclip className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Attach file</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Input
                    className="flex-1"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSending}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="button" size="icon" variant="ghost">
                                <Smile className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add emoji</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button type="submit" disabled={isSending}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                </Button>
            </form>
        </div>
    )
}


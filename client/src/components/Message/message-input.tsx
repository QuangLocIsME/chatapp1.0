'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from 'lucide-react'

export function MessageInput() {
    const [message, setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Sending message:", message)
        setMessage("")
    }

    return (
        <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1"
                />
                <Button type="submit" size="icon">
                    <SendHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}
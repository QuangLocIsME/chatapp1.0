import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from 'date-fns'

interface MessageProps {
    content: string
    sender: {
        name: string
        avatar: string
    }
    isOwnMessage: boolean
    timestamp: Date
}

export default function Message({ content, sender, isOwnMessage, timestamp }: MessageProps) {
    return (
        <div className={`flex items-end gap-2 group ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`relative ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <Avatar className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                    <AvatarFallback>{sender.name[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[60%]`}>
                <div className="flex flex-col space-y-0.5">
                    {!isOwnMessage && (
                        <span className="text-xs text-muted-foreground px-2">{sender.name}</span>
                    )}
                    <div
                        className={`px-4 py-2 rounded-3xl text-sm ${
                            isOwnMessage
                                ? 'bg-[#0084ff] text-white rounded-br-lg'
                                : 'bg-[#f0f0f0] text-[#333333] rounded-bl-lg'
                        }`}
                    >
                        {content}
                    </div>
                </div>
                <span className={`text-[11px] text-muted-foreground mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {format(timestamp, 'HH:mm')}
                </span>
            </div>
        </div>
    )
}


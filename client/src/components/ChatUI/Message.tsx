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
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
            {!isOwnMessage && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                    <AvatarFallback>{sender.name[0]}</AvatarFallback>
                </Avatar>
            )}
            <div className={`max-w-[70%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
                {!isOwnMessage && (
                    <p className="text-sm text-muted-foreground mb-1">{sender.name}</p>
                )}
                <div className={`rounded-2xl px-4 py-2 ${isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                    }`}>
                    <p className="text-sm">{content}</p>
                </div>
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-right' : ''} text-muted-foreground`}>
                    {format(timestamp, 'HH:mm')}
                </p>
            </div>
            {isOwnMessage && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                    <AvatarFallback>{sender.name[0]}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}


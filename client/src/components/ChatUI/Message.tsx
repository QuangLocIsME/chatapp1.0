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
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isOwnMessage && (
                <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                    <AvatarFallback>{sender.name[0]}</AvatarFallback>
                </Avatar>
            )}
            <div className={`rounded-lg p-3 max-w-[70%] ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {!isOwnMessage && <p className="font-semibold text-sm mb-1">{sender.name}</p>}
                <p>{content}</p>
                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                    {format(timestamp, 'HH:mm')}
                </p>
            </div>
            {isOwnMessage && (
                <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage src={sender.avatar} alt={sender.name} />
                    <AvatarFallback>{sender.name[0]}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MessageProps {
    user: string
    content: string
    timestamp: string
}

export function Message({ user, content, timestamp }: MessageProps) {
    return (
        <div className="flex items-start space-x-4 mb-4">
            <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user}`} />
                <AvatarFallback>{user[0]}</AvatarFallback>
            </Avatar>
            <div>
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{user}</span>
                    <span className="text-xs text-gray-500">{timestamp}</span>
                </div>
                <p className="mt-1">{content}</p>
            </div>
        </div>
    )
}
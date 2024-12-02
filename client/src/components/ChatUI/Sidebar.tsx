import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Settings, User, LogOut, Users } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddFriend from '@/components/Addfriend/Addfriend'
import CreateGroup from '@/components/Creategroup/Creategroup'


export default function Sidebar() {
    const friends = [
        { id: 1, name: "Alice", avatar: "/alice.jpg" },
        { id: 2, name: "Bob", avatar: "/bob.jpg" },
        { id: 3, name: "Charlie", avatar: "/charlie.jpg" },
    ]

    const groups = [
        { id: 1, name: "Nhóm chung", avatar: "/general.jpg" },
        { id: 2, name: "Nhóm công nghệ", avatar: "/tech.jpg" },
    ]

    return (
        <div className="w-64 border-r bg-gray-100 p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <Input className="mb-4" placeholder="Search..." />
            <ScrollArea className="flex-grow mb-4">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold mb-2">Direct Messages</h2>
                        {friends.map((friend) => (
                            <Button key={friend.id} variant="ghost" className="w-full justify-start mb-1">
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={friend.avatar} alt={friend.name} />
                                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                </Avatar>
                                {friend.name}
                            </Button>
                        ))}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold mb-2">Group Chats</h2>
                        {groups.map((group) => (
                            <Button key={group.id} variant="ghost" className="w-full justify-start mb-1">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={group.avatar} alt={group.name} />
                                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                                </Avatar>
                                {group.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <div className="space-y-2">
                <AddFriend />
                <CreateGroup />

                <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}


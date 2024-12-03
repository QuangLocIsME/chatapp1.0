"use client";

import { useEffect, useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import { API_ROUTES } from '@/lib/constants';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Settings, User, LogOut, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddFriend from '@/components/Addfriend/Addfriend'
import CreateGroup from '@/components/Creategroup/Creategroup'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface Conversation {
    partner: {
        _id: string;
        name: string;
        avatar: string;
    };
    lastMessage: string;
    lastMessageTimestamp: string;
}

interface SidebarProps {
    onSelectConversation: (recipientId: string) => void;
}

export default function Sidebar({ onSelectConversation }: SidebarProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axiosInstance.get(API_ROUTES.GET_ALL_MESSAGES);
                setConversations(response.data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, []);

    const groups = [
        { id: 1, name: "Nhóm chung", avatar: "/general.jpg" },
        { id: 2, name: "Nhóm công nghệ", avatar: "/tech.jpg" },
    ]

    const filteredConversations = conversations.filter(conv =>
        conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`bg-background border-r transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-80'}`}>
            <div className="p-4 flex items-center justify-between">
                {!isCollapsed && <h1 className="text-2xl font-bold">Chat</h1>}
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
            {!isCollapsed && (
                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-8"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}
            <ScrollArea className="flex-grow px-4">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold mb-2">Direct Messages</h2>
                        {filteredConversations.map((conv) => (
                            <Button
                                key={conv.partner._id}
                                variant="ghost"
                                className="w-full justify-start mb-1 px-2"
                                onClick={() => onSelectConversation(conv.partner._id)}
                            >
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={conv.partner.avatar} alt={conv.partner.name} />
                                    <AvatarFallback>{conv.partner.name[0]}</AvatarFallback>
                                </Avatar>
                                {!isCollapsed && (
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className="font-medium">{conv.partner.name}</span>
                                        <span className="text-xs text-muted-foreground truncate w-40">
                                            {conv.lastMessage}
                                        </span>
                                    </div>
                                )}
                            </Button>
                        ))}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold mb-2">Group Chats</h2>
                        {filteredGroups.map((group) => (
                            <Button key={group.id} variant="ghost" className="w-full justify-start mb-1 px-2">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={group.avatar} alt={group.name} />
                                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                                </Avatar>
                                {!isCollapsed && <span>{group.name}</span>}
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="p-4 space-y-2">
                <TooltipProvider>
                    {isCollapsed ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-full">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Add Friend</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-full">
                                        <Users className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Create Group</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/profile">
                                        <Button variant="outline" size="icon" className="w-full">
                                            <User className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Edit Profile</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" className="w-full text-destructive">
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Logout</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <AddFriend />
                            <CreateGroup />
                            <Link href="/profile">
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    )}
                </TooltipProvider>
            </div>
        </div>
    )
}


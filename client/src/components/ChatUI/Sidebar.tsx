import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Sidebar() {
    return (
        <div className="w-64 border-r bg-gray-100/40 dark:bg-gray-800/40">
            <div className="p-4">
                <h2 className="mb-2 text-lg font-semibold">Chat Rooms</h2>
                <div className="space-y-2">
                    <Input placeholder="Search rooms..." />
                    <Button className="w-full">Create New Room</Button>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-130px)]">
                <div className="p-4 space-y-2">
                    {['General', 'Random', 'Tech Talk', 'Music'].map((room) => (
                        <Button key={room} variant="ghost" className="w-full justify-start">
                            # {room}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateGroup = async () => {
        try {
            setLoading(true);
            // Xử lý logic tạo nhóm ở đây
        } catch (error) {
            console.error("Lỗi khi tạo nhóm:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Tạo nhóm
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo nhóm mới</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập tên nhóm bạn muốn tạo
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="groupName" className="text-right">
                            Tên nhóm
                        </Label>
                        <Input
                            id="groupName"
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="col-span-3"
                            placeholder="Nhập tên nhóm..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateGroup} disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo nhóm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

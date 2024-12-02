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
import { UserPlus, Loader2, CheckCircle2, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from '@/lib/axiosInstance';
import { API_ROUTES } from '@/lib/constants';

interface User {
    name: string;
    email: string;
    avatar: string;
}

export default function AddFriend() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [email, setEmail] = useState("");

    const handleSearch = async () => {
        if (!email) {
            setError("Please enter an email address.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`${API_ROUTES.SEARCH_USER}?email=${email}`);
            if (response.data) {
                setSearchResult(response.data);
                setEmail("");
            } else {
                setError("User not found");
            }
        } catch (err) {
            setError("An error occurred while searching for the user.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = () => {
        console.log("Starting chat with:", searchResult?.name);
        // Implement your chat initiation logic here
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>
                        Enter the email of the friend you want to add
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                            placeholder="friend@example.com"
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {searchResult && (
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>User Found</AlertTitle>
                            <AlertDescription className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={searchResult.avatar} alt={searchResult.name} />
                                        <AvatarFallback>{searchResult.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{searchResult.name}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleStartChat}
                                    className="ml-auto"
                                >
                                    Start Chat
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Search User
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


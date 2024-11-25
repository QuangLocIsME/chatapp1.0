'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast, Toaster } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { API_ROUTES } from '@/lib/constants';
import { withAuth } from '@/HOC/nextwithauth';

function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
        sfa: false,
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS);
                if (response.data.success) {
                    setUser(response.data.data); // Load user data into state
                } else {
                    toast.error(response.data.msg || 'Failed to fetch user details');
                }
            } catch (error) {
                toast.error('Unexpected error occurred');
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const file = files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const response = await axiosInstance.post(API_ROUTES.UPLOAD_AVATAR, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.url) {
                setUser((prevUser) => ({ ...prevUser, avatar: response.data.url }));
                toast.success('Avatar uploaded successfully');
            } else {
                throw new Error(response.data.msg || 'Failed to upload avatar');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-4 relative group">
                        <label htmlFor="avatar-upload" className="relative cursor-pointer">
                            <Image
                                src={user.avatar || '/placeholder-avatar.png'}
                                alt="User Avatar"
                                width={120}
                                height={120}
                                className="rounded-full group-hover:opacity-70 transition-opacity"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                Change your avatar
                            </span>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 flex items-center justify-between">
                        <Label htmlFor="sfa">Second Factor Authentication (SFA)</Label>
                        <Switch
                            id="sfa"
                            checked={user.sfa}
                            onCheckedChange={(checked) => setUser({ ...user, sfa: checked })}
                        />
                    </div>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
}

export default withAuth(ProfilePage);

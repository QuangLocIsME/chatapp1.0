'use client';

import { useState, useEffect, useCallback } from 'react';
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
import * as qrcode from "qrcode";

function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
        _id: '',
        sfa: false,
        key: '',
        qrCodeUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS);
                if (response.data.success) {
                    setUser(response.data.data);
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



    // Handle avatar upload
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

    // Handle 2FA Enable
    const handleEnable2FA = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(API_ROUTES.GENERATEKEY, { userId: user._id });
            if (response.data.success) {
                const { qrCodeUrl, secret } = response.data.data;

                if (qrCodeUrl) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        key: secret,
                        qrCodeUrl: qrCodeUrl,
                        sfa: true,
                    }));
                    toast.success('2FA is enabled. Please scan the QR code with your authenticator app.');
                }
            } else {
                toast.error(response.data.msg || 'Failed to enable 2FA');
            }
        } catch (error) {
            toast.error('Unexpected error occurred while enabling 2FA');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle 2FA Disable
    const handleDisable2FA = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(API_ROUTES.DISABLE2FA, { userId: user._id });
            if (response.data.success) {
                setUser((prevUser) => ({
                    ...prevUser,
                    sfa: false,
                    key: '',
                    qrCodeUrl: '',
                }));
                toast.success('2FA has been disabled.');
            } else {
                toast.error(response.data.msg || 'Failed to disable 2FA');
            }
        } catch (error) {
            toast.error('Unexpected error occurred while disabling 2FA');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle switch for 2FA
    const handleSFAChange = async (checked: boolean) => {
        setLoading(true);

        if (checked) {
            try {
                await handleEnable2FA();
            } catch (error) {
                toast.error('Failed to enable 2FA');
            }
        } else {
            try {
                await handleDisable2FA();
            } catch (error) {
                toast.error('Failed to disable 2FA');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center space-y-4 relative group">
                        <label htmlFor="avatar-upload" className="relative cursor-pointer">
                            <Image
                                src={preview || user.avatar || '/placeholder-avatar.png'}
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

                    {/* Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            disabled
                            id="name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            disabled
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </div>

                    {/* Switch for 2FA */}
                    <div className="space-y-2 flex items-center justify-between">
                        <Label htmlFor="sfa">Second Factor Authentication (SFA)</Label>
                        <Switch
                            id="sfa"
                            checked={user.sfa}
                            onCheckedChange={handleSFAChange}
                        />
                    </div>

                    {/* QR Code and Secret for 2FA */}
                    {user.sfa && user.qrCodeUrl && (
                        <div className="text-center">
                            <p className="font-semibold text-gray-700 mb-2">Scan the QR code with your authenticator app</p>
                            <div className="bg-white p-4 inline-block rounded-lg shadow-md">
                                <Image src={user.qrCodeUrl} alt="QR Code" width={200} height={200} />
                            </div>
                            <p className="mt-4 text-sm text-gray-600">Secret: <span className="font-mono bg-gray-100 p-1 rounded">{user.key}</span></p>
                            <p className="mt-2 text-xs text-gray-500">Keep this secret safe. You'll need it if you lose access to your authenticator app.</p>
                        </div>
                    )}

                    {/* Loading spinner */}
                    {loading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 z-10">
                            <div className="loader">Loading...</div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
}

export default withAuth(ProfilePage);


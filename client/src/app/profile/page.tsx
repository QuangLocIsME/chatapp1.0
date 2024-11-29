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
import { Eye, EyeOff, Edit2, Check, Mail, Phone, MapPin } from 'lucide-react'


function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
        _id: '',
        sfa: false,
        password: '',
        key: '',
        qrCodeUrl: '',
    });


    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [editingName, setEditingName] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    //Handle Save
    const handleSaveField = async (field: 'name' | 'password') => {
        setLoading(true);
        try {
            let response;
            if (field === 'password') {
                response = await axiosInstance.post(API_ROUTES.UPDATEPASSWORD, {
                    password: user.password,
                });
            } else {
                response = await axiosInstance.post(API_ROUTES.UPDATE, {
                    [field]: user[field],
                });
            }

            if (response.data.success) {
                toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
                if (field === 'name') setEditingName(false);
                if (field === 'password') {
                    setEditingPassword(false);
                    setUser(prev => ({ ...prev, password: '' }));
                }
            } else {
                throw new Error(response.data.msg || `Failed to update ${field}`);
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error(`Error updating ${field}`);
        } finally {
            setLoading(false);
        }
    };
    // Fetch user details on page load
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

    // Handle enabling 2FA
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


    // Handle disabling 2FA
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

    const handleSFAChange = async (checked: boolean) => {
        setLoading(true); // Set loading state to true

        try {
            if (checked) {
                await handleEnable2FA();
            } else {
                await handleDisable2FA();
            }
        } catch (error) {
            toast.error(checked ? 'Failed to enable 2FA' : 'Failed to disable 2FA');
        } finally {
            setLoading(false);
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
                                priority
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
                        <div className="relative">
                            <Input
                                id="name"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                disabled={!editingName}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => editingName ? handleSaveField('name') : setEditingName(true)}
                            >
                                {editingName ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                            </Button>
                        </div>
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
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                disabled={!editingPassword}
                                placeholder={editingPassword ? 'Enter new password' : '••••••••'}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-10 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => editingPassword ? handleSaveField('password') : setEditingPassword(true)}
                            >
                                {editingPassword ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                            </Button>
                        </div>
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

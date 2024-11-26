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
        sfa: false,  // Trạng thái của 2FA
        key: '',  // Khóa bí mật TOTP
        qrCodeUrl: '',  // URL mã QR
    });
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEnable2FA = async () => {
        try {
            const response = await axiosInstance.post(API_ROUTES.GENERATEKEY);
            if (response.data.success) {
                // Lưu lại secret key và tạo mã QR
                setUser({ ...user, key: response.data.data.secret });
                const qrCodeUrl = response.data.data.qrCodeUrl;  // Đảm bảo lấy đúng URL mã QR từ response

                // Cập nhật URL mã QR vào state
                setUser((prevUser) => ({
                    ...prevUser,
                    qrCodeUrl: qrCodeUrl,
                    sfa: true, // Bật 2FA
                }));

                toast.success('2FA is enabled. Please scan the QR code with your authenticator app.');
            } else {
                toast.error(response.data.msg || 'Failed to enable 2FA');
            }
        } catch (error) {
            console.error(error);
            toast.error('Unexpected error occurred while enabling 2FA');
        }
    };

    const handleDisable2FA = async () => {
        try {
            const response = await axiosInstance.post(API_ROUTES.DISABLE2FA);
            if (response.data.success) {
                // Reset thông tin 2FA
                setUser((prevUser) => ({ ...prevUser, sfa: false, key: '', qrCodeUrl: '' }));
                toast.success('2FA has been disabled.');
            } else {
                toast.error(response.data.msg || 'Failed to disable 2FA');
            }
        } catch (error) {
            console.error(error);
            toast.error('Unexpected error occurred while disabling 2FA');
        }
    };

    const handleSFAChange = async (checked: boolean) => {
        if (checked) {
            // Bật 2FA
            await handleEnable2FA();
        } else {
            // Tắt 2FA
            await handleDisable2FA();
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
                            onCheckedChange={handleSFAChange}
                        />
                    </div>

                    {/* Hiển thị mã QR khi 2FA được bật */}
                    {user.sfa && user.qrCodeUrl && (
                        <div className="text-center">
                            <p className="font-semibold text-gray-700">Scan the QR code with your authenticator app</p>
                            <Image src={user.qrCodeUrl} alt="QR Code" width={200} height={200} />
                            <p className="mt-4">Secret: {user.key}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
}

export default withAuth(ProfilePage);

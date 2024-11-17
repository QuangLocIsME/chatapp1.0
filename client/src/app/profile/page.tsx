'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast, Toaster } from 'sonner';
import withPrivateRoute from '@/lib/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { API_ROUTES } from '@/lib/constants';

function ProfilePage() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
        sfa: false,
    });
    const [loading, setLoading] = useState(false);

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

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(API_ROUTES.UPDATE, user);
            if (response.data.success) {
                toast.success('Profile updated successfully');
            } else {
                throw new Error(response.data.msg || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Error saving profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            setLoading(true);
            try {
                const response = await axiosInstance.post(API_ROUTES.LOGOUT);
                if (response.data.success) {
                    toast.success('Logged out successfully');
                    setTimeout(() => {
                        window.location.href = '/auth/login'; // Redirect to login page
                    }, 1000);
                } else {
                    throw new Error(response.data.msg || 'Failed to logout');
                }
            } catch (error) {
                toast.error('Error logging out');
                console.error(error);
            } finally {
                setLoading(false);
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
                    <div className="flex justify-center">
                        <Image
                            src={user.avatar || '/placeholder-avatar.png'}
                            alt="User Avatar"
                            width={120}
                            height={120}
                            className="rounded-full"
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
                    <div className="pt-4">
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                    <div className="pt-2">
                        <Button variant="destructive" onClick={handleLogout} disabled={loading}>
                            {loading ? 'Logging out...' : 'Logout'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
}

export default withPrivateRoute(ProfilePage);

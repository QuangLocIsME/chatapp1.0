'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for routing
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast, Toaster } from "sonner";
import { API_ROUTES } from '@/lib/constants';
import axios from 'axios';

export default function LoginComponent() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');

    const router = useRouter();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const isEmailValid = () => /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = () => password.trim() !== '' && password.length >= 8;

    const handleEmailCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!isEmailValid()) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post(API_ROUTES.CHECKMAIL, { email });
            if (response.status === 200) {
                const userId = response.data.data._id;
                const name = response.data.data.name;
                setUserId(userId);
                setName(name);
                setStep(2);
                toast.success("Email Verified", { description: "Enter your password to continue." });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            setError((error as any).response?.data?.message || 'This email is not registered.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!userId) {
            setError('Please verify your email first.');
            return;
        }

        if (!isPasswordValid()) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post(API_ROUTES.CHECKPASSWORD, { password, userId }, { withCredentials: true });
            if (response.status === 200 && response.data.success) {
                toast.success("Login Successful", { description: `Welcome back, ${name}!` });
                router.push('/profile'); // Redirect to profile page
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            setError((error as any).response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-white'} transition-colors duration-500`}>
            <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-500`}>
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {step === 1 ? 'Login' : 'Welcome Back'}
                    </CardTitle>
                    <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {step === 1 ? 'Enter your email to continue.' : 'Enter your password.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <form onSubmit={handleEmailCheck}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="yourname@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}
                                />
                                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? 'Checking...' : 'Continue'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-[50%] transform -translate-y-[50%]"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="text-center">
                        Don't have an account? <a href="/register" className="text-purple-500 hover:underline">Sign up</a>
                    </div>
                </CardFooter>
            </Card>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="absolute top-4 right-4"
            >
                {isDarkMode ? <Sun className="h-6 w-6 text-yellow-300" /> : <Moon className="h-6 w-6 text-gray-600" />}
            </Button>
            <Toaster />
        </div>
    );
}

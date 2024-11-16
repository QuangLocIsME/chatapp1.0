'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Moon, Sun } from "lucide-react"
import axios from 'axios';
import { toast } from "sonner"
import { Toaster } from "sonner";
import { API_ROUTES, MESSAGES } from '@/lib/constants';
import axiosInstance from '@/lib/axiosInstance';

export default function Component() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    const isFormValid = () => {
        return fullName.trim() !== '' && email.trim() !== '' && password.trim() !== '';
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign up button clicked");
        if (!isFormValid()) {
            toast("Invalid Form", {
                description: "Please fill in all fields.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post(API_ROUTES.REGISTER, {
                name: fullName,
                email,
                password
            });

            console.log("Response:", response);

            if (response.status === 201) {
                toast.success("Registration Successful", {
                    description: "You have successfully registered. Please log in to continue.",
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Registration Failed", {
                    description: "This email is already registered. Please use a different email or try logging in.",
                });
            } else {
                toast.error("Registration Failed", {
                    description: (error as any).response?.data?.message || 'An error occurred during registration.',
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-white'} transition-colors duration-500`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute left-[calc(50%-4rem)] top-[calc(50%-4rem)] transform-gpu blur-3xl opacity-20" aria-hidden="true">
                    <defs>
                        <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <circle cx="50" cy="50" r="40" fill={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pattern)" />
                </svg>
            </div>
            <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-500 relative z-10`}>
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Create Account
                    </CardTitle>
                    <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sign up to get started with our amazing service
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSignUp}>
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} transition-all duration-300 focus:ring-2 focus:ring-purple-500 transform focus:scale-105`}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} transition-all duration-300 focus:ring-2 focus:ring-purple-500 transform focus:scale-105`}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} transition-all duration-300 focus:ring-2 focus:ring-purple-500 transform focus:scale-105`}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
                            disabled={loading || !isFormValid()}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center">
                        Already have an account? <a href="#" className="text-purple-500 hover:underline">Log in</a>
                    </div>
                </CardFooter>
            </Card>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20"
                onClick={toggleTheme}
            >
                {isDarkMode ? <Sun className="h-6 w-6 text-yellow-300" /> : <Moon className="h-6 w-6 text-gray-800" />}
                <span className="sr-only">Toggle theme</span>
            </Button>
            <Toaster richColors />
        </div>
    )
}
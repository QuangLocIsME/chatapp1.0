'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Moon, Sun, Eye, EyeOff } from 'lucide-react'
import axiosInstance from '@/lib/axiosInstance'
import axios from 'axios'
import { toast } from "sonner"
import { Toaster } from "sonner"
import { API_ROUTES } from '@/lib/constants'

export default function Component() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark')
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const isEmailValid = () => /\S+@\S+\.\S+/.test(email)
    const isPasswordValid = () => password.trim() !== '' && password.length >= 8

    const handleEmailCheck = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!isEmailValid()) {
            setError("Please enter a valid email address.")
            return
        }

        setLoading(true)
        try {
            const response = await axiosInstance.post(API_ROUTES.CHECKMAIL, { email })
            console.log('Email check response data:', response.data)

            if (response.status === 200) {
                const userId = response.data.data._id
                setUserId(userId)
                setStep(2)
                toast.success("Email Verified", { description: "Enter your password to continue." })
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (error) {
            console.error("Email check error:", error)
            setError(axios.isAxiosError(error) ? error.response?.data?.message || 'This email is not registered.' : 'An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!userId) {
            setError('Please verify your email first.')
            return
        }

        if (!isPasswordValid()) {
            setError("Password must be at least 8 characters long.")
            return
        }

        setLoading(true)
        try {
            const response = await axiosInstance.post(API_ROUTES.CHECKPASSWORD, { password, userId })
            if (response.status === 200 && response.data.success) {
                toast.success("Login Successful", { description: "Welcome back!" })
                console.log("Login successful. Token:", response.data.token)
            } else {
                setError('Invalid credentials. Please try again.')
            }
        } catch (error) {
            console.error("Login error:", error)
            setError('An error occurred. Please try again later.')
        } finally {
            setLoading(false)
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
                        {step === 1 ? 'Login' : 'Login'}
                    </CardTitle>
                    <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {step === 1 ? 'Enter your email to continue.' : 'Enter your password.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <form onSubmit={handleEmailCheck}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="yourname@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} transition-all duration-300 focus:ring-2 focus:ring-purple-500 transform focus:scale-105`}
                                    aria-invalid={error ? "true" : "false"}
                                    aria-describedby={error ? "email-error" : undefined}
                                />
                                {error && <p id="email-error" className="mt-2 text-sm text-red-500" role="alert">{error}</p>}
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300" disabled={loading}>
                                {loading ? 'Checking...' : 'Continue'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div className="space-y-2 relative">
                                <Label htmlFor="password" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} transition-all duration-300 focus:ring-2 focus:ring-purple-500 transform focus:scale-105 pr-10`}
                                    aria-invalid={error ? "true" : "false"}
                                    aria-describedby={error ? "password-error" : undefined}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                </Button>
                                {error && <p id="password-error" className="mt-2 text-sm text-red-500" role="alert">{error}</p>}
                            </div>
                            <Button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center">
                        Don't have an account? <a href="/register" className="text-purple-500 hover:underline">Sign up</a>
                    </div>
                    {step === 2 && (
                        <div className="text-sm text-center">
                            <a href="/forgot-password" className="text-purple-500 hover:underline">Forgot password?</a>
                        </div>
                    )}
                </CardFooter>
            </Card>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-20"
                onClick={toggleTheme}
            >
                {isDarkMode ? <Sun className="h-6 w-6 text-yellow-300" /> : <Moon className="h-6 w-6 text-gray-600" />}
                <span className="sr-only">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
            <Toaster />
        </div>
    )
}

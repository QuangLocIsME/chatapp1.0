'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Moon, Sun, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react'
import axiosInstance from '@/lib/axiosInstance'
import { toast, Toaster } from "sonner"
import { API_ROUTES } from '@/lib/constants'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { withPublicAuth } from '@/HOC/nextwithauth'

function ImprovedLoginComponent() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [userId, setUserId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [sfa, setSfa] = useState(false)

    const router = useRouter()

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        document.documentElement.classList.toggle('dark')
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const isEmailValid = () => /\S+@\S+\.\S+/.test(email)
    const isPasswordValid = () => password.trim() !== '' && password.length >= 8

    const handleEmailCheck = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!isEmailValid()) {
            setError("Please enter a valid email address.")
            return
        }

        setLoading(true)
        try {
            const response = await axiosInstance.post(API_ROUTES.CHECKMAIL, { email })
            if (response.status === 200) {
                const { _id, name, sfa } = response.data.data
                setUserId(_id)
                setName(name)
                setSfa(sfa)
                setStep(2)
                toast.success("Email Verified", { description: "Enter your password to continue." })
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (error) {
            setError((error as any).response?.data?.message || 'This email is not registered.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
                if (sfa) {
                    setStep(3)
                    toast.success("Password Verified", { description: "Enter your OTP to continue." })
                } else {
                    toast.success("Login Successful", { description: `Welcome back, ${name}!` })
                    router.push("/profile")
                }
            } else {
                setError('Invalid Credentials. Please try again.')
            }
        } catch (error) {
            setError((error as any).response?.data?.message || 'An error occurred. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        if (otp.length !== 6) {
            setError('OTP must be exactly 6 digits.')
            return
        }
        setLoading(true)
        try {
            const response = await axiosInstance.post(API_ROUTES.VALIDATEOTP, { otp, userId }, { withCredentials: true })
            if (response.status === 200 && !response.data.success) {
                toast.success("OTP Verified", { description: `Welcome back, ${name}!` })
                router.push("/profile")
            } else {
                setError('Invalid OTP. Please try again.')
            }
        } catch (error) {
            setError((error as any).response?.data?.message || 'An error occurred. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-white'} transition-colors duration-500`}>
            <Card className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-500 shadow-xl`}>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-extrabold text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {step === 1 ? 'Welcome Back' : step === 2 ? 'Enter Password' : 'Verify OTP'}
                    </CardTitle>
                    <CardDescription className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {step === 1 ? 'Sign in to your account' : step === 2 ? 'Enter your password to continue' : 'Enter the OTP sent to your email'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <form onSubmit={handleEmailCheck} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="sr-only">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`pl-10 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
                                    />
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Checking...' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="sr-only">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}
                    {step === 3 && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-center block">Enter OTP</Label>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={(newValue) => setOtp(newValue)}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />

                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm">
                        Don't have an account? <a href="/auth/register" className="text-purple-500 hover:underline font-medium">Sign up</a>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="w-full"
                    >
                        {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </CardFooter>
            </Card>
            <Toaster />
        </div>
    )
}
export default withPublicAuth(ImprovedLoginComponent);

    
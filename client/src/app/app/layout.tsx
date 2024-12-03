import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ChatConnect - Real-time Messaging App',
    description: 'Connect and chat with friends in real-time using our modern, secure messaging platform.',
    keywords: ['chat', 'messaging', 'real-time', 'social', 'communication'],
    authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
    viewport: 'width=device-width, initial-scale=1',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${inter.className} antialiased`}>
                    <div className="flex flex-col min-h-screen bg-background text-foreground">
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
            </body>
        </html>
    )
}


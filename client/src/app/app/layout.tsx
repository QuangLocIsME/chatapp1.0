import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Chat Website',
    description: 'A simple chat website using Next.js and shadcn/ui',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex h-screen">
                    {children}
                </div>
            </body>
        </html>
    )
}


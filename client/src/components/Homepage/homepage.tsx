import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Zap, Globe, Shield } from "lucide-react";
import { withAuth } from "@/HOC/nextwithauth";

export function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <header className="container mx-auto px-4 py-8">
                <nav className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">BuzzChat</h1>
                    <div className="space-x-4">
                        <Button variant="ghost">Features</Button>
                        <Button variant="ghost">Pricing</Button>
                        <Button variant="ghost">About</Button>
                        <Button>Sign Up</Button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-16">
                <section className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">
                        Experience Lightning-Fast Web Chat
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Connect instantly with BuzzChat's real-time, low-latency
                        communication platform.
                    </p>
                    <Button size="lg" className="text-lg px-8">
                        Get Started
                    </Button>
                </section>

                <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <FeatureCard
                        icon={<MessageCircle className="h-8 w-8 text-blue-500" />}
                        title="Real-Time Chat"
                        description="Enjoy seamless, instant messaging with our cutting-edge real-time technology."
                    />
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-yellow-500" />}
                        title="Low Latency"
                        description="Experience minimal delay in message delivery for smooth conversations."
                    />
                    <FeatureCard
                        icon={<Globe className="h-8 w-8 text-green-500" />}
                        title="Global Reach"
                        description="Connect with users worldwide without compromising on speed or quality."
                    />
                    <FeatureCard
                        icon={<Shield className="h-8 w-8 text-red-500" />}
                        title="Secure & Private"
                        description="Your conversations are protected with end-to-end encryption."
                    />
                </section>

                <section className="text-center bg-blue-50 rounded-lg p-8">
                    <h2 className="text-3xl font-bold mb-4">Ready to start buzzing?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of users already enjoying BuzzChat's lightning-fast
                        communication.
                    </p>
                    <Button size="lg" className="text-lg px-8">
                        Sign Up Now
                    </Button>
                </section>
            </main>

            <footer className="bg-gray-100 py-8 mt-16">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2023 BuzzChat. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}

export default withAuth(HomePage);

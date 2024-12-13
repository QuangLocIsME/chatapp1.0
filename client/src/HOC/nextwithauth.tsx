"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "../lib/axiosInstance";
import { API_ROUTES } from "../lib/constants";

// Định nghĩa routes với TypeScript
const APP_ROUTES = {
    LOGIN: '/auth/login',
    PROFILE: '/profile'
} as const;

function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
        </div>
    );
}

export function withAuth(Component: React.ComponentType<any>) {
    return function AuthenticatedComponent(props: any) {
        const router = useRouter();
        const pathname = usePathname();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

        useEffect(() => {
            const checkAuth = async () => {
                if (pathname === APP_ROUTES.LOGIN) return;

                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS, {
                        withCredentials: true
                    });

                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        router.push(APP_ROUTES.LOGIN);
                    }
                } catch (error: any) {
                    console.error("Authentication failed:", error.response?.data?.msg || error.message);
                    router.push(APP_ROUTES.LOGIN);
                }
            };

            checkAuth();
        }, [router, pathname]);

        if (isAuthenticated === null) {
            return <LoadingScreen />;
        }

        return <Component {...props} />;
    };
}

export function withPublicAuth(Component: React.ComponentType<any>) {
    return function PublicComponent(props: any) {
        const router = useRouter();
        const pathname = usePathname();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

        useEffect(() => {
            const checkAuth = async () => {
                if (pathname === APP_ROUTES.PROFILE) return;

                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS, {
                        withCredentials: true
                    });

                    if (response.data.success) {
                        router.push(APP_ROUTES.PROFILE);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                }
            };

            checkAuth();
        }, [router, pathname]);

        if (isAuthenticated === null) {
            return <LoadingScreen />;
        }

        return <Component {...props} />;
    };
}
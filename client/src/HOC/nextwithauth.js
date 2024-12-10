"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axiosInstance";
import { API_ROUTES } from "../lib/constants";

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(null);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS);
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        router.replace("/auth/login");
                    }
                } catch (error) {
                    console.error("Authentication failed:", error.response?.data?.msg || error.message);
                    router.replace("/auth/login");
                }
            };

            checkAuth();
        }, [router]);

        // Show loading screen while checking authentication
        if (isAuthenticated === null) {
            return <div>Loading...</div>;
        }

        return <Component {...props} />;
    };
}

// Thêm HOC mới để kiểm tra người dùng chưa xác thực
export function withPublicAuth(Component) {
    return function PublicComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(null);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS);
                    if (response.data.success) {
                        router.replace("/profile"); // Chuyển hướng về profile nếu đã đăng nhập
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                }
            };

            checkAuth();
        }, [router]);

        // Show loading screen while checking authentication
        if (isAuthenticated === null) {
            return <div>Loading...</div>;
        }

        return <Component {...props} />;
    };
}

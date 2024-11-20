"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axiosInstance";
import { API_ROUTES } from "../lib/constants";

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS); // Gọi API
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        router.push("/auth/login");
                    }
                } catch (error) {
                    console.error("Authentication failed:", error.response?.data?.msg || error.message);
                    router.push("/auth/login"); // Chuyển hướng nếu không xác thực
                }
            };

            checkAuth();
        }, []);

        if (!isAuthenticated) {
            return <div>Loading...</div>;
        }

        return <Component {...props} />;
    };
}

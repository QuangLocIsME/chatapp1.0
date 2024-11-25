"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axiosInstance";
import { API_ROUTES } from "../lib/constants";

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null as initial state to differentiate loading state

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axiosInstance.get(API_ROUTES.GETUSERDETAILS); // Call the API
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        router.replace("/auth/login");
                    }
                } catch (error) {
                    console.error("Authentication failed:", error.response?.data?.msg || error.message);
                    router.replace("/auth/login"); // Redirect on authentication failure
                }
            };

            checkAuth();
        }, [router]);

        // Show a loading screen until authentication is confirmed or denied
        if (isAuthenticated === null) {
            return <div>Loading...</div>;
        }

        // Render the wrapped component if authenticated
        return <Component {...props} />;
    };
}

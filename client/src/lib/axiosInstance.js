import axios from "axios";
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    timeout: 10000, // Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
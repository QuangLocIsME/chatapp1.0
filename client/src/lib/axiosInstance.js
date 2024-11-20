import axios from "axios";
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    timeout: 10000,
    withCredentials: true, // Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosInstance.interceptors.request.use(
    (config) => {
        // Thêm token nếu có
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Thêm response interceptors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = 'auth/login'; // Redirect nếu không được xác thực
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
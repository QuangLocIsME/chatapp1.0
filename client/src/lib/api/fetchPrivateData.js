import axiosInstance from '@/lib/axiosInstance';

export const fetchPrivateData = async () => {
    try {
        const response = await axiosInstance.get('api/auth/check-user', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching private data:', error.response?.data || error.message);
        throw error;
    }
};

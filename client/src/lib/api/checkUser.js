import axiosInstance from '../lib/axiosInstance';
import { API_ROUTES } from '../lib/constants';

export const checkUser = async (id) => {
    try {
        const url = API_ROUTES.CHECK(id); // Tạo URL động
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error checking user:', error.response?.data || error.message);
        throw error;
    }
};

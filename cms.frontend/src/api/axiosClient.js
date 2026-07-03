import axios from 'axios';

// Cấu hình các hằng số từ file .env
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7024/api';
export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7024';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;
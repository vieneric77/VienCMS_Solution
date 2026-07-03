import axiosClient from '../api/axiosClient';

const API_URL = 'https://localhost:7024/api/AuthApi';

const authService = {
    /**
     * Gửi yêu cầu đăng ký tài khoản Customer mới về SQL Server
     */
    register: async (customerData) => {
        try {
            const response = await axiosClient.post(`${API_URL}/register`, customerData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại authService.register:", error);
            throw error;
        }
    },

    /**
     * Gửi thông tin email/password 
     */
    login: async (credentials) => {
        try {
            const response = await axiosClient.post(`${API_URL}/login`, credentials);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại authService.login:", error);
            throw error;
        }
    },

    /**
     * 1. Gửi email để yêu cầu lấy lại mật khẩu
     */
    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post(`${API_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            console.error("Lỗi tại authService.forgotPassword:", error);
            throw error;
        }
    },

    /**
     * 2. Xác thực mã OTP
     */
    verifyOtp: async (email, otp) => {
        try {
            const response = await axiosClient.post(`${API_URL}/verify-otp`, { email, otp });
            return response.data;
        } catch (error) {
            console.error("Lỗi tại authService.verifyOtp:", error);
            throw error;
        }
    },

    /**
     * 3. Đặt lại mật khẩu mới
     */
    resetPassword: async (email, otp, newPassword) => {
        try {
            const response = await axiosClient.post(`${API_URL}/reset-password`, { email, otp, newPassword });
            return response.data;
        } catch (error) {
            console.error("Lỗi tại authService.resetPassword:", error);
            throw error;
        }
    },

    /**
     * Đăng xuất: Xóa toàn bộ vết tài khoản khỏi bộ nhớ máy trình duyệt
     */
    logout: () => {
        localStorage.removeItem('customerId');
        localStorage.removeItem('customerName');
        window.location.href = "/";
    },

    /**
     * Kiểm tra nhanh trạng thái xem khách hiện tại đã đăng nhập hay chưa
     */
    isAuthenticated: () => {
        const customerId = localStorage.getItem('customerId');
        return customerId !== null && customerId !== undefined && customerId !== '';
    }
};

export default authService;
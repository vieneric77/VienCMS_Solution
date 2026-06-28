import axiosClient from '../api/axiosClient';

const API_URL = 'https://localhost:7024/api/CartApi';

const cartService = {
    getCartItems: () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    addToCart: (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        alert(`Đã thêm thành công cuốn [${product.name}] vào giỏ hàng!`);
    },

    checkout: async (notes = '') => {
        const customerId = localStorage.getItem('customerId');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (!customerId) {
            throw new Error("Bạn bắt buộc phải đăng nhập tài khoản thành viên để thực hiện thanh toán!");
        }

        if (cart.length === 0) {
            throw new Error("Giỏ hàng của bạn đang trống. Không thể tiến hành thanh toán!");
        }

        const payload = {
            customerId: Number(customerId),
            notes: notes,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };

        try {
            const response = await axiosClient.post(`${API_URL}/checkout`, payload);
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));
            return response.data || response;
        } catch (error) {
            console.error("Lỗi tại cartService.checkout:", error);
            throw error;
        }
    }
};

export default cartService;
import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục sản phẩm từ Backend
     */
    getAllCategoryProducts: () => {
        const url = '/CategoryProducts';
        return axiosClient.get(url);
    },

    /**
     * Hàm lấy toàn bộ danh mục từ CategoriesController 
     */
    getAllCategories: () => {
        const url = '/Categories';
        return axiosClient.get(url);
    },

    /**
     * Lấy chi tiết danh mục theo ID
     */
    getCategoryById: (id) => {
        const url = `/Categories/${id}`;
        return axiosClient.get(url);
    },

    /**
     * MỚI: Lấy danh sách sản phẩm theo ID danh mục
     * Tương ứng với API [HttpGet("category/{categoryId}")] trong ProductsController
     */
    getProductsByCategoryId: (categoryId) => {
        return axiosClient.get(`/Products/category/${categoryId}`);
    }
};

export default categoryProductService;
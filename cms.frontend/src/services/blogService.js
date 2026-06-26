import axiosClient from '../api/axiosClient';

const blogService = {
    getBlogCategories: () => {
        return axiosClient.get('/apicategory');
    },

    getAllPosts: () => {
        return axiosClient.get('/posts');
    },

    // Thêm hàm này để gọi API lọc bài viết theo Category
    getPostsByCategory: (categoryId) => {
        return axiosClient.get(`/posts/category/${categoryId}`);
    },

    getPostById: (id) => {
        return axiosClient.get(`/posts/${id}`);
    }
};

export default blogService;
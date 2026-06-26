const API_URL = "https://localhost:7024/api/apicategory";

const categoryService = {
    // Lấy tất cả danh mục
    getAllCategories: async () => {
        const response = await fetch(API_URL);
        return await response.json();
    }
};

export default categoryService;
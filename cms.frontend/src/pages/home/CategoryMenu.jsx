import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu({ activeCategoryId, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();

                let dataArray = [];
                if (Array.isArray(response)) {
                    dataArray = response;
                } else if (response && Array.isArray(response.data)) {
                    dataArray = response.data;
                } else if (response && response.$values && Array.isArray(response.$values)) {
                    dataArray = response.$values;
                } else if (typeof response === 'object' && response !== null) {
                    const foundArray = Object.values(response).find(val => Array.isArray(val));
                    if (foundArray) dataArray = foundArray;
                }

                setCategories(dataArray);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCategories();
    }, []);

    if (loading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                <span className="ms-2 text-muted" style={{ fontSize: '14px' }}>Đang tải danh mục...</span>
            </div>
        );
    }

    return (
        <section className="category-menu-wrapper my-4">
            <div className="container">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                    {/* Nút mặc định */}
                    <button
                        onClick={() => onCategoryChange(null)}
                        className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${activeCategoryId === null ? 'btn-dark' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.9rem' }}
                    >
                        <i className="fas fa-boxes me-2"></i> Tất cả sản phẩm
                    </button>

                    {/* Vòng lặp danh mục */}
                    {categories.map((cat) => {
                        const currentId = cat.id || cat.categoryId || cat.categoryProductId;
                        const name = cat.name || cat.categoryName || cat.categoryProductName;
                        return (
                            <button
                                key={currentId}
                                onClick={() => onCategoryChange(currentId)}
                                className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${activeCategoryId === currentId ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={{ fontSize: '0.9rem' }}
                            >
                                <i className="fas fa-tag me-2" style={{ opacity: 0.6 }}></i>
                                {name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
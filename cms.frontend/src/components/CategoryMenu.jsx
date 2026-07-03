import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

function CategoryMenu({ activeCategoryId, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();
                const data = response?.data || response?.$values || response || [];
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    const placeholder = "https://placehold.co/100?text=No+Img";

    // Style cho hiệu ứng nổi lên
    const itemStyle = {
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '120px'
    };

    if (loading) return <div className="text-center my-4">Đang tải danh mục...</div>;

    return (
        <section className="category-menu-wrapper my-5">
            <div className="container text-center">
                <h3 className="mb-4 fw-bold">Danh mục sản phẩm</h3>
                <div className="d-flex flex-wrap justify-content-center gap-4">

                    {/* Nút Tất cả */}
                    <div
                        className="category-item-container"
                        onClick={() => onCategoryChange(null)}
                        style={itemStyle}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div className={`rounded-circle border border-3 d-flex align-items-center justify-content-center ${activeCategoryId === null ? 'border-primary shadow' : 'border-secondary'}`}
                            style={{ width: '100px', height: '100px', backgroundColor: '#fff' }}>
                            <i className={`fas fa-th-large fa-2x ${activeCategoryId === null ? 'text-primary' : 'text-secondary'}`}></i>
                        </div>
                        <p className={`mt-2 fw-bold ${activeCategoryId === null ? 'text-primary' : ''}`}>Tất cả</p>
                    </div>

                    {/* Vòng lặp hiển thị danh mục */}
                    {categories.map((cat) => {
                        const id = cat.id || cat.categoryId;
                        const name = cat.name || cat.categoryName;
                        let rawUrl = cat.imageUrl || cat.ImageUrl;
                        let imageUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${BASE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`) : null;

                        return (
                            <div
                                key={id}
                                className="category-item-container"
                                onClick={() => onCategoryChange(id)}
                                style={itemStyle}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img
                                    src={imageUrl || placeholder}
                                    alt={name}
                                    className={`rounded-circle border border-3 ${activeCategoryId === id ? 'border-primary shadow' : 'border-secondary'}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', backgroundColor: '#fff' }}
                                    onError={(e) => { e.target.src = placeholder; }}
                                />
                                <p className={`mt-2 text-truncate fw-semibold ${activeCategoryId === id ? 'text-primary' : ''}`} style={{ fontSize: '0.9rem' }}>
                                    {name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
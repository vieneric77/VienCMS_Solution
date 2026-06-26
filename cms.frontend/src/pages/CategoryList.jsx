import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ onSelectCategory }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        if (onSelectCategory) {
            onSelectCategory(id);
        }
    };

    if (loading) {
        return <div className="text-center my-4">Đang tải danh mục sản phẩm...</div>;
    }

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary mr-2" style={{ fontSize: '1.3rem' }}></i> Danh mục SP
                </h5>
            </div>

            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all ${selectedId === null ? 'bg-light font-weight-bold text-primary' : ''}`}
                        style={{ fontSize: '0.95rem', color: selectedId === null ? '#007bff' : '#495057' }}
                        onClick={() => handleSelect(null)}
                    >
                        <span>Tất cả sản phẩm</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: selectedId === null ? 1 : 0.5 }}></i>
                    </button>

                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all ${selectedId === item.id ? 'bg-light font-weight-bold text-primary' : ''}`}
                                style={{ fontSize: '0.95rem', color: selectedId === item.id ? '#007bff' : '#495057' }}
                                onClick={() => handleSelect(item.id)}
                            >
                                <span>{item.name}</span>
                                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.8rem', opacity: selectedId === item.id ? 1 : 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;
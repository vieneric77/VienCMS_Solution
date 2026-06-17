import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = ({ selectedCategoryId, onSelectProduct }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = "https://localhost:7231";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (selectedCategoryId === null || selectedCategoryId === undefined) {
                    data = await productService.getAllProducts();
                } else {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    const getFullImageUrl = (url) => {
        if (!url) return "https://picsum.photos/400/250";
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${BACKEND_URL}${cleanUrl}`;
    };

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm thời trang...</div>;
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12">
                    <p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-4 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border">
                            <img
                                src={getFullImageUrl(item.imageUrl)}
                                className="card-img-top"
                                alt={item.name}
                                style={{ height: '240px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-dark">{item.name}</h5>
                                <p className="card-text text-danger font-weight-bold mb-1">
                                    Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                                <p className="card-text small text-muted mb-0">Số lượng tồn kho: {item.stockQuantity} sản phẩm</p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0">
                                <button
                                    className="btn btn-outline-primary btn-block btn-sm"
                                    onClick={() => onSelectProduct?.(item.id)}
                                >
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
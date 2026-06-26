import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BACKEND_URL = "https://localhost:7231";

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const getFullImageUrl = (url) => {
        if (!url) return "https://picsum.photos/400/250";
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${BACKEND_URL}${cleanUrl}`;
    };

    if (loading) {
        return <div className="text-center my-4">Đang tải chi tiết sản phẩm...</div>;
    }

    if (!product) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Không tìm thấy sản phẩm.</div>
                <button onClick={() => navigate('/')} className="btn btn-secondary">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow border-light">
                <div className="card-header bg-dark text-white py-3">
                    <h4 className="mb-0 font-weight-bold">{product.name}</h4>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 text-center mb-4">
                            <img
                                src={getFullImageUrl(product.imageUrl)}
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                                alt={product.name}
                            />
                        </div>
                        <div className="col-md-6">
                            <h3 className="text-dark font-weight-bold mb-3">{product.name}</h3>
                            <h4 className="text-danger font-weight-bold mb-3">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </h4>
                            <p className="text-muted mb-4">
                                <strong>Tình trạng kho:</strong> {product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} sản phẩm)` : "Hết hàng"}
                            </p>
                            <h5 className="font-weight-bold text-secondary">Mô tả sản phẩm:</h5>
                            <div
                                className="text-dark lh-lg"
                                dangerouslySetInnerHTML={{ __html: product.description || "Chưa có mô tả cho sản phẩm này." }}
                            />
                            <button className="btn btn-primary mt-3">
                                <i className="fa-solid fa-cart-shopping mr-2"></i> Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white py-3 border-top-0">
                    <button onClick={() => navigate('/shop')} className="btn btn-outline-secondary">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
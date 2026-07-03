import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// Import hằng số từ axiosClient để quản lý tập trung
import { IMAGE_BASE_URL } from '../../api/axiosClient';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                const cleanData = data?.$values ? data.$values[0] : data;
                setProduct(cleanData);
                setQuantity(1);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProductDetail();
    }, [id]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Helper xử lý URL ảnh
    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/500";
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
        if (type === 'increase') {
            if (quantity < (product?.stockQuantity || 0)) {
                setQuantity(quantity + 1);
            } else {
                alert("Số lượng sản phẩm trong kho không đủ!");
            }
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (quantity > product.stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            const totalQty = existingItem.quantity + quantity;
            if (totalQty > product.stockQuantity) {
                alert(`Không thể thêm! Chỉ còn ${product.stockQuantity} sản phẩm trong kho.`);
                return;
            }
            existingItem.quantity = totalQty;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    if (loading) return <div className="text-center py-5">Đang tải...</div>;
    if (!product) return <div className="text-center py-5">Sản phẩm không tồn tại.</div>;

    return (
        <>
            <Header />
            <div className="container my-5">
                <nav className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-5">
                    <div className="col-md-6">
                        <div className="p-4 border rounded bg-light">
                            <img
                                src={getImageUrl(product.imageUrl)}
                                alt={product.name}
                                className="img-fluid"
                                style={{ width: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h2 className="mb-3">{product.name}</h2>
                        <h3 className="text-primary mb-3">{formatCurrency(product.price)}</h3>

                        <div className="mb-4">
                            <h5>Mô tả sản phẩm</h5>
                            <div
                                className="text-muted"
                                dangerouslySetInnerHTML={{
                                    __html: product.description || "Chưa có mô tả chi tiết cho sản phẩm này."
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            Số lượng còn: <span className="fw-bold">{product.stockQuantity}</span>
                        </div>

                        {product.stockQuantity > 0 ? (
                            <div className="card p-3 border-0 bg-light">
                                <div className="d-flex align-items-center mb-3">
                                    <span className="me-3">Số lượng:</span>
                                    <div className="btn-group">
                                        <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('decrease')}>-</button>
                                        <input type="text" className="form-control text-center" style={{ width: '50px' }} value={quantity} readOnly />
                                        <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('increase')}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-success btn-lg w-100" onClick={handleAddToCart}>
                                    THÊM VÀO GIỎ
                                </button>
                            </div>
                        ) : (
                            <div className="alert alert-danger">Sản phẩm tạm hết hàng.</div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

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

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'increase' && quantity < (product?.stockQuantity || 1)) setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            const totalQty = existingItem.quantity + quantity;
            if (totalQty > product.stockQuantity) {
                alert(`Không thể thêm! Số lượng đã vượt quá tồn kho.`);
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

    if (loading) {
        return (
            <>
                <Header />
                <div className="container my-5 text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="container my-5 text-center py-5">
                    <div className="alert alert-warning">Sản phẩm không tồn tại.</div>
                    <Link to="/" className="btn btn-primary">Về trang chủ</Link>
                </div>
                <Footer />
            </>
        );
    }

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
                        <div className="p-4 border rounded bg-light shadow-sm">
                            <img
                                src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`) : "https://via.placeholder.com/500"}
                                alt={product.name}
                                className="img-fluid"
                                style={{ width: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h2 className="mb-3">{product.name}</h2>
                        <h3 className="text-primary mb-2">{formatCurrency(product.price)}</h3>

                        <div className="mb-4 text-muted" style={{ fontSize: '0.95rem' }}>
                            Số lượng còn: <span className="fw-bold text-dark">{product.stockQuantity}</span>
                        </div>

                        <div className="mb-4">
                            <h5>Mô tả sản phẩm</h5>
                            <p className="text-muted">{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                        </div>

                        {product.stockQuantity > 0 ? (
                            <div className="card p-3 border-0 bg-light">
                                <div className="d-flex align-items-center mb-3">
                                    <span className="me-3">Số lượng mua:</span>
                                    <div className="btn-group">
                                        <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('decrease')}>-</button>
                                        <input type="text" className="form-control text-center" style={{ width: '50px' }} value={quantity} readOnly />
                                        <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange('increase')}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-success btn-lg w-100" onClick={handleAddToCart}>
                                    <i className="bi bi-cart-plus"></i> THÊM VÀO GIỎ
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
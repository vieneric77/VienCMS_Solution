import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// Import hằng số cấu hình tập trung
import { IMAGE_BASE_URL } from '../../api/axiosClient';
// Import service để kiểm tra tồn kho (giả sử bạn có service này)
import productService from '../../services/productService';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const customerId = localStorage.getItem('customerId');
    const customerName = localStorage.getItem('customerName');

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    // Cập nhật số lượng với kiểm tra tồn kho
    const updateQuantity = async (productId, newQty) => {
        if (newQty < 1) return;

        try {
            // Kiểm tra tồn kho từ Server/Service để đảm bảo chính xác
            const product = await productService.getProductById(productId);
            const cleanProduct = product?.$values ? product.$values[0] : product;

            if (newQty > cleanProduct.stockQuantity) {
                alert(`Không thể cập nhật! Sản phẩm chỉ còn ${cleanProduct.stockQuantity} trong kho.`);
                return;
            }

            const updated = cartItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQty } : item
            );
            setCartItems(updated);
            localStorage.setItem('cart', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Lỗi kiểm tra tồn kho:", error);
            alert("Có lỗi xảy ra khi kiểm tra tồn kho, vui lòng thử lại.");
        }
    };

    const removeItem = (productId, productName) => {
        if (window.confirm(`Bạn muốn gỡ cuốn "${productName}" khỏi kệ sách dự kiến?`)) {
            const updated = cartItems.filter(item => item.productId !== productId);
            setCartItems(updated);
            localStorage.setItem('cart', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
        }
    };

    const clearAllCart = () => {
        if (window.confirm("Bạn có chắc chắn muốn làm trống kệ sách dự kiến này không?")) {
            setCartItems([]);
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getProductImage = (url) => {
        if (!url) return 'https://via.placeholder.com/150?text=No+Image';
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <div className="container my-5 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
                    <h4 className="font-weight-bold m-0" style={{ color: '#0D2C54' }}>
                        <i className="fas fa-book-reader text-success mr-2"></i> KỆ SÁCH DỰ KIẾN
                    </h4>
                    {cartItems.length > 0 && (
                        <button className="btn btn-outline-danger btn-sm font-weight-bold" onClick={clearAllCart} style={{ borderRadius: '50px' }}>
                            <i className="fas fa-trash-alt mr-1"></i> Xóa tất cả
                        </button>
                    )}
                </div>

                {submitStatus.text && <div className={`alert alert-${submitStatus.type} mb-4`}>{submitStatus.text}</div>}

                {cartItems.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded border shadow-sm">
                        <i className="fas fa-book-open text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted font-weight-medium">Kệ sách dự kiến của bạn đang trống.</p>
                        <Link to="/shop" className="btn text-white font-weight-bold px-4" style={{ backgroundColor: '#00b894', borderRadius: '50px' }}>Khám phá thêm sách</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                                <h6 className="font-weight-bold border-bottom pb-2 mb-3 text-muted">Danh mục chọn</h6>
                                {cartItems.map(item => (
                                    <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3" key={item.productId}>
                                        <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                            <img
                                                src={getProductImage(item.imageUrl)}
                                                alt={item.name}
                                                className="img-thumbnail"
                                                style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <h6 className="mb-1 font-weight-bold">{item.name}</h6>
                                                <span className="text-success small font-weight-bold">{new Intl.NumberFormat('vi-VN').format(item.price)} ₫</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                            <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                                <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                                                <input type="text" className="form-control text-center bg-white" value={item.quantity} readOnly />
                                                <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="btn btn-link text-danger" onClick={() => removeItem(item.productId, item.name)}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-right font-weight-bold h5 text-dark mt-2">
                                    Tổng cộng: <span className="text-success">{new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                                <h6 className="font-weight-bold border-bottom pb-2 mb-3 text-muted">Thông tin xác nhận</h6>
                                {customerId ? (
                                    <div>
                                        <div className="alert alert-info py-2 small mb-3">
                                            <i className="fas fa-user mr-2"></i> Độc giả: <strong>{customerName}</strong>
                                        </div>
                                        <button className="btn btn-block text-white font-weight-bold py-3" style={{ backgroundColor: '#00b894', border: 'none', borderRadius: '50px' }} onClick={() => navigate('/checkout')}>
                                            <i className="fas fa-check mr-2"></i> XÁC NHẬN ĐẶT SÁCH
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <div className="alert alert-warning small mb-4">Vui lòng đăng nhập để hoàn tất đơn hàng.</div>
                                        <Link to="/login" className="btn btn-dark btn-block font-weight-bold py-2" style={{ borderRadius: '50px' }}>Đăng nhập</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CartPage;
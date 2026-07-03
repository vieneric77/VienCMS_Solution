import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

    const navigate = useNavigate();
    const customerId = localStorage.getItem('customerId');

    // Hàm lấy URL ảnh chuẩn
    const getProductImage = (url) => {
        if (!url) return 'https://via.placeholder.com/60?text=No+Img';
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }
        setCartItems(storedCart);

        const fetchUserProfile = async () => {
            if (!customerId) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`https://localhost:7024/api/Customers/${customerId}`);
                const userData = response.data;
                setFullName(userData.fullName || '');
                setPhone(userData.phone || '');
                setAddress(userData.address || '');
            } catch (err) {
                console.error("Lỗi khi tải thông tin:", err);
            }
        };
        fetchUserProfile();
    }, [navigate, customerId]);

    const validateForm = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'Họ và tên là bắt buộc.';
        if (!phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc.';
        if (!address.trim()) newErrors.address = 'Địa chỉ là bắt buộc.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            setSubmitStatus({ type: 'danger', text: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).' });
            return;
        }

        const payload = {
            customerId: Number(customerId),
            customerName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            notes: notes.trim(),
            items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
        };

        try {
            await axios.post('https://localhost:7024/api/CartApi/checkout', payload);
            localStorage.removeItem('cart');
            alert('Đặt hàng thành công!');
            navigate('/');
        } catch (err) {
            setSubmitStatus({ type: 'danger', text: 'Có lỗi xảy ra, vui lòng thử lại.' });
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <div className="container my-5" style={{ maxWidth: '900px' }}>
                <h4 className="mb-4 fw-bold">THANH TOÁN</h4>
                <div className="row">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm p-4 mb-4">
                            <h5 className="mb-4" style={{ color: '#00b894' }}>Thông tin liên hệ</h5>
                            <div className="mb-3">
                                <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                <input type="text" className={`form-control ${errors.address ? 'is-invalid' : ''}`} value={address} onChange={(e) => setAddress(e.target.value)} />
                                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ghi chú</label>
                                <textarea className="form-control" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="mb-3">Đơn hàng</h5>
                            {cartItems.map(item => (
                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" key={item.productId}>
                                    <div className="d-flex align-items-center">
                                        <img src={getProductImage(item.imageUrl)} alt={item.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} className="me-3" />
                                        <div>
                                            <div className="fw-bold small">{item.name}</div>
                                            <div className="text-muted small">SL: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <span className="small">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} ₫</span>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between fw-bold h5 mt-2">
                                <span>Tổng cộng:</span>
                                <span className="text-success">{new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫</span>
                            </div>
                            <button className="btn btn-success w-100 mt-3 py-2" onClick={handleCheckout}>HOÀN TẤT ĐẶT SÁCH</button>
                            {submitStatus.text && <div className={`alert alert-${submitStatus.type} mt-3`}>{submitStatus.text}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CheckoutPage;
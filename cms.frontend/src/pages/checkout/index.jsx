import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);

    // States cho form thông tin (Read-only)
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // State cho ghi chú (Editable)
    const [notes, setNotes] = useState('');

    // States quản lý UI
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

    const navigate = useNavigate();
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        // Kiểm tra giỏ hàng
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            navigate('/cart');
            return;
        }
        setCartItems(storedCart);

        // Lấy thông tin User từ API để điền sẵn vào form
        const fetchUserProfile = async () => {
            if (!customerId) {
                navigate('/login');
                return;
            }
            try {
                // Đổi URL này cho khớp với endpoint lấy chi tiết User của bạn
                const response = await axios.get(`https://localhost:7024/api/Customers/${customerId}`);
                const userData = response.data;

                setFullName(userData.fullName || localStorage.getItem('customerName') || '');
                setPhone(userData.phone || '');
                setAddress(userData.address || '');
            } catch (err) {
                console.error("Lỗi khi tải thông tin người dùng:", err);
                // Fallback nếu lỗi API
                setFullName(localStorage.getItem('customerName') || '');
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserProfile();
    }, [navigate, customerId]);

    const validateForm = () => {
        const newErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng cập nhật Họ và tên trong Hồ sơ.';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Vui lòng cập nhật Số điện thoại trong Hồ sơ.';
        }
        if (!address.trim()) {
            newErrors.address = 'Vui lòng cập nhật Địa chỉ nhận hàng trong Hồ sơ.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        setSubmitStatus({ type: '', text: '' });

        if (!customerId) {
            setSubmitStatus({ type: 'danger', text: 'Vui lòng đăng nhập để thực hiện đặt sách!' });
            return;
        }

        if (!validateForm()) {
            setSubmitStatus({
                type: 'danger',
                text: 'Thông tin giao hàng chưa đầy đủ! Vui lòng nhấn "Thay đổi thông tin" để cập nhật hồ sơ.'
            });
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
            setSubmitStatus({ type: 'danger', text: 'Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau.' });
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <div className="container my-5 flex-grow-1" style={{ maxWidth: '800px' }}>
                <h4 className="mb-4 fw-bold">XÁC NHẬN ĐƠN HÀNG</h4>

                {submitStatus.text && (
                    <div className={`alert alert-${submitStatus.type}`}>
                        {submitStatus.text}
                    </div>
                )}

                <div className="card border-0 rounded-4 shadow-sm p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0" style={{ color: '#00b894' }}>Thông tin giao hàng</h5>
                        <Link to="/profile" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                            <i className="fas fa-edit me-1"></i> Thay đổi thông tin
                        </Link>
                    </div>

                    {isLoadingUser ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status"></div>
                            <div className="mt-2 text-muted">Đang tải thông tin...</div>
                        </div>
                    ) : (
                        <>
                            <div className="alert alert-info py-2" style={{ fontSize: '0.9rem' }}>
                                <i className="fas fa-info-circle me-2"></i>
                                Thông tin giao hàng được lấy tự động từ tài khoản của bạn.
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-muted">Họ và tên <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control bg-light ${errors.fullName ? 'is-invalid' : ''}`}
                                        value={fullName}
                                        readOnly
                                    />
                                    {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-muted">Số điện thoại <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control bg-light ${errors.phone ? 'is-invalid' : ''}`}
                                        value={phone}
                                        readOnly
                                    />
                                    {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold text-muted">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control bg-light ${errors.address ? 'is-invalid' : ''}`}
                                    value={address}
                                    readOnly
                                />
                                {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">Ghi chú thêm</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Lưu ý cho người giao hàng (nếu có)..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                className="btn btn-lg w-100 fw-bold text-white rounded-pill"
                                style={{ backgroundColor: '#00b894', border: 'none' }}
                                onClick={handleCheckout}
                                disabled={!fullName || !phone || !address}
                            >
                                HOÀN TẤT ĐẶT SÁCH
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CheckoutPage;
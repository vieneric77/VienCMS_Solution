import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const response = await axios.post('https://localhost:7024/api/AuthApi/register', formData);
            setMsg({ type: 'success', text: response.data.message || 'Đăng ký thành công!' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMsg({
                type: 'danger',
                text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div className="card border-0 shadow-lg" style={{ width: "450px", borderRadius: "18px" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-user-plus" style={{ fontSize: "45px", color: "#ff7f50" }}></i>
                        <h3 className="mt-3 mb-2" style={{ color: "#0D2C54", fontWeight: "700" }}>Đăng ký</h3>
                        <p className="text-muted mb-0">Tạo tài khoản mới để bắt đầu mua sắm</p>
                    </div>

                    {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Các trường nhập liệu với cùng style như Login */}
                        {[
                            { name: "fullName", placeholder: "Họ và tên", icon: "user" },
                            { name: "email", placeholder: "Email", icon: "envelope" },
                            { name: "phone", placeholder: "Số điện thoại", icon: "phone" },
                            { name: "address", placeholder: "Địa chỉ", icon: "map-marker-alt" },
                            { name: "password", placeholder: "Mật khẩu", icon: "lock", type: "password" }
                        ].map((field) => (
                            <div className="mb-3" key={field.name}>
                                <div className="input-group">
                                    <span className="input-group-text bg-white"><i className={`fas fa-${field.icon} text-secondary`}></i></span>
                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        className="form-control"
                                        placeholder={field.placeholder}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ))}

                        <button className="btn w-100 py-2 mt-3" type="submit" disabled={loading}
                            style={{ backgroundColor: "#0D2C54", color: "#fff", borderRadius: "10px", fontWeight: "600", fontSize: "17px" }}>
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>

                    <hr className="my-4" />
                    <div className="text-center">
                        <span className="text-muted">Đã có tài khoản? </span>
                        <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#ff7f50" }}>Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
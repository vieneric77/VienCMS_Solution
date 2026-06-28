import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [generatedPwd, setGeneratedPwd] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setMessage('');
        setGeneratedPwd('');

        try {
            const res = await axios.post('https://localhost:7024/api/AuthApi/forgot-password', { email });
            setMessage(res.data.message);
            setGeneratedPwd(res.data.newPassword);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Đã xảy ra lỗi kết nối!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div className="card border-0 shadow-lg" style={{ width: "420px", borderRadius: "18px" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-key" style={{ fontSize: "45px", color: "#ff7f50" }}></i>
                        <h3 className="mt-3 mb-2" style={{ color: "#0D2C54", fontWeight: "700" }}>Khôi phục mật khẩu</h3>
                        <p className="text-muted mb-0">Nhập email để nhận mật khẩu mới.</p>
                    </div>

                    {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                    {message && (
                        <div className="alert alert-success">
                            <p className="mb-2 font-weight-bold">{message}</p>
                            <div className="bg-white p-2 rounded text-center border border-success">
                                Mật khẩu mới: <strong className="text-danger">{generatedPwd}</strong>
                            </div>
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="fas fa-envelope text-secondary"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập email của bạn"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn w-100 py-2" disabled={loading}
                                style={{ backgroundColor: "#0D2C54", color: "#fff", borderRadius: "10px", fontWeight: "600", fontSize: "17px" }}>
                                {loading ? "Đang xử lý..." : "Cấp lại mật khẩu"}
                            </button>
                        </form>
                    )}

                    <hr className="my-4" />
                    <div className="text-center">
                        <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#ff7f50" }}>
                            <i className="fas fa-arrow-left me-2"></i> Quay lại Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
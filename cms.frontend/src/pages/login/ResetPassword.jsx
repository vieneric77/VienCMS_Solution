import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        const email = sessionStorage.getItem('resetEmail');
        const otp = sessionStorage.getItem('resetOtp');

        setLoading(true);
        try {
            await authService.resetPassword(email, otp, password);
            alert("Đổi mật khẩu thành công!");
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetOtp');
            navigate('/login');
        } catch (error) {
            alert("Lỗi! Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div className="card border-0 shadow-lg" style={{ width: "420px", borderRadius: "18px" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-lock" style={{ fontSize: "45px", color: "#ff7f50" }}></i>
                        <h3 className="mt-3 mb-2" style={{ color: "#0D2C54", fontWeight: "700" }}>Mật khẩu mới</h3>
                        <p className="text-muted mb-0">Vui lòng nhập mật khẩu mới của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control py-2"
                                placeholder="Mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="form-control py-2"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100 py-2" disabled={loading}
                            style={{ backgroundColor: "#0D2C54", color: "#fff", borderRadius: "10px", fontWeight: "600" }}>
                            {loading ? "Đang xử lý..." : "Xác nhận đổi"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const email = sessionStorage.getItem('resetEmail');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.verifyOtp(email, otp);
            sessionStorage.setItem('resetOtp', otp); // Lưu OTP để dùng bước reset
            navigate('/login/reset-password');
        } catch (error) {
            alert("Mã OTP không đúng hoặc đã hết hạn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <div className="card border-0 shadow-lg" style={{ width: "420px", borderRadius: "18px" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-shield-alt" style={{ fontSize: "45px", color: "#ff7f50" }}></i>
                        <h3 className="mt-3 mb-2" style={{ color: "#0D2C54", fontWeight: "700" }}>Xác thực OTP</h3>
                        <p className="text-muted mb-0">Mã xác thực đã được gửi đến email của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control py-2 text-center"
                                style={{ fontSize: "20px", letterSpacing: "10px" }}
                                placeholder="000000"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100 py-2" disabled={loading}
                            style={{ backgroundColor: "#0D2C54", color: "#fff", borderRadius: "10px", fontWeight: "600" }}>
                            {loading ? "Đang xác thực..." : "Xác thực ngay"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
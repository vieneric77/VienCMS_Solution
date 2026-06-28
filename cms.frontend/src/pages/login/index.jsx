import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axios.post(
                "https://localhost:7024/api/AuthApi/login",
                credentials
            );

            if (res.data.role !== "Khách hàng") {
                setErrorMsg(
                    "Tài khoản quản trị viên không được phép đăng nhập vào hệ thống mua sắm."
                );
                setLoading(false);
                return;
            }

            localStorage.clear();
            localStorage.setItem("customerId", res.data.customerId);
            localStorage.setItem("customerName", res.data.fullName);

            window.location.href = "/";
        } catch (err) {
            setErrorMsg(
                err.response?.data?.message ||
                "Email hoặc mật khẩu không chính xác."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background: "#f5f6fa",
            }}
        >
            <div
                className="card border-0 shadow-lg"
                style={{
                    width: "420px",
                    borderRadius: "18px",
                }}
            >
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i
                            className="fas fa-book-open"
                            style={{
                                fontSize: "45px",
                                color: "#ff7f50",
                            }}
                        ></i>

                        <h3
                            className="mt-3 mb-2"
                            style={{
                                color: "#0D2C54",
                                fontWeight: "700",
                            }}
                        >
                            Đăng nhập
                        </h3>

                        <p className="text-muted mb-0">
                            Chào mừng bạn quay trở lại!
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="alert alert-danger">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Email
                            </label>

                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-envelope text-secondary"></i>
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Nhập email"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label fw-bold">
                                Mật khẩu
                            </label>

                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="fas fa-lock text-secondary"></i>
                                </span>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Nhập mật khẩu"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="text-end mb-4">
                            <Link
                                to="/forgot-password"
                                className="text-decoration-none"
                                style={{ color: "#ff7f50" }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            className="btn w-100 py-2"
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: "#0D2C54",
                                color: "#fff",
                                borderRadius: "10px",
                                fontWeight: "600",
                                fontSize: "17px",
                            }}
                        >
                            {loading
                                ? "Đang đăng nhập..."
                                : "Đăng nhập"}
                        </button>
                    </form>

                    <hr className="my-4" />

                    <div className="text-center">
                        <span className="text-muted">
                            Chưa có tài khoản?
                        </span>{" "}
                        <Link
                            to="/register"
                            className="fw-bold text-decoration-none"
                            style={{ color: "#ff7f50" }}
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
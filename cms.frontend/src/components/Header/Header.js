import React from 'react';
import './Header.css'; // Chúng ta sẽ tạo file CSS này ở bước 2

const Header = () => {
    return (
        <header className="header">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="container">
                    <div className="contact-info">
                        <span>📞 Hotline: 0347511148</span>
                        <span>✉ Email: support@viencms.retail</span>
                    </div>
                    <div className="auth-links">
                        <span>Đăng nhập</span>
                        <span>Đăng ký</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="main-header container">
                <div className="logo">
                    <h2>VienCMS.Fashion</h2>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm mẫu đầm dạ hội, sơ mi công sở..." />
                    <button><i className="fa fa-search"></i></button>
                </div>
                <div className="cart-icon">
                    <i className="fa fa-shopping-bag"></i>
                    <span className="badge">0</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="navbar container">
                <ul>
                    <li>Trang Chủ</li>
                    <li>Cửa Hàng</li>
                    <li>Tin Tức / Blog</li>
                    <li>Về Chúng Tôi</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
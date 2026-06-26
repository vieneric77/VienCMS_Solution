import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Header.css';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleComingSoon = (e) => {
        e.preventDefault();
        alert("Tính năng này đang được phát triển, vui lòng quay lại sau nhé! 🛠️");
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
        }
    };

    return (
        <header className="header">
            <div className="top-bar">
                <div className="container">
                    <div className="contact-info">
                        <span>📞 Hotline: 0347511148</span>
                        <span>✉ Email: support@viencms.retail</span>
                    </div>
                    <div className="auth-links">
                        <span onClick={handleComingSoon}>Đăng nhập</span>
                        <span onClick={handleComingSoon}>Đăng ký</span>
                    </div>
                </div>
            </div>

            <div className="main-header container">
                <div className="logo">
                    <Link to="/"><h2>VienCMS.Fashion</h2></Link>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm mẫu đầm dạ hội, sơ mi công sở..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}><i className="fa fa-search"></i></button>
                </div>
                <div className="cart-icon">
                    <Link to="/cart">
                        <i className="fa fa-shopping-bag"></i>
                        <span className="badge">0</span>
                    </Link>
                </div>
            </div>

            <nav className="navbar container">
                <ul>
                    <li><Link to="/">Trang Chủ</Link></li>
                    <li><Link to="/shop">Cửa Hàng</Link></li>
                    <li><Link to="/blog">Tin Tức / Blog</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
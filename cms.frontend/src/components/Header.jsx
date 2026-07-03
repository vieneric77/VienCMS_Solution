import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const updateCartBadge = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(totalItems);
        };

        updateCartBadge();
        window.addEventListener('storage', updateCartBadge);
        const interval = setInterval(updateCartBadge, 1000);

        return () => {
            window.removeEventListener('storage', updateCartBadge);
            clearInterval(interval);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getNavStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            fontSize: '15px',
            color: isActive ? '#075955' : '#495057',
            fontWeight: isActive ? 'bold' : '500',
            borderBottom: isActive ? '3px solid #075955' : '3px solid transparent',
            textDecoration: 'none',
            display: 'block',
            transition: 'all 0.2s ease-in-out'
        };
    };

    return (
        <header className="shadow-sm sticky-top" style={{ zIndex: 1050 }}>

            <div className="top-bar py-2" style={{ backgroundColor: '#111827', color: '#E5E7EB', fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left d-none d-sm-flex align-items-center" style={{ gap: '25px' }}>
                        <span>
                            <i className="fas fa-headset mr-2" style={{ color: '#10B981' }}></i>
                            Hỗ trợ độc giả: <strong className="text-white">0347511148</strong>
                        </span>
                        <span>
                            <i className="fas fa-shipping-fast mr-2" style={{ color: '#10B981' }}></i>
                            Miễn phí giao hàng cho đơn từ 250k
                        </span>
                    </div>
                    <div className="top-bar-right ml-auto">
                        {authService.isAuthenticated() ? (
                            <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                <Link to="/profile" className="text-decoration-none d-flex align-items-center" style={{ color: '#E5E7EB' }}>
                                    <i className="fas fa-user-circle mr-2" style={{ color: '#10B981', fontSize: '16px' }}></i>
                                    <span>Xin chào, <strong className="text-white">{localStorage.getItem('customerName')}</strong></span>
                                </Link>
                                <span style={{ color: '#4B5563' }}>|</span>
                                <button
                                    className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
                                    onClick={authService.logout}
                                    style={{ color: '#E5E7EB', fontSize: '13px' }}
                                >
                                    <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                                <Link to="/login" className="text-decoration-none hover-text-green" style={{ color: '#E5E7EB' }}>
                                    <i className="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                                </Link>
                                <span style={{ color: '#4B5563' }}>|</span>
                                <Link to="/register" className="text-decoration-none hover-text-green" style={{ color: '#E5E7EB' }}>
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="py-3" style={{ background: 'linear-gradient(90deg, #03423f 0%, #075955 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-3 col-md-4 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="m-0 d-flex align-items-center" style={{ fontWeight: '800' }}>
                                    <i className="fas fa-book-open mr-2" style={{ color: '#10B981' }}></i>
                                    <span style={{ color: '#FFFFFF' }}>ThaiVien</span>
                                    <span style={{ color: '#10B981', fontWeight: '400' }}>.Books</span>
                                </h3>
                            </Link>
                        </div>

                        <div className="col-lg-6 col-md-5 d-none d-md-block">
                            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Bạn cần tìm cuốn sách tâm đắc nào?..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '48px',
                                        padding: '10px 120px 10px 25px',
                                        borderRadius: '50px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: '#FFFFFF',
                                        fontSize: '14.5px',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                                        color: '#333'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        position: 'absolute',
                                        right: '5px',
                                        height: '38px',
                                        borderRadius: '50px',
                                        backgroundColor: '#10B981',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        padding: '0 20px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <i className="fas fa-search"></i> Tìm kiếm
                                </button>
                            </form>
                        </div>

                        <div className="col-lg-3 col-md-3 col-6 text-right">
                            <Link
                                to="/cart"
                                className="btn position-relative d-inline-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: '50px', height: '50px', color: '#FFFFFF', border: '2px solid rgba(16, 185, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.05)', transition: 'all 0.3s' }}
                            >
                                <i className="fas fa-shopping-bag" style={{ fontSize: '20px' }}></i>
                                <span
                                    className="badge position-absolute"
                                    style={{
                                        top: '-4px',
                                        right: '-4px',
                                        backgroundColor: '#EF4444',
                                        color: '#FFF',
                                        fontSize: '12px',
                                        width: '22px',
                                        height: '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 0 2px #075955'
                                    }}
                                >
                                    {cartCount}
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <div className="bg-white border-bottom py-2">
                <div className="container d-flex justify-content-center">
                    <nav className="navbar navbar-expand p-0">
                        <ul
                            className="navbar-nav d-flex flex-row flex-wrap align-items-center m-0 px-4 py-1"
                            style={{
                                listStyle: 'none',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '50px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link to="/" className="py-2 px-3" style={getNavStyle('/')}>
                                    Trang Chủ
                                </Link>
                            </li>
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link to="/shop" className="py-2 px-3" style={getNavStyle('/shop')}>
                                    Khám Phá Kệ Sách
                                </Link>
                            </li>
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link to="/blog" className="py-2 px-3" style={getNavStyle('/blog')}>
                                    Góc Review
                                </Link>
                            </li>
                            <li className="nav-item" style={{ margin: '0 10px' }}>
                                <Link to="/about" className="py-2 px-3" style={getNavStyle('/about')}>
                                    Về Chúng Tôi
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </header >
    );
}

export default Header;
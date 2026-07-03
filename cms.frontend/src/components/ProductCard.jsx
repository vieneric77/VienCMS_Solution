import React from 'react';
import { Link } from 'react-router-dom';
import cartService from '../services/cartService';
import { IMAGE_BASE_URL } from '../api/axiosClient'; 

function ProductCard({ item }) {
    if (!item) return null;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const getProductImage = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500';
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    const handleAddToCartClick = () => {
        cartService.addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl
        });
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div
            className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden product-card"
            style={{
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(0,0,0,.15)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
            }}
        >
            <div className="position-relative overflow-hidden bg-light" style={{ height: '220px' }}>
                <Link to={`/product/${item.id}`}>
                    <img
                        src={getProductImage(item.imageUrl)}
                        className="w-100 h-100 object-fit-contain p-3"
                        alt={item.name}
                        style={{ transition: 'transform 0.5s' }}
                    />
                </Link>

                {item.stockQuantity <= 5 && item.stockQuantity > 0 && (
                    <span className="position-absolute top-0 start-0 m-2 badge bg-danger rounded-pill px-2">
                        Còn {item.stockQuantity} sản phẩm
                    </span>
                )}

                {item.stockQuantity === 0 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 text-white fw-bold">
                        HẾT HÀNG
                    </div>
                )}
            </div>

            <div className="card-body p-3 d-flex flex-column">
                <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                    {item.brand || "Viên Bookstore"}
                </small>

                <h6 className="card-title fw-bold text-truncate mt-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">{item.name}</Link>
                </h6>

                <div className="fw-bold text-success mb-2" style={{ fontSize: '1.1rem' }}>
                    {formatCurrency(item.price)}
                </div>

                <div className="mb-3" style={{ fontSize: '0.85rem', color: item.stockQuantity < 5 ? '#d63031' : '#6c757d' }}>
                    Số lượng còn: <span className="fw-bold">{item.stockQuantity}</span>
                </div>

                <div className="mt-auto d-flex gap-2">
                    <Link to={`/product/${item.id}`}
                        className="btn btn-outline-dark btn-sm flex-fill rounded-pill py-2 d-flex align-items-center justify-content-center"
                        style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                        <i className="fas fa-eye me-1"></i> Chi tiết
                    </Link>

                    <button onClick={handleAddToCartClick}
                        disabled={item.stockQuantity === 0}
                        className="btn btn-dark btn-sm flex-fill rounded-pill py-2"
                        style={{
                            fontSize: '0.8rem',
                            backgroundColor: item.stockQuantity === 0 ? '#ccc' : '#00b894',
                            border: 'none',
                            fontWeight: '600'
                        }}>
                        <i className="fas fa-shopping-cart me-1"></i> Mua
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
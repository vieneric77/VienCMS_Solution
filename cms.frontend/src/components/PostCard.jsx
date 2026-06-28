import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

function PostCard({ post }) {
    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=500';
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    return (
        <div className="card h-100 border-0 rounded-4 shadow-hover" style={{ transition: 'all 0.4s ease', background: '#fff' }}>
            <div className="position-relative overflow-hidden rounded-top-4" style={{ height: '200px' }}>
                <img
                    src={getImageUrl(post.imageUrl)}
                    className="w-100 h-100 object-fit-cover"
                    alt={post.title}
                    style={{ transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                />
                <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill" style={{ background: 'rgba(0, 184, 148, 0.9)', fontSize: '0.75rem', color: '#fff' }}>
                    <i className="fas fa-tag me-1"></i> Kiến thức sách
                </div>
            </div>

            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                    <i className="far fa-clock me-2"></i>
                    {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới nhất'}
                </div>

                <h5 className="card-title fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#2d3436' }}>
                    <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark stretched-link">
                        {post.title}
                    </Link>
                </h5>

                <p className="card-text text-secondary mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary || 'Khám phá những tri thức quý báu được đúc kết từ những trang sách tinh hoa nhất dành cho mọi độc giả yêu văn hóa đọc...'}
                </p>

                <div className="mt-auto">
                    <Link
                        to={`/blog/${post.id}`}
                        className="btn btn-sm btn-outline-dark rounded-pill px-4 py-2"
                        style={{ fontSize: '0.85rem' }}
                    >
                        Xem chi tiết <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                </div>
            </div>

            <style>{`
                .shadow-hover:hover {
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                    transform: translateY(-5px);
                }
                .shadow-hover:hover img {
                    transform: scale(1.1);
                }
                .rounded-top-4 { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
                .rounded-4 { border-radius: 1rem; }
            `}</style>
        </div>
    );
}

export default PostCard;
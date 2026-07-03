import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveBanners } from '../services/bannerService';
import { IMAGE_BASE_URL } from '../api/axiosClient';

function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await getActiveBanners();
                setBanners(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [banners]);

    if (loading) return <div className="my-4 rounded shadow-sm" style={{ height: '400px', background: '#f8f9fa' }}></div>;
    if (error || banners.length === 0) return <DefaultBanner />;

    const current = banners[activeIndex];

    // Helper xử lý URL ảnh chuẩn hóa
    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

    return (
        <div className="hero-banner-wrapper my-4 rounded-4 shadow-sm position-relative overflow-hidden"
            style={{ backgroundColor: '#e9ecef', color: '#2d3436' }}>
            <div className="container py-5 px-4 px-md-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <span className="badge rounded-pill px-3 py-2 mb-3" style={{ backgroundColor: '#00b894', color: '#fff', letterSpacing: '1px' }}>
                            <i className="fas fa-bookmark me-2"></i> KHÁM PHÁ TRI THỨC
                        </span>
                        <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: '1.1' }}>{current.title}</h1>
                        <p className="lead mb-4 text-secondary" style={{ fontSize: '1.1rem' }}>Mỗi cuốn sách là một hành trình. Hãy cùng Viên Bookstore chọn cho mình người bạn đồng hành phù hợp nhất.</p>

                        <Link to={current.linkUrl || '/shop'}
                            className="btn btn-lg px-4 py-3 rounded-pill fw-bold"
                            style={{ backgroundColor: '#2d3436', color: '#fff' }}>
                            ĐỌC THỬ NGAY <i className="fas fa-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    <div className="col-lg-6 text-center">
                        <img
                            src={getImageUrl(current.imageUrl)}
                            alt={current.title}
                            className="img-fluid rounded-4 shadow-lg"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>

            {banners.length > 1 && (
                <div className="d-flex justify-content-center pb-4">
                    {banners.map((_, idx) => (
                        <div key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`mx-1 rounded-pill ${idx === activeIndex ? 'bg-success' : 'bg-secondary'}`}
                            style={{ width: idx === activeIndex ? '30px' : '10px', height: '10px', cursor: 'pointer', transition: '0.3s' }} />
                    ))}
                </div>
            )}
        </div>
    );
}

function DefaultBanner() {
    return (
        <div className="hero-banner-wrapper my-4 rounded-4 shadow-sm overflow-hidden" style={{ backgroundColor: '#fcfbf7', border: '1px solid #eee' }}>
            <div className="container py-5 px-4 px-md-5">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <h1 className="display-4 fw-bold mb-3">Sách hay <br /><span style={{ color: '#00b894' }}>cho tâm hồn đẹp</span></h1>
                        <p className="text-muted mb-4">"Một cuốn sách thực sự hay nên đọc trong tuổi trẻ, đọc lại khi trưởng thành và đọc lại lần nữa khi về già."</p>
                        <Link to="/shop" className="btn btn-outline-success btn-lg rounded-pill px-4">Ghé Tiệm Sách</Link>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600" alt="Books" className="img-fluid rounded-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;
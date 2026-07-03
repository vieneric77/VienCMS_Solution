import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import HeroBanner from '../../components/HeroBanner';
import CategoryMenu from '../../components/CategoryMenu';
import NewProducts from '../../components/NewProducts'; // Import component mới
import ProductGrid from '../../components/ProductGrid';
import LatestBlog from '../../components/LatestBlog';
import Footer from '../../components/Footer';
import productService from '../../services/productService';

function Home() {
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

    useEffect(() => {
        productService.getBestSellingProducts(3)
            .then(data => {
                const cleanData = data?.$values ? data.$values : data;
                setBestSellingProducts(cleanData);
            })
            .catch(err => console.error("Lỗi tải sản phẩm bán chạy:", err));
    }, []);

    const cardStyle = {
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer'
    };

    return (
        <div className="homepage" style={{ backgroundColor: '#fdfdfd' }}>
            <Header />
            <div className="container-xxl">
                <HeroBanner />

                <CategoryMenu
                    activeCategoryId={selectedCategoryId}
                    onCategoryChange={setSelectedCategoryId}
                />

                {/* --- MỤC SẢN PHẨM MỚI --- */}
                <NewProducts />

                <section className="my-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold text-dark m-0">Sản phẩm bán chạy</h3>
                    </div>

                    <div className="row g-4">
                        {bestSellingProducts.map(product => (
                            <div className="col-md-4" key={product.id}>
                                <div className="card shadow-sm h-100 p-3" style={cardStyle}>
                                    <div style={{ height: '300px', overflow: 'hidden', borderRadius: '15px' }}>
                                        <img src={product.imageUrl ? `${IMAGE_BASE_URL}/${product.imageUrl}` : "https://via.placeholder.com/300"} className="card-img-top" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-body d-flex flex-column text-center pt-4">
                                        <h5 className="card-title fw-bold text-dark mb-2">{product.name}</h5>
                                        <p className="text-danger fw-bold fs-4 mb-4">{product.price?.toLocaleString('vi-VN')} ₫</p>
                                        <button onClick={() => navigate(`/product/${product.id}`)} className="btn btn-outline-dark rounded-pill py-2 px-4 fw-bold shadow-sm">Xem chi tiết</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="py-4">
                    <ProductGrid categoryId={selectedCategoryId} />
                </div>

                <LatestBlog />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    getAllProducts,
    getAllProductCategories,
    API_BASE_URL
} from '../../services/productService';
import cartService from '../../services/cartService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryMenu from '../../components/CategoryMenu'; // 1. Đã thêm import

const PRIMARY_GREEN = '#00b894';

function formatPrice(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function resolveImage(url) {
    if (!url) return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
}

function ShopPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedPriceRange, setAppliedPriceRange] = useState({ min: null, max: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);

                const [productsData, categoriesData] = await Promise.all([
                    getAllProducts(),
                    getAllProductCategories()
                ]);

                setProducts(Array.isArray(productsData) ? productsData : (productsData?.$values || []));
                setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.$values || []));
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (activeCategory !== 'all') {
            result = result.filter(p => p.categoryProductId === Number(activeCategory));
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(term));
        }

        if (appliedPriceRange.min !== null) {
            result = result.filter(p => p.price >= appliedPriceRange.min);
        }
        if (appliedPriceRange.max !== null) {
            result = result.filter(p => p.price <= appliedPriceRange.max);
        }

        if (sortOrder === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, activeCategory, sortOrder, searchTerm, appliedPriceRange]);

    const handleFilterPriceSubmit = (e) => {
        e.preventDefault();
        setAppliedPriceRange({
            min: minPrice.trim() !== '' ? Number(minPrice) : null,
            max: maxPrice.trim() !== '' ? Number(maxPrice) : null
        });
    };

    const handleResetPrice = () => {
        setMinPrice('');
        setMaxPrice('');
        setAppliedPriceRange({ min: null, max: null });
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <Header />

            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '30px' }}>
                <div className="container">
                    <h2 style={{ color: PRIMARY_GREEN, fontWeight: '700', fontSize: '24px', margin: 0 }}>Thư Viện Sách</h2>
                    <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>Khám phá tri thức chất lượng cao</p>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row">
                    <div className="col-lg-3">
                        <div style={{ position: 'sticky', top: '20px' }}>
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: PRIMARY_GREEN, marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Tìm kiếm</h5>
                                <input type="text" className="form-control" placeholder="Nhập tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: '8px' }} />
                            </div>

                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: PRIMARY_GREEN, marginBottom: '15px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Khoảng giá</h5>
                                <form onSubmit={handleFilterPriceSubmit}>
                                    <input type="number" className="form-control mb-2" placeholder="Tối thiểu" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ borderRadius: '8px' }} />
                                    <input type="number" className="form-control mb-3" placeholder="Tối đa" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ borderRadius: '8px' }} />
                                    <button type="submit" className="btn w-100 mb-2" style={{ backgroundColor: PRIMARY_GREEN, color: '#fff', fontWeight: 'bold', borderRadius: '8px' }}>Áp dụng</button>
                                    <button type="button" className="btn btn-outline-secondary w-100" onClick={handleResetPrice} style={{ borderRadius: '8px' }}>Xóa lọc</button>
                                </form>
                            </div>

                            {/* 2. Đã thay thế danh mục cũ bằng CategoryMenu */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: PRIMARY_GREEN, marginBottom: '15px' }}>Danh mục</h5>
                                <CategoryMenu
                                    activeCategoryId={activeCategory === 'all' ? null : Number(activeCategory)}
                                    onCategoryChange={(id) => setActiveCategory(id === null ? 'all' : id.toString())}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <span style={{ color: '#666' }}>Hiển thị {filteredProducts.length} sản phẩm</span>
                            <select className="form-control w-auto" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ borderRadius: '8px' }}>
                                <option value="default">Sắp xếp theo...</option>
                                <option value="asc">Giá: Thấp tới Cao</option>
                                <option value="desc">Giá: Cao tới Thấp</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" style={{ color: PRIMARY_GREEN }}></div>
                                <p style={{ marginTop: '10px' }}>Đang tải danh sách thiết bị...</p>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredProducts.map(product => (
                                    <div className="col-md-4 mb-4" key={product.id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function ProductCard({ product }) {
    const handleAddToCartClick = () => {
        cartService.addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
        });
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden product-card" style={{ transition: 'all 0.4s ease' }}>
            <div className="position-relative overflow-hidden bg-light" style={{ height: '220px' }}>
                <Link to={`/product/${product.id}`}>
                    <img
                        src={resolveImage(product.imageUrl)}
                        className="w-100 h-100 object-fit-contain p-3 product-image"
                        alt={product.name}
                        style={{ transition: 'transform 0.5s' }}
                    />
                </Link>
                {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                    <span className="position-absolute top-0 start-0 m-2 badge bg-danger rounded-pill px-2">Còn {product.stockQuantity}</span>
                )}
            </div>
            <div className="card-body p-3 d-flex flex-column">
                <h6 className="card-title fw-bold text-truncate mt-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">{product.name}</Link>
                </h6>
                <div className="fw-bold text-success mb-2" style={{ fontSize: '1.1rem' }}>{formatPrice(product.price)}</div>
                <div className="mt-auto d-flex gap-2">
                    <Link to={`/product/${product.id}`} className="btn btn-outline-dark btn-sm flex-fill rounded-pill py-2">Chi tiết</Link>
                    <button onClick={handleAddToCartClick} disabled={product.stockQuantity === 0} className="btn btn-dark btn-sm flex-fill rounded-pill py-2" style={{ backgroundColor: '#00b894', border: 'none' }}>
                        Mua
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShopPage;
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// Import hình ảnh từ thư mục assets
import notFoundImage from '../../assets/not-found.jpg';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    // Đảm bảo đường dẫn API không bị lặp /api/api
                    const response = await axiosClient.get(`/products/search?q=${encodeURIComponent(query)}`);
                    setResults(response.data);
                } catch (error) {
                    console.error("Lỗi khi tìm kiếm:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [query]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="flex-grow-1 container py-5">
                <h2 className="mb-5 text-center fw-bold display-6">
                    Kết quả tìm kiếm cho: <span className="text-primary">"{query}"</span>
                </h2>

                {loading ? (
                    <div className="text-center py-5 fs-4">Đang tải dữ liệu...</div>
                ) : (
                    <div className="row g-4">
                        {results.length > 0 ? (
                            results.map(product => (
                                <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                                    <ProductCard item={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                {/* Hiển thị hình ảnh minh họa theo yêu cầu */}
                                <img
                                    src={notFoundImage}
                                    alt="Không tìm thấy kết quả"
                                    className="img-fluid mb-4"
                                    style={{ maxWidth: '300px' }}
                                />
                                {/* Đổi câu thông báo khớp với yêu cầu đề bài */}
                                <p className="fs-5 text-muted">
                                    Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default SearchPage;
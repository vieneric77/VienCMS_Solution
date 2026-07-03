import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService'; // Import service danh mục
import ProductCard from './ProductCard';

function ProductGrid({ categoryId }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let data;
                // Nếu categoryId là null hoặc undefined, lấy tất cả. Nếu có, lọc theo danh mục.
                if (!categoryId) {
                    data = await productService.getAllProducts();
                } else {
                    data = await categoryProductService.getProductsByCategoryId(categoryId);
                }

                // Chuẩn hóa dữ liệu trả về từ ASP.NET Core
                const cleanData = Array.isArray(data) ? data : (data?.$values || data?.data || []);
                setProducts(cleanData);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]); // useEffect sẽ chạy lại mỗi khi người dùng chọn danh mục mới

    if (loading) return <div className="text-center py-5">Đang tải sản phẩm...</div>;

    return (
        <section className="py-5">
            <div className="d-flex align-items-center mb-4">
                <h4 className="fw-bold mb-0">Khám phá sách</h4>
                <div className="flex-grow-1 border-bottom ms-3" style={{ borderColor: '#eee' }}></div>
            </div>

            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((p) => (
                        <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                            <ProductCard item={p} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5 text-muted">
                        Chưa có sản phẩm trong danh mục này.
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;
import React, { useState } from 'react';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import ProductDetail from './components/ProductDetail';

function App() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    return (
        <div className="app-wrapper">
            <Header />
            <Banner /> {/* Banner tự động cập nhật từ backend */}

            <div className="container mt-4">
                <header className="pb-3 mb-4 border-bottom">
                    <span className="fs-4 font-weight-bold text-dark">
                        👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                    </span>
                </header>

                {selectedProductId !== null ? (
                    <ProductDetail productId={selectedProductId} onBack={() => setSelectedProductId(null)} />
                ) : selectedPostId !== null ? (
                    <PostDetail postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
                ) : (
                    <div className="row">
                        <div className="col-md-4">
                            <CategoryList onSelectCategory={(id) => setSelectedCategoryId(id)} />
                        </div>
                        <div className="col-md-8">
                            <ProductList selectedCategoryId={selectedCategoryId} onSelectProduct={setSelectedProductId} />
                        </div>
                        <div className="col-12 mt-5">
                            <PostList onSelectPost={setSelectedPostId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default App;
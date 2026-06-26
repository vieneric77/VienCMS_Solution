import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import CategoryProductList from './pages/CategoryProductList';
import CategoryProductListHorizontal from './pages/CategoryProductListHorizontal';
import CategoryPostList from './pages/CategoryPostList';
import ProductList from './pages/ProductList';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import ProductDetail from './pages/ProductDetail';

function App() {
    const [selectedProductCategoryId, setSelectedProductCategoryId] = useState(null);
    const [selectedPostCategoryId, setSelectedPostCategoryId] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);

    return (
        <Router>
            <div className="app-wrapper">
                <Header />
                <Banner />
                <div className="container mt-4">
                    <header className="pb-3 mb-4 border-bottom text-center">
                        <span className="fs-4 font-weight-bold text-dark">
                            👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                        </span>
                    </header>
                    <Routes>
                        <Route path="/" element={
                            <div>
                                <CategoryProductListHorizontal onSelectCategory={setSelectedProductCategoryId} />
                                <ProductList selectedCategoryId={selectedProductCategoryId} onSelectProduct={setSelectedProductId} />
                                <div className="mt-5">
                                    <PostList selectedCategoryId={null} onSelectPost={setSelectedPostId} />
                                </div>
                            </div>
                        } />
                        <Route path="/shop" element={
                            <div className="row">
                                <div className="col-md-4">
                                    <CategoryProductList onSelectCategory={setSelectedProductCategoryId} />
                                </div>
                                <div className="col-md-8">
                                    <ProductList selectedCategoryId={selectedProductCategoryId} onSelectProduct={setSelectedProductId} />
                                </div>
                            </div>
                        } />
                        <Route path="/blog" element={
                            <div className="row">
                                <div className="col-md-4">
                                    <CategoryPostList onSelectCategory={setSelectedPostCategoryId} />
                                </div>
                                <div className="col-md-8">
                                    <PostList selectedCategoryId={selectedPostCategoryId} onSelectPost={setSelectedPostId} />
                                </div>
                            </div>
                        } />
                        <Route path="/product-detail" element={<ProductDetail productId={selectedProductId} />} />
                        <Route path="/post-detail" element={<PostDetail postId={selectedPostId} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
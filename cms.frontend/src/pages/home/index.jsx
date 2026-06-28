import React, { useState } from 'react';
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

function Home() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div className="homepage" style={{ backgroundColor: '#ffffff' }}>
            <Header />
            <div className="container-xxl">
                <HeroBanner />
                <CategoryMenu
                    activeCategoryId={selectedCategoryId}
                    onCategoryChange={setSelectedCategoryId}
                />
                <ProductGrid categoryId={selectedCategoryId} />
                <LatestBlog />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
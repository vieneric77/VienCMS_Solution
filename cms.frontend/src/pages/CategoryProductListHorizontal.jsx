import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductListHorizontal = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts().then(setCategories);
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        onSelectCategory(id);
    };
    const buttonStyle = {
        borderRadius: '50px', 
        padding: '8px 20px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        border: '1px solid #e0e0e0'
    };

    const activeStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
        color: 'white',
        border: '1px solid #007bff',
        boxShadow: '0 4px 6px rgba(0,123,255,0.2)'
    };

    return (
        <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center align-items-center">
            <button
                style={selectedId === null ? activeStyle : buttonStyle}
                className={`btn ${selectedId === null ? '' : 'btn-light'}`}
                onClick={() => handleSelect(null)}
            >
                Tất cả sản phẩm
            </button>

            {categories.map(c => (
                <button
                    key={c.id}
                    style={selectedId === c.id ? activeStyle : buttonStyle}
                    className={`btn ${selectedId === c.id ? '' : 'btn-light'}`}
                    onClick={() => handleSelect(c.id)}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryProductListHorizontal;
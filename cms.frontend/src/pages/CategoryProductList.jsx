import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts().then(setCategories);
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        onSelectCategory(id);
    };

    return (
        <div className="list-group">
            <button
                className={`list-group-item list-group-item-action ${selectedId === null ? 'active' : ''}`}
                onClick={() => handleSelect(null)}
            >
                Tất cả sản phẩm
            </button>
            {categories.map(c => (
                <button
                    key={c.id}
                    className={`list-group-item list-group-item-action ${selectedId === c.id ? 'active' : ''}`}
                    onClick={() => handleSelect(c.id)}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;
import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const CategoryPostList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        // Đã sửa thành .getBlogCategories() cho khớp với service
        blogService.getBlogCategories().then(response => {
            // Lưu ý: Nếu axiosClient trả về { data: ... }, bạn cần lấy response.data
            setCategories(response.data || response);
        });
    }, []);

    const handleSelect = (id) => {
        setSelectedId(id);
        onSelectCategory(id);
    };

    return (
        <div className="list-group">
            <button
                className={`list-group-item ${selectedId === null ? 'active' : ''}`}
                onClick={() => handleSelect(null)}
            >
                Tất cả bài viết
            </button>
            {categories.map(c => (
                <button
                    key={c.id}
                    className={`list-group-item ${selectedId === c.id ? 'active' : ''}`}
                    onClick={() => handleSelect(c.id)}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
};
export default CategoryPostList;
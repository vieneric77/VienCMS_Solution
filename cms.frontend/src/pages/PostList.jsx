import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const PostList = ({ selectedCategoryId, onSelectPost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                let response;
                if (selectedCategoryId) {
                    response = await blogService.getPostsByCategory(selectedCategoryId);
                } else {
                    response = await blogService.getAllPosts();
                }
                // Giả định axios trả về object có thuộc tính data
                setPosts(response.data || response);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategoryId]);

    const handleViewPost = (id) => {
        onSelectPost(id);
        navigate('/post-detail');
    };

    if (loading) return <div className="text-center my-4">Đang tải tin tức...</div>;

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>
            {posts.length === 0 ? (
                <p className="text-muted">Chưa có bài viết nào.</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div className="col-md-4 mb-4" key={post.id}>
                            <div className="card h-100 shadow-sm">
                                <img src={post.imageUrl} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <button className="btn btn-info btn-sm" onClick={() => handleViewPost(post.id)}>Xem thêm</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default PostList;
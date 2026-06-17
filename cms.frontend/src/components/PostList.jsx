import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải tin tức thời trang...</div>;
    }

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <p className="text-muted">Chưa có bài viết tin tức nào.</p>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div className="col-md-4 mb-4" key={post.id}>
                            <div className="card h-100 shadow-sm border-light">
                                <img
                                    src={post.imageUrl}
                                    className="card-img-top"
                                    alt={post.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <span className="badge badge-info align-self-start mb-2">{post.categoryName}</span>
                                    <h5 className="card-title font-weight-bold">
                                        <a href={`/posts/${post.id}`} className="text-dark text-decoration-none hover-link">
                                            {post.title}
                                        </a>
                                    </h5>
                                    <p className="card-text text-muted small text-truncate">
                                        {post.content}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center text-secondary small mt-auto pt-2">
                                        <span>
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="text-info font-weight-bold">Xem thêm</span>
                                    </div>
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
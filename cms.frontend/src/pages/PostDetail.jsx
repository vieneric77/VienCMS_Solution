import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetail = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const BACKEND_URL = "https://localhost:7024";

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await blogService.getPostById(postId);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPostDetail();
        }
    }, [postId]);

    const getFullImageUrl = (url) => {
        if (!url) return "https://picsum.photos/800/400";
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `${BACKEND_URL}${url.startsWith('/') ? url : `/${url}`}`;
    };

    if (loading) {
        return <div className="text-center my-4">Đang tải chi tiết bài viết...</div>;
    }

    if (!post) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Không tìm thấy bài viết.</div>
                <button onClick={() => navigate('/blog')} className="btn btn-secondary">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-info text-white">
                    <h4 className="mb-0">{post.title || post.Title}</h4>
                </div>
                <div className="card-body">
                    <img
                        src={getFullImageUrl(post.imageUrl || post.ImageUrl)}
                        className="img-fluid mb-3 rounded"
                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                        alt={post.title || post.Title}
                    />
                    <div
                        className="post-content mt-4"
                        dangerouslySetInnerHTML={{ __html: post.content || post.Content }}
                    />
                </div>
                <div className="card-footer">
                    <button onClick={() => navigate('/blog')} className="btn btn-secondary">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
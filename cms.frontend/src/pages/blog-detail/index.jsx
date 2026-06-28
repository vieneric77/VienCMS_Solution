import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';
import Header from '../../components/Header';
import Footer from '../../components/Footer'; 

const ACCENT = '#00b894';
const NAVY = '#0D2C54';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7024";

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostById(id);
                const cleanData = data?.$values ? data.$values[0] : data;
                setPost(cleanData);
            } catch (error) {
                console.error("Không thể truy xuất nội dung bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPostDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="spinner-border" style={{ color: ACCENT }} role="status"></div>
                <p className="mt-2 text-muted">Đang lật mở trang sách...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container my-5 text-center py-5">
                <div className="alert alert-danger">Cuốn sách hoặc bài viết này không tìm thấy trong kệ.</div>
                <Link to="/" className="btn btn-dark mt-2">Quay lại thư viện</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fdfdfd' }}>
            <Header />
            <div className="container my-5" style={{ maxWidth: '800px' }}>
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb bg-transparent p-0 small">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-muted">Góc Đọc Sách</Link></li>
                        <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">Nội dung chi tiết</li>
                    </ol>
                </nav>

                <article className="blog-post-detail">
                    <span className="badge text-uppercase font-weight-bold px-2 py-1 mb-2 text-white"
                        style={{ backgroundColor: ACCENT, fontSize: '11px' }}>
                        <i className="fas fa-book-open mr-1"></i> {post.category?.name || post.categoryName || "Review Sách"}
                    </span>

                    <h1 className="font-weight-bold mb-3" style={{ color: NAVY, fontSize: '2.2rem', lineHeight: '1.3' }}>
                        {post.title}
                    </h1>

                    <div className="post-meta d-flex text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '13px' }}>
                        <span className="mr-3">
                            <i className="far fa-calendar-alt mr-1" style={{ color: ACCENT }}></i> Xuất bản: {formatDate(post.createdDate)}
                        </span>
                    </div>

                    <div className="post-thumbnail-wrapper mb-4 rounded overflow-hidden shadow-sm" style={{ maxHeight: '400px' }}>
                        <img
                            src={post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${IMAGE_BASE_URL}${post.imageUrl}`) : "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800"}
                            alt={post.title}
                            className="img-fluid w-100"
                            style={{ objectFit: 'cover', height: '100%', maxHeight: '400px' }}
                        />
                    </div>

                    <div className="post-content text-dark text-justify"
                        style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line', color: '#212529' }}>
                        {post.content}
                    </div>
                </article>

                <div className="mt-5 pt-4 border-top text-center">
                    <Link to="/blog" className="btn btn-outline-secondary px-4 font-weight-bold" style={{ borderRadius: '4px' }}>
                        <i className="fas fa-book mr-2"></i> QUAY LẠI 
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PostDetail;
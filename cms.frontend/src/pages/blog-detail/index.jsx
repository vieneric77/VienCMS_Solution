import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/postService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// Import hằng số cấu hình từ file trung tâm
import { IMAGE_BASE_URL } from '../../api/axiosClient';

const ACCENT = '#00b894';
const NAVY = '#0D2C54';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Xử lý thay thế đường dẫn ảnh trong nội dung HTML
    const processHtmlContent = (htmlContent) => {
        if (!htmlContent) return "";
        return htmlContent.replace(/src="\/uploads\//g, `src="${IMAGE_BASE_URL}/uploads/`);
    };

    // Helper xử lý ảnh thumbnail ngoài
    const getImageUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800";
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
    };

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
                <div className="alert alert-danger">Cuốn sách hoặc bài viết này không tìm thấy.</div>
                <Link to="/" className="btn btn-dark mt-2">Quay lại thư viện</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fdfdfd' }}>
            <style>{`
                .post-content img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 20px auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
            `}</style>

            <Header />
            <div className="container my-5" style={{ maxWidth: '800px' }}>
                <article className="blog-post-detail">
                    <h1 className="font-weight-bold mb-4" style={{ color: NAVY, fontSize: '2.5rem' }}>{post.title}</h1>

                    <div className="post-thumbnail-wrapper mb-4 overflow-hidden rounded">
                        <img
                            src={getImageUrl(post.imageUrl)}
                            alt={post.title}
                            className="img-fluid w-100"
                            style={{ maxHeight: '450px', objectFit: 'cover' }}
                        />
                    </div>

                    <div
                        className="post-content text-dark text-justify"
                        style={{ fontSize: '17px', lineHeight: '1.8' }}
                        dangerouslySetInnerHTML={{ __html: processHtmlContent(post.content) }}
                    />
                </article>
            </div>
            <Footer />
        </div>
    );
}

export default PostDetail;
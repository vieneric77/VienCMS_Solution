import React, { useState, useEffect } from 'react';
import blogService from '../services/postService';
import PostCard from './PostCard';

function LatestBlog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getAllPosts();
                const array = Array.isArray(data) ? data : (data?.$values || []);
                setPosts(array.sort((a, b) => b.id - a.id).slice(0, 3));
            } catch (error) { setPosts([]); }
        };
        fetchPosts();
    }, []);

    if (posts.length === 0) return null;

    return (
        <section className="py-5 border-top">
            <div className="mb-5">
                <h4 className="fw-bold text-center">Góc nhìn tri thức</h4>
                <p className="text-center text-muted">Những bài viết chia sẻ về văn hóa đọc và phát triển bản thân.</p>
            </div>
            <div className="row g-4">
                {posts.map((post) => (
                    <div className="col-md-4" key={post.id}>
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LatestBlog;
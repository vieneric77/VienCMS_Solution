import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Banner = () => {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        axios.get('https://localhost:7024/api/BannerApi/active')
            .then(res => {
                if (res.data) setBanner(res.data);
            })
            .catch(err => console.log("Lỗi:", err));
    }, []);

    if (!banner) return null;

    return (
        <div className="container mt-3">
            <div className="banner-wrapper shadow-sm rounded overflow-hidden">
                <img
                    src={`https://localhost:7024${banner.imageUrl}`}
                    className="img-fluid w-100"
                    alt="Banner"
                    // Chỉnh chiều cao ở đây (ví dụ 300px hoặc 350px)
                    style={{
                        height: '300px',
                        objectFit: 'cover',
                        width: '100%'
                    }}
                />
            </div>
        </div>
    );
};

export default Banner;
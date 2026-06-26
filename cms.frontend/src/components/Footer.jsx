import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-light mt-5 py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5>VienCMS.Fashion</h5>
                        <p>Mang đến phong cách thời trang công sở và dạ hội đẳng cấp, sang trọng cho phái đẹp.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Liên kết nhanh</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/" className="text-light text-decoration-none">Trang chủ</Link></li>
                            <li><Link to="/shop" className="text-light text-decoration-none">Cửa hàng</Link></li>
                            <li><Link to="/blog" className="text-light text-decoration-none">Tin tức</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Thông tin liên hệ</h5>
                        <p>📞 Hotline: 0347511148</p>
                        <p>✉ Email: support@viencms.retail</p>
                    </div>
                </div>
                <div className="text-center mt-4 border-top pt-3">
                    <p>&copy; 2026 VienCMS Fashion. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
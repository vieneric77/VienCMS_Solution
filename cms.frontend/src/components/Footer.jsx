import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="text-light pt-5 mt-5" style={{ backgroundColor: '#2d3436' }}>
            <div className="container pb-5">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <h4 className="text-primary mb-4 font-weight-bold">VIÊN.BOOKSTORE</h4>
                        <p className="text-secondary" style={{ lineHeight: '1.8' }}>Nơi lưu giữ những giá trị tri thức. Chúng tôi mang đến trải nghiệm mua sách tinh tế, hiện đại và tận tâm nhất.</p>
                    </div>
                    <div className="col-lg-2">
                        <h6 className="text-uppercase mb-4">Danh mục</h6>
                        <ul className="list-unstyled text-secondary">
                            <li className="mb-2"><Link to="/shop?cat=vinhoc" className="text-reset text-decoration-none">Văn học</Link></li>
                            <li className="mb-2"><Link to="/shop?cat=kinhte" className="text-reset text-decoration-none">Kinh tế</Link></li>
                            <li className="mb-2"><Link to="/shop?cat=thieunhi" className="text-reset text-decoration-none">Thiếu nhi</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <h6 className="text-uppercase mb-4">Hỗ trợ</h6>
                        <ul className="list-unstyled text-secondary">
                            <li className="mb-2">Chính sách bảo mật</li>
                            <li className="mb-2">Điều khoản sử dụng</li>
                            <li className="mb-2">Hướng dẫn đặt hàng</li>
                        </ul>
                    </div>
                    <div className="col-lg-3">
                        <h6 className="text-uppercase mb-4">Liên hệ</h6>
                        <p className="text-secondary"><i className="fas fa-map-marker-alt me-2"></i> Thủ Đức, TP. Hồ Chí Minh</p>
                        <p className="text-secondary"><i className="fas fa-phone-alt me-2"></i> 0398820547</p>
                    </div>
                </div>
            </div>
            <div className="py-4 border-top border-secondary text-center text-secondary" style={{ fontSize: '0.8rem' }}>
                &copy; {new Date().getFullYear()} Viên Bookstore. Quản lý bởi Viên.
            </div>
        </footer>
    );
}
export default Footer;
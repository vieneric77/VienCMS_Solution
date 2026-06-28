import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ACCENT = '#00b894';
const NAVY = '#0D2C54';

const VALUES = [
    {
        icon: 'fa-book-reader',
        title: 'Sách chọn lọc',
        desc: 'Mọi đầu sách đều được tuyển chọn kỹ lưỡng, đảm bảo giá trị kiến thức và tính xác thực cao.'
    },
    {
        icon: 'fa-bookmark',
        title: 'Cập nhật liên tục',
        desc: 'Hệ thống kho sách luôn bổ sung các tựa sách mới nhất, đáp ứng nhu cầu học tập và nghiên cứu.'
    },
    {
        icon: 'fa-truck',
        title: 'Giao hàng tận nơi',
        desc: 'Đóng gói cẩn thận, bảo quản sách tốt nhất trong quá trình vận chuyển đến tay bạn.'
    },
    {
        icon: 'fa-comments',
        title: 'Tư vấn tận tâm',
        desc: 'Đội ngũ chuyên gia thư viện sẵn sàng hỗ trợ bạn tìm kiếm cuốn sách phù hợp nhất.'
    }
];

function AboutPage() {
    return (
        <div className="about-page">
            <Header />
            <div className="py-5" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #009675 100%)`, color: '#fff' }}>
                <div className="container py-4 text-center">
                    <span className="badge text-uppercase font-weight-bold px-3 py-2 mb-3"
                        style={{ backgroundColor: ACCENT, fontSize: '11px', letterSpacing: '1px' }}>
                        <i className="fas fa-book-open mr-1"></i> Từ 2014 đến nay
                    </span>
                    <h1 className="font-weight-bold mb-3" style={{ fontSize: '2.3rem' }}>
                        Người bạn đồng hành tri thức
                    </h1>
                    <p className="mx-auto mb-0" style={{ maxWidth: '640px', color: '#e0e6ed', fontSize: '16px' }}>
                        Chúng tôi cung cấp những đầu sách chất lượng, kiến thức bổ ích cho hàng nghìn độc giả
                        trên toàn quốc — bền bỉ, uy tín, lan tỏa tri thức.
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <img
                            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60"
                            alt="Thư viện"
                            className="img-fluid rounded shadow-sm w-100"
                            style={{ maxHeight: '360px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-lg-6">
                        <span className="text-uppercase font-weight-bold small" style={{ color: ACCENT, letterSpacing: '1px' }}>
                            Câu chuyện của chúng tôi
                        </span>
                        <h2 className="font-weight-bold mb-3 mt-2" style={{ color: NAVY }}>
                            Bắt đầu từ tình yêu tri thức
                        </h2>
                        <p className="text-muted">
                            Năm 2014, chúng tôi khởi đầu từ một tủ sách nhỏ. Thấu hiểu giá trị của sự đọc
                            và nhu cầu tìm kiếm tri thức chuẩn xác, chúng tôi đã không ngừng sưu tầm
                            và kết nối những cuốn sách giá trị đến với cộng đồng người Việt.
                        </p>
                        <p className="text-muted mb-4">
                            Đến nay, chúng tôi đã đồng hành cùng hàng nghìn độc giả, xây dựng những kệ sách
                            đầy ắp kiến thức với cam kết: <strong>chất lượng, tận tâm, lan tỏa giá trị.</strong>
                        </p>
                        <Link to="/blog"
                            className="btn font-weight-bold px-4 py-2"
                            style={{ backgroundColor: ACCENT, color: '#fff', borderRadius: '4px' }}>
                            <i className="fas fa-book mr-2"></i> Khám phá kệ sách
                        </Link>
                    </div>
                </div>
            </div>

            <div className="py-5" style={{ backgroundColor: '#F7F8FA' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-uppercase font-weight-bold small" style={{ color: ACCENT, letterSpacing: '1px' }}>
                            Vì sao chọn chúng tôi
                        </span>
                        <h2 className="font-weight-bold mt-2" style={{ color: NAVY }}>Cam kết với độc giả</h2>
                    </div>
                    <div className="row">
                        {VALUES.map((v, idx) => (
                            <div className="col-md-6 col-lg-3 mb-4" key={idx}>
                                <div className="bg-white rounded shadow-sm p-4 h-100 text-center">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{ width: '60px', height: '60px', backgroundColor: 'rgba(0,184,148,0.1)' }}>
                                        <i className={`fas ${v.icon}`} style={{ color: ACCENT, fontSize: '22px' }}></i>
                                    </div>
                                    <h6 className="font-weight-bold mb-2" style={{ color: NAVY }}>{v.title}</h6>
                                    <p className="text-muted small mb-0">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-5" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #009675 100%)`, color: '#fff' }}>
                <div className="container text-center">
                    <h3 className="font-weight-bold mb-2">Bạn cần tìm cuốn sách tâm đắc?</h3>
                    <p className="mb-4" style={{ color: '#e0e6ed' }}>
                        Đội ngũ thư viện của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm thấy nguồn tri thức quý giá.
                    </p>
                    <a href="tel:0347511148"
                        className="btn font-weight-bold px-4 py-2"
                        style={{ backgroundColor: ACCENT, color: '#fff', borderRadius: '50px', marginRight: '15px' }}>
                        <i className="fas fa-phone-alt mr-2"></i> Liên hệ: 0347511148
                    </a>

                    <Link to="/shop"
                        className="btn btn-outline-light font-weight-bold px-4 py-2"
                        style={{ borderRadius: '50px' }}>
                        Xem kệ sách
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutPage;
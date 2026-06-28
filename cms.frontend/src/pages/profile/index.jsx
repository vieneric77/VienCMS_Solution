import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerProfilePage() {
    const customerId = localStorage.getItem('customerId');
    const customerName = localStorage.getItem('customerName') || 'Khách hàng';

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [pwdSuccess, setPwdSuccess] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);

    const [accountInfo] = useState({
        role: "Thành viên (Độc giả)",
        status: "Đang hoạt động",
        loginTime: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN')
    });

    useEffect(() => {
        if (!customerId) {
            setErrorMsg("Bạn chưa đăng nhập hệ thống! Vui lòng quay lại trang đăng nhập.");
            setLoading(false);
            return;
        }

        const fetchOrderHistory = async () => {
            try {
                const res = await axios.get(`https://localhost:7024/api/CustomerOrdersApi/history/${customerId}`);
                let data = [];
                if (Array.isArray(res.data)) {
                    data = res.data;
                } else if (res.data.data) {
                    data = res.data.data;
                }
                setOrders(data);
                setFilteredOrders(data);
            } catch (err) {
                console.error(err);
                setErrorMsg("Không thể tải lịch sử mua hàng từ hệ thống Backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [customerId]);

    const handleTabChange = (tabType) => {
        setActiveTab(tabType);
        if (tabType === 'all') {
            setFilteredOrders(orders);
        } else {
            const statusNumber = parseInt(tabType, 10);
            setFilteredOrders(orders.filter(o => o.status === statusNumber));
        }
        setExpandedOrderId(null);
    };

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const totalSpent = orders.filter(o => o.status === 2).reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 0).length;

    const renderStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="custom-badge badge-warning"><i className="fas fa-clock mr-1"></i> Chờ duyệt</span>;
            case 1:
                return <span className="custom-badge badge-primary"><i className="fas fa-truck mr-1"></i> Đang giao</span>;
            case 2:
                return <span className="custom-badge badge-success"><i className="fas fa-check-circle mr-1"></i> Hoàn tất</span>;
            default:
                return <span className="custom-badge badge-secondary">Không rõ</span>;
        }
    };

    if (!customerId) {
        return (
            <div className="container my-5 py-5 text-center">
                <div className="alert alert-danger d-inline-block px-4 py-3 shadow-sm rounded-4">{errorMsg}</div>
            </div>
        );
    }

    return (
        <div className="profile-page-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
            <div className="container pt-4">
                <div className="header-banner p-4 mb-4 text-white d-flex align-items-center justify-content-between position-relative overflow-hidden">
                    <div style={{ zIndex: 2 }}>
                        <h3 className="font-weight-bold mb-1 header-title">
                            Chào, {customerName} 👋
                        </h3>
                        <p className="mb-0 text-white-50">Chào mừng bạn trở lại với không gian tri thức.</p>
                    </div>
                    <div className="text-right d-none d-sm-flex align-items-center" style={{ zIndex: 2, gap: '15px' }}>
                        <a href="/" className="btn btn-light btn-sm px-3 py-2 fw-semibold rounded-pill" style={{ color: '#4f46e5' }}>
                            <i className="fas fa-home mr-1"></i> Trang chủ
                        </a>
                        <span className="badge px-3 py-2 rounded-pill font-weight-bold" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                            ID: #{customerId}
                        </span>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm border-0 rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="text-center mb-3">
                                    <div className="avatar-circle">
                                        {customerName.substring(0, 1).toUpperCase()}
                                    </div>
                                    <h5 className="font-weight-bold text-dark mt-3 mb-1">{customerName}</h5>
                                    <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill">
                                        <i className="fas fa-circle mr-1" style={{ fontSize: '8px' }}></i> {accountInfo.status}
                                    </span>
                                </div>
                                <hr className="my-4 border-light" />
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Vai trò:</span>
                                    <span className="font-weight-bold text-dark">{accountInfo.role}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Đăng nhập:</span>
                                    <span className="text-secondary small">{accountInfo.loginTime.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 mb-4">
                            <div className="card-header bg-white border-0 pt-4 pb-2 px-4">
                                <h6 className="m-0 font-weight-bold text-dark text-uppercase">
                                    <i className="fas fa-shield-alt text-primary mr-2"></i> Bảo mật
                                </h6>
                            </div>
                            <div className="card-body p-4">
                                {pwdError && <div className="alert alert-danger small py-2 rounded-3">{pwdError}</div>}
                                {pwdSuccess && <div className="alert alert-success small py-2 rounded-3">{pwdSuccess}</div>}

                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setPwdError('');
                                    setPwdSuccess('');

                                    if (pwdData.newPassword !== pwdData.confirmPassword) {
                                        setPwdError("Mật khẩu mới không trùng khớp!");
                                        return;
                                    }
                                    if (pwdData.newPassword.length < 6) {
                                        setPwdError("Mật khẩu phải từ 6 ký tự!");
                                        return;
                                    }

                                    setPwdLoading(true);
                                    try {
                                        await axios.post('https://localhost:7024/api/AuthApi/change-password', {
                                            customerId: parseInt(customerId, 10),
                                            oldPassword: pwdData.oldPassword,
                                            newPassword: pwdData.newPassword
                                        });
                                        setPwdSuccess("Đổi mật khẩu thành công!");
                                        setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                    } catch (err) {
                                        setPwdError(err.response?.data?.message || "Lỗi cập nhật mật khẩu!");
                                    } finally {
                                        setPwdLoading(false);
                                    }
                                }}>
                                    <div className="form-group mb-3">
                                        <input type="password" className="form-control form-control-lg custom-input" required value={pwdData.oldPassword} onChange={(e) => setPwdData({ ...pwdData, oldPassword: e.target.value })} placeholder="Mật khẩu hiện tại" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="password" className="form-control form-control-lg custom-input" required value={pwdData.newPassword} onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })} placeholder="Mật khẩu mới" />
                                    </div>
                                    <div className="form-group mb-4">
                                        <input type="password" className="form-control form-control-lg custom-input" required value={pwdData.confirmPassword} onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })} placeholder="Xác nhận mật khẩu mới" />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block rounded-pill py-2 font-weight-bold w-100" disabled={pwdLoading}>
                                        {pwdLoading ? 'Đang xử lý...' : 'Cập nhật'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 p-4">
                            <h6 className="font-weight-bold text-dark text-uppercase mb-4">Thống kê</h6>
                            <div className="row g-3">
                                <div className="col-6 text-center border-end">
                                    <div className="stat-icon bg-success-subtle text-success mx-auto mb-2"><i className="fas fa-wallet"></i></div>
                                    <span className="text-muted small d-block">Đã chi</span>
                                    <h6 className="font-weight-bold text-success m-0 mt-1">{formatPrice(totalSpent)}</h6>
                                </div>
                                <div className="col-6 text-center">
                                    <div className="stat-icon bg-warning-subtle text-warning mx-auto mb-2"><i className="fas fa-box"></i></div>
                                    <span className="text-muted small d-block">Đang chờ</span>
                                    <h6 className="font-weight-bold text-warning m-0 mt-1">{pendingCount} đơn</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                            <div className="card-header bg-white border-bottom pt-3 pb-0 px-4">
                                <ul className="nav nav-tabs border-bottom-0 custom-tabs">
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabChange('all')}>Tất cả ({orders.length})</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === '0' ? 'active text-warning border-warning' : ''}`} onClick={() => handleTabChange('0')}>Chờ duyệt</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === '1' ? 'active text-primary border-primary' : ''}`} onClick={() => handleTabChange('1')}>Đang giao</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === '2' ? 'active text-success border-success' : ''}`} onClick={() => handleTabChange('2')}>Hoàn tất</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center py-5 text-muted">
                                        <div className="spinner-border text-primary mb-3" role="status"></div>
                                        <p>Đang tải dữ liệu...</p>
                                    </div>
                                ) : errorMsg ? (
                                    <div className="p-5 text-center text-danger">{errorMsg}</div>
                                ) : filteredOrders.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="empty-state-icon mx-auto mb-3"><i className="fas fa-box-open"></i></div>
                                        <h5 className="text-muted">Chưa có đơn hàng nào</h5>
                                    </div>
                                ) : (
                                    <div className="order-list">
                                        {filteredOrders.map((order) => {
                                            const isExpanded = expandedOrderId === order.id;
                                            return (
                                                <div className="order-item border-bottom" key={order.id}>
                                                    <div className={`p-4 d-flex flex-wrap align-items-center justify-content-between order-header ${isExpanded ? 'bg-light' : 'bg-white'}`} onClick={() => toggleOrderDetails(order.id)}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="order-icon bg-primary-subtle text-primary">
                                                                <i className="fas fa-shopping-bag"></i>
                                                            </div>
                                                            <div>
                                                                <div className="d-flex align-items-center mb-1 gap-2">
                                                                    <strong className="text-dark fs-5">#{order.id}</strong>
                                                                    {renderStatusBadge(order.status)}
                                                                </div>
                                                                <span className="text-muted small">
                                                                    Tổng tiền: <strong className="text-danger">{formatPrice(order.totalAmount)}</strong>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="toggle-icon">
                                                            <i className={`fas ${isExpanded ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-muted'}`}></i>
                                                        </div>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="p-4 bg-light animate-fade-in">
                                                            <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                                                                <table className="table table-borderless m-0">
                                                                    <thead className="bg-light text-secondary border-bottom small">
                                                                        <tr>
                                                                            <th className="py-3 px-4">Sản phẩm</th>
                                                                            <th className="py-3 text-center" style={{ width: '100px' }}>Số lượng</th>
                                                                            <th className="py-3 text-end px-4" style={{ width: '150px' }}>Đơn giá</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.items && order.items.map((item) => (
                                                                            <tr className="border-bottom" key={item.productId}>
                                                                                <td className="py-3 px-4 text-dark font-weight-bold">{item.productName}</td>
                                                                                <td className="py-3 text-center align-middle">
                                                                                    <span className="badge bg-secondary-subtle text-dark px-2 py-1 rounded">{item.quantity}</span>
                                                                                </td>
                                                                                <td className="py-3 text-end px-4 text-primary font-weight-bold align-middle">{formatPrice(item.unitPrice)}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            {order.notes && (
                                                                <div className="mt-3 p-3 rounded-3 bg-warning-subtle text-dark border-warning border-start border-4">
                                                                    <i className="fas fa-info-circle mr-2"></i>
                                                                    <span className="font-italic">{order.notes}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .header-banner {
                    border-radius: 16px;
                    background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
                }
                .avatar-circle {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
                    color: #4f46e5;
                    font-size: 32px;
                    font-weight: bold;
                    border-radius: 50%;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                .bg-success-subtle { background-color: #dcfce7; }
                .bg-warning-subtle { background-color: #fef3c7; }
                .bg-primary-subtle { background-color: #e0e7ff; }
                .bg-secondary-subtle { background-color: #f1f5f9; }
                .custom-badge {
                    font-size: 11px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-warning { background-color: #f59e0b; color: white; }
                .badge-primary { background-color: #3b82f6; color: white; }
                .badge-success { background-color: #10b981; color: white; }
                .badge-secondary { background-color: #64748b; color: white; }
                
                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                .empty-state-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }
                .custom-input {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px;
                }
                .custom-input:focus {
                    background-color: #fff;
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                    outline: none;
                }
                .custom-tabs .nav-link {
                    color: #64748b;
                    font-weight: 600;
                    border: none;
                    border-bottom: 2px solid transparent;
                    padding: 12px 20px;
                    margin-bottom: -1px;
                    transition: all 0.2s;
                    background: transparent;
                }
                .custom-tabs .nav-link:hover { color: #3b82f6; }
                .custom-tabs .nav-link.active {
                    color: #4f46e5;
                    border-bottom: 2px solid #4f46e5;
                    background: transparent;
                }
                .order-header { cursor: pointer; transition: background 0.2s; }
                .order-header:hover { background-color: #f1f5f9 !important; }
                .order-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .toggle-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default CustomerProfilePage;
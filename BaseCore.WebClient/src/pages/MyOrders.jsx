import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [cancelingId, setCancelingId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getMyOrders();
            setOrders(response.data || []);
            setError('');
        } catch (err) {
            setError('Lỗi khi tải danh sách đơn hàng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        try {
            const response = await orderApi.getById(order.id);
            setOrderDetails(response.data.details || []);
        } catch (err) {
            alert('Lỗi khi tải chi tiết đơn hàng');
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            return;
        }

        setCancelingId(orderId);
        try {
            await orderApi.cancel(orderId);
            alert('Đơn hàng đã được hủy thành công');
            loadOrders();
            setSelectedOrder(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi hủy đơn hàng');
        } finally {
            setCancelingId(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#f39c12',
            'Processing': '#3498db',
            'Shipped': '#9b59b6',
            'Completed': '#27ae60',
            'Cancelled': '#e74c3c',
        };
        return colors[status] || '#95a5a6';
    };

    const getStatusText = (status) => {
        const texts = {
            'Pending': '⏳ Chờ xử lý',
            'Processing': '🔄 Đang chuẩn bị',
            'Shipped': '📦 Đang giao',
            'Completed': '✓ Hoàn tất',
            'Cancelled': '✕ Đã hủy',
        };
        return texts[status] || status;
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="my-orders-container">
            <div className="orders-header">
                <h1>📋 Đơn Hàng Của Tôi</h1>
                <button onClick={loadOrders} className="refresh-btn">🔄 Làm mới</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa có đơn hàng nào</p>
                    <a href="/shop" className="btn btn-primary">→ Tiếp tục mua sắm</a>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>Đơn hàng #{order.id}</h3>
                                    <p className="order-date">
                                        📅 {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="order-status">
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="order-content">
                                <div className="order-details-grid">
                                    <div className="detail-item">
                                        <span className="label">Địa chỉ giao hàng:</span>
                                        <span className="value">{order.shippingAddress}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Tổng tiền:</span>
                                        <span className="value amount">
                                            {order.totalAmount.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                </div>

                                {order.details && order.details.length > 0 && (
                                    <div className="order-items-preview">
                                        <strong>Sản phẩm:</strong>
                                        {order.details.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="item-preview">
                                                • {item.quantity}x {item.productId}
                                            </div>
                                        ))}
                                        {order.details.length > 2 && (
                                            <div className="item-preview">
                                                • +{order.details.length - 2} sản phẩm khác
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="order-actions">
                                <button 
                                    onClick={() => handleViewDetails(order)}
                                    className="btn btn-info"
                                >
                                    👁 Chi tiết
                                </button>
                                {(order.status === 'Pending' || order.status === 'Processing') && (
                                    <button 
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={cancelingId === order.id}
                                        className="btn btn-danger"
                                    >
                                        {cancelingId === order.id ? '⏳ Đang hủy...' : '✕ Hủy đơn'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Chi Tiết Đơn Hàng #{selectedOrder.id}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setSelectedOrder(null)}
                            >✕</button>
                        </div>

                        <div className="modal-content">
                            <div className="order-detail-section">
                                <h3>Thông tin chung</h3>
                                <div className="detail-row">
                                    <span>Ngày đặt:</span>
                                    <span>{new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Trạng thái:</span>
                                    <span style={{ color: getStatusColor(selectedOrder.status) }}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span>Địa chỉ giao hàng:</span>
                                    <span>{selectedOrder.shippingAddress}</span>
                                </div>
                            </div>

                            <div className="order-detail-section">
                                <h3>Chi tiết sản phẩm</h3>
                                {orderDetails.length > 0 ? (
                                    <table className="items-table">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Đơn giá</th>
                                                <th>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.productId}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                                                    <td className="total">
                                                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Không có chi tiết sản phẩm</p>
                                )}
                            </div>

                            <div className="order-detail-section total-section">
                                <div className="total-row">
                                    <span>Tạm tính:</span>
                                    <span>{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="total-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="total-row final">
                                    <span>Tổng cộng:</span>
                                    <span>{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                                <button 
                                    onClick={() => {
                                        handleCancelOrder(selectedOrder.id);
                                        setSelectedOrder(null);
                                    }}
                                    className="btn btn-danger"
                                >
                                    ✕ Hủy đơn hàng
                                </button>
                            )}
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="btn btn-secondary"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;

import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
    Pending: { label: 'Chờ xử lý', color: 'warning' },
    Processing: { label: 'Đang xử lý', color: 'info' },
    Shipped: { label: 'Đang giao', color: 'primary' },
    Completed: { label: 'Hoàn thành', color: 'success' },
    Cancelled: { label: 'Đã hủy', color: 'danger' },
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [cancelError, setCancelError] = useState('');
    const [cancelSuccess, setCancelSuccess] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await orderApi.getMyOrders();
            // Sắp xếp mới nhất lên đầu
            const sorted = (res.data || []).sort((a, b) => b.id - a.id);
            setOrders(sorted);
        } catch (e) {
            console.error('Failed to load orders', e);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (order) => {
        setSelectedOrder(order);
        setSelectedDetails([]);
        setDetailLoading(true);
        try {
            const res = await orderApi.getById(order.id);
            // Backend trả { order, details } hoặc { order: {...}, details: [...] }
            const data = res.data;
            setSelectedDetails(data.details || []);
        } catch (e) {
            console.error('Failed to load order details', e);
            setSelectedDetails([]);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
        setCancelError('');
        setCancelSuccess('');
        try {
            await orderApi.cancel(orderId);
            setCancelSuccess('Hủy đơn hàng thành công.');
            loadOrders();
            if (selectedOrder?.id === orderId) setSelectedOrder(null);
        } catch (e) {
            setCancelError(e.response?.data?.message || 'Không thể hủy đơn hàng.');
        }
    };

    const formatPrice = (p) =>
        new Intl.NumberFormat('vi-VN').format(p) + ' đ';

    const formatDate = (d) =>
        new Date(d).toLocaleString('vi-VN');

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">
                                <i className="fas fa-shopping-bag mr-2"></i>Đơn Hàng Của Tôi
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    {cancelError && (
                        <div className="alert alert-danger alert-dismissible">
                            <button type="button" className="close" onClick={() => setCancelError('')}>
                                <span>&times;</span>
                            </button>
                            {cancelError}
                        </div>
                    )}
                    {cancelSuccess && (
                        <div className="alert alert-success alert-dismissible">
                            <button type="button" className="close" onClick={() => setCancelSuccess('')}>
                                <span>&times;</span>
                            </button>
                            {cancelSuccess}
                        </div>
                    )}

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Danh sách đơn hàng</h3>
                            <div className="card-tools">
                                <button className="btn btn-sm btn-default" onClick={loadOrders}>
                                    <i className="fas fa-sync-alt mr-1"></i>Làm mới
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fas fa-shopping-bag fa-3x mb-3 d-block"></i>
                                    <p>Bạn chưa có đơn hàng nào</p>
                                    <Link to="/shop" className="btn btn-primary">
                                        <i className="fas fa-store mr-1"></i>→ Tiếp tục mua sắm
                                    </Link>
                                </div>
                            ) : (
                                <table className="table table-striped table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Ngày đặt</th>
                                            <th>Địa chỉ giao hàng</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => {
                                            const status = STATUS_MAP[order.status] || { label: order.status, color: 'secondary' };
                                            return (
                                                <tr key={order.id}>
                                                    <td>#{order.id}</td>
                                                    <td>{formatDate(order.orderDate)}</td>
                                                    <td style={{ maxWidth: 200 }}>
                                                        <span title={order.shippingAddress} style={{
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {order.shippingAddress}
                                                        </span>
                                                    </td>
                                                    <td className="font-weight-bold">
                                                        {formatPrice(order.totalAmount)}
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info mr-1"
                                                            onClick={() => handleViewDetail(order)}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        {(order.status === 'Pending' || order.status === 'Processing') && (
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleCancel(order.id)}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <>
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Chi tiết đơn hàng #{selectedOrder.id}
                                    </h5>
                                    <button type="button" className="close" onClick={() => setSelectedOrder(null)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Trạng thái:</strong>{' '}
                                            <span className={`badge badge-${(STATUS_MAP[selectedOrder.status] || { color: 'secondary' }).color}`}>
                                                {(STATUS_MAP[selectedOrder.status] || { label: selectedOrder.status }).label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
                                    </div>

                                    {detailLoading ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border spinner-border-sm text-primary"></div>
                                            <span className="ml-2">Đang tải chi tiết...</span>
                                        </div>
                                    ) : selectedDetails.length > 0 ? (
                                        <table className="table table-sm table-bordered">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th className="text-center">Số lượng</th>
                                                    <th className="text-right">Đơn giá</th>
                                                    <th className="text-right">Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedDetails.map(d => (
                                                    <tr key={d.id}>
                                                        <td>{d.product?.name || `Sản phẩm #${d.productId}`}</td>
                                                        <td className="text-center">{d.quantity}</td>
                                                        <td className="text-right">{formatPrice(d.unitPrice)}</td>
                                                        <td className="text-right">{formatPrice(d.quantity * d.unitPrice)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="3" className="text-right font-weight-bold">Tổng cộng:</td>
                                                    <td className="text-right font-weight-bold text-primary">
                                                        {formatPrice(selectedOrder.totalAmount)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    ) : (
                                        <p className="text-muted">Không có chi tiết sản phẩm.</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleCancel(selectedOrder.id)}
                                        >
                                            <i className="fas fa-times mr-1"></i>Hủy đơn hàng
                                        </button>
                                    )}
                                    <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default MyOrders;
import React, { useEffect, useState } from 'react';
import { billApi } from '../services/api';

const Bills = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedBill, setSelectedBill] = useState(null);
    const [details, setDetails] = useState([]);
    const [statusUpdate, setStatusUpdate] = useState('');

    useEffect(() => {
        loadBills();
    }, [page, status]);

    const loadBills = async () => {
        setLoading(true);
        try {
            const response = await billApi.getAll({
                status: status || undefined,
                page,
                pageSize,
            });
            setItems(response.data.items || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalCount(response.data.totalCount || 0);
        } catch (error) {
            console.error('Không thể tải danh sách hóa đơn:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDetails = async (id) => {
        try {
            const response = await billApi.getById(id);
            setSelectedBill(response.data.bill);
            setDetails(response.data.details || []);
            setStatusUpdate(response.data.bill?.status || '');
        } catch (error) {
            alert('Không thể tải chi tiết hóa đơn');
        }
    };

    const updateStatus = async () => {
        if (!selectedBill) return;
        try {
            await billApi.updateStatus(selectedBill.id, { status: statusUpdate });
            await openDetails(selectedBill.id);
            loadBills();
        } catch (error) {
            alert(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1 className="m-0">Quản lý hóa đơn</h1>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="form-inline">
                                <label className="mr-2">Trạng thái</label>
                                <select
                                    className="form-control"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Pending">Chờ xử lý</option>
                                    <option value="Completed">Hoàn tất</option>
                                    <option value="Cancelled">Đã hủy</option>
                                </select>
                            </div>
                            <div>Tổng: {totalCount}</div>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : (
                                <>
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Người dùng</th>
                                                <th>Ngày tạo</th>
                                                <th>Tổng tiền</th>
                                                <th>Trạng thái</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.length === 0 ? (
                                                <tr><td className="text-center" colSpan={6}>Không có hóa đơn</td></tr>
                                            ) : (
                                                items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.userId}</td>
                                                        <td>{new Date(item.orderDate).toLocaleString()}</td>
                                                        <td>{item.totalAmount?.toLocaleString()} VND</td>
                                                        <td>{item.status}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-info" onClick={() => openDetails(item.id)}>
                                                                Chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>

                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                                            <li key={item} className={`page-item ${page === item ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setPage(item)}>{item}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${page === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    {selectedBill && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h3 className="card-title">Chi tiết hóa đơn #{selectedBill.id}</h3>
                                <div className="form-inline">
                                    <select
                                        className="form-control mr-2"
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                    >
                                        <option value="Pending">Chờ xử lý</option>
                                        <option value="Completed">Hoàn tất</option>
                                        <option value="Cancelled">Đã hủy</option>
                                    </select>
                                    <button className="btn btn-primary" onClick={updateStatus}>Cập nhật trạng thái</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <strong>Địa chỉ giao hàng:</strong> {selectedBill.shippingAddress}
                                </div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.length === 0 ? (
                                            <tr><td className="text-center" colSpan={3}>Không có chi tiết hóa đơn</td></tr>
                                        ) : (
                                            details.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.product?.name || item.productId}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.unitPrice?.toLocaleString()} VND</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Bills;

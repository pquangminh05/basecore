import React, { useEffect, useState } from 'react';
import { masterDataApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Manufacturers = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadData();
    }, [page, keyword]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await masterDataApi.getManufacturers({
                keyword: keyword || undefined,
                page,
                pageSize,
            });
            setItems(response.data.items || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalCount(response.data.totalCount || 0);
        } catch (err) {
            console.error('Không thể tải danh sách thương hiệu', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, description: item.description || '' });
        } else {
            setEditingItem(null);
            setFormData({ name: '', description: '' });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await masterDataApi.updateManufacturer(editingItem.id, formData);
            } else {
                await masterDataApi.createManufacturer(formData);
            }
            closeModal();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
        try {
            await masterDataApi.deleteManufacturer(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <h1 className="m-0">Quản lý thương hiệu</h1>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <form onSubmit={handleSearch} className="form-inline">
                                        <input
                                            type="text"
                                            className="form-control mr-2"
                                            placeholder="Tìm kiếm..."
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <button className="btn btn-primary" type="submit">Tìm kiếm</button>
                                    </form>
                                </div>
                                <div className="col-md-6 text-right">
                                    {isAdmin() && <button className="btn btn-success" onClick={() => openModal()}>Thêm thương hiệu</button>}
                                </div>
                            </div>
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
                                                <th>Tên</th>
                                                <th>Mô tả</th>
                                                {isAdmin() && <th>Thao tác</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.length === 0 ? (
                                                <tr><td className="text-center" colSpan={isAdmin() ? 4 : 3}>Không có dữ liệu</td></tr>
                                            ) : (
                                                items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>
                                                        {isAdmin() && (
                                                            <td>
                                                                <button className="btn btn-sm btn-info mr-1" onClick={() => openModal(item)}>Sửa</button>
                                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Xóa</button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Tổng: {totalCount}</span>
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
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingItem ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}</h5>
                                <button type="button" className="close" onClick={closeModal}><span>&times;</span></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    <div className="form-group">
                                        <label>Tên</label>
                                        <input
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'Cập nhật' : 'Tạo mới'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Manufacturers;

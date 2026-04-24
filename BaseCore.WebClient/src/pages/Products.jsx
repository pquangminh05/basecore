import React, { useState, useEffect } from 'react';
import { productApi, categoryApi, masterDataApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [productTypeId, setProductTypeId] = useState('');
    const [manufacturerId, setManufacturerId] = useState('');
    const [colorId, setColorId] = useState('');
    const [sizeId, setSizeId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock, setInStock] = useState('');
    const [productTypes, setProductTypes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: '',
        categoryId: '',
        productTypeId: '',
        manufacturerId: '',
        colorId: '',
        sizeId: '',
    });
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadCategories();
        loadMasterData();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page]);

    const loadCategories = async () => {
        try {
            const response = await categoryApi.getAll({ page: 1, pageSize: 500 });
            setCategories(response.data.items || []);
        } catch (error) {
            console.error('Không thể tải danh mục:', error);
        }
    };

    const loadMasterData = async () => {
        try {
            const response = await masterDataApi.getOptions();
            setProductTypes(response.data.productTypes || []);
            setManufacturers(response.data.manufacturers || []);
            setColors(response.data.colors || []);
            setSizes(response.data.sizes || []);
        } catch (error) {
            console.error('Không thể tải dữ liệu dùng chung:', error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productApi.search({
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
                productTypeId: productTypeId || undefined,
                manufacturerId: manufacturerId || undefined,
                colorId: colorId || undefined,
                sizeId: sizeId || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                inStock: inStock === '' ? undefined : inStock === 'true',
                page,
                pageSize,
            });
            setProducts(response.data.items || response.data.data || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalCount(response.data.totalCount || 0);
        } catch (error) {
            console.error('Không thể tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (page !== 1) {
            setPage(1);
            return;
        }
        loadProducts();
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description || '',
                imageUrl: product.imageUrl || '',
                categoryId: product.categoryId,
                productTypeId: product.productTypeId || '',
                manufacturerId: product.manufacturerId || '',
                colorId: product.colorId || '',
                sizeId: product.sizeId || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                stock: '',
                description: '',
                imageUrl: '',
                categoryId: '',
                productTypeId: '',
                manufacturerId: '',
                colorId: '',
                sizeId: '',
            });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!editingProduct && categories.length === 0) {
            setError('Bạn cần tạo danh mục trước khi thêm sản phẩm.');
            return;
        }

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId),
                productTypeId: formData.productTypeId ? parseInt(formData.productTypeId) : null,
                manufacturerId: formData.manufacturerId ? parseInt(formData.manufacturerId) : null,
                colorId: formData.colorId ? parseInt(formData.colorId) : null,
                sizeId: formData.sizeId ? parseInt(formData.sizeId) : null,
            };

            if (editingProduct) {
                await productApi.update(editingProduct.id, { id: editingProduct.id, ...data });
            } else {
                await productApi.create(data);
            }

            closeModal();
            loadProducts();
        } catch (error) {
            setError(error.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            await productApi.delete(id);
            loadProducts();
        } catch (error) {
            alert('Không thể xóa sản phẩm');
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i)}>{i}</button>
                </li>
            );
        }
        return pages;
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Quản lý sản phẩm</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-6">
                                    <form onSubmit={handleSearch}>
                                        <div className="form-row">
                                            <div className="col-md-3 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control w-100"
                                                    placeholder="Tìm theo mẫu/loại/mô tả..."
                                                    value={keyword}
                                                    onChange={(e) => setKeyword(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={categoryId}
                                                    onChange={(e) => setCategoryId(e.target.value)}
                                                >
                                                    <option value="">Tất cả danh mục</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={productTypeId}
                                                    onChange={(e) => setProductTypeId(e.target.value)}
                                                >
                                                    <option value="">Tất cả loại</option>
                                                    {productTypes.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={manufacturerId}
                                                    onChange={(e) => setManufacturerId(e.target.value)}
                                                >
                                                    <option value="">Tất cả thương hiệu</option>
                                                    {manufacturers.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-md-2 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={colorId}
                                                    onChange={(e) => setColorId(e.target.value)}
                                                >
                                                    <option value="">Tất cả màu</option>
                                                    {colors.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={sizeId}
                                                    onChange={(e) => setSizeId(e.target.value)}
                                                >
                                                    <option value="">Tất cả kích thước</option>
                                                    {sizes.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control w-100"
                                                    placeholder="Giá từ"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control w-100"
                                                    placeholder="Giá đến"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-2 mb-2">
                                                <select
                                                    className="form-control w-100"
                                                    value={inStock}
                                                    onChange={(e) => setInStock(e.target.value)}
                                                >
                                                    <option value="">Tất cả tồn kho</option>
                                                    <option value="true">Còn hàng</option>
                                                    <option value="false">Hết hàng</option>
                                                </select>
                                            </div>
                                            <div className="col-md-2 mb-2">
                                                <button type="submit" className="btn btn-primary btn-block">
                                                    <i className="fas fa-search"></i> Tìm kiếm
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-6 text-right">
                                    {isAdmin() && (
                                        <button className="btn btn-success" onClick={() => openModal()}>
                                            <i className="fas fa-plus"></i> Thêm sản phẩm
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                </div>
                            ) : (
                                <>
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên</th>
                                                <th>Danh mục</th>
                                                <th>Loại</th>
                                                <th>Thương hiệu</th>
                                                <th>Giá</th>
                                                <th>Tồn kho</th>
                                                {isAdmin() && <th>Thao tác</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.length === 0 ? (
                                                <tr>
                                                    <td colSpan={isAdmin() ? 8 : 7} className="text-center">
                                                        Không có sản phẩm
                                                    </td>
                                                </tr>
                                            ) : (
                                                products.map(product => (
                                                    <tr key={product.id}>
                                                        <td>{product.id}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.category?.name}</td>
                                                        <td>{product.productType?.name}</td>
                                                        <td>{product.manufacturer?.name}</td>
                                                        <td>{product.price?.toLocaleString()} VND</td>
                                                        <td>{product.stock}</td>
                                                        {isAdmin() && (
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-info mr-1"
                                                                    onClick={() => openModal(product)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDelete(product.id)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Tổng: {totalCount} sản phẩm</span>
                                        <nav>
                                            <ul className="pagination mb-0">
                                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => setPage(page - 1)}>
                                                        Trước
                                                    </button>
                                                </li>
                                                {renderPagination()}
                                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-link" onClick={() => setPage(page + 1)}>
                                                        Sau
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProduct ? 'Sửa sản phẩm đồng hồ' : 'Thêm sản phẩm đồng hồ'}
                                </h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {categories.length === 0 && (
                                        <div className="alert alert-warning">
                                            Chưa có danh mục nào. Vào trang Danh mục để tạo trước khi thêm sản phẩm.
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Tên mẫu đồng hồ</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Danh mục</label>
                                                <select
                                                    className="form-control"
                                                    value={formData.categoryId}
                                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                                    required
                                                >
                                                    <option value="">
                                                        {categories.length === 0 ? 'Chưa có danh mục' : 'Chọn danh mục'}
                                                    </option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Loại sản phẩm</label>
                                                <select
                                                    className="form-control"
                                                    value={formData.productTypeId}
                                                    onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                                                >
                                                    <option value="">Chọn loại đồng hồ</option>
                                                    {productTypes.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Thương hiệu</label>
                                                <select
                                                    className="form-control"
                                                    value={formData.manufacturerId}
                                                    onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
                                                >
                                                    <option value="">Chọn thương hiệu</option>
                                                    {manufacturers.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Màu sắc</label>
                                                <select
                                                    className="form-control"
                                                    value={formData.colorId}
                                                    onChange={(e) => setFormData({ ...formData, colorId: e.target.value })}
                                                >
                                                    <option value="">Chọn màu sắc</option>
                                                    {colors.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label>Kích thước</label>
                                                <select
                                                    className="form-control"
                                                    value={formData.sizeId}
                                                    onChange={(e) => setFormData({ ...formData, sizeId: e.target.value })}
                                                >
                                                    <option value="">Chọn kích thước</option>
                                                    {sizes.map(item => (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Giá</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    required
                                                    min="0"
                                                    placeholder="VND"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tồn kho</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                    required
                                                    min="0"
                                                    placeholder="Số lượng trong kho"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!editingProduct && categories.length === 0}
                                    >
                                        {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                                    </button>
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

export default Products;

import React, { useEffect, useState } from 'react';
import { categoryApi, masterDataApi, productApi } from '../services/api';
import { useCart } from '../contexts/CartContext';
import ShoppingCart from '../components/ShoppingCart';

const Shop = () => {
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
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);

    const { addToCart, getTotalItems } = useCart();

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
            setProducts(response.data.items || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Không thể tải sản phẩm:', error);
        } finally {
            setLoading(false);
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (page !== 1) {
            setPage(1);
            return;
        }
        loadProducts();
    };

    const handleAddToCart = (product) => {
        setAddingToCart(product.id);
        setTimeout(() => {
            addToCart(product, 1);
            setAddingToCart(null);
            alert(`✓ ${product.name} đã được thêm vào giỏ hàng`);
        }, 300);
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="m-0">🛍️ Cửa Hàng Sản Phẩm</h1>
                        <div className="d-flex gap-2">
                            <button
                                onClick={() => setCartOpen(true)}
                                className="btn btn-success position-relative"
                            >
                                🛒 Giỏ hàng
                                {getTotalItems() > 0 && (
                                    <span className="badge badge-danger ml-1">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>
                            <a href="/my-orders" className="btn btn-info">📋 Đơn hàng của tôi</a>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">

            <form onSubmit={handleSearch} className="form-row mb-4">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tên sản phẩm/loại"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-control" value={productTypeId} onChange={(e) => setProductTypeId(e.target.value)}>
                        <option value="">Tất cả loại</option>
                        {productTypes.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-control" value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)}>
                        <option value="">Tất cả thương hiệu</option>
                        {manufacturers.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-control" value={colorId} onChange={(e) => setColorId(e.target.value)}>
                        <option value="">Tất cả màu</option>
                        {colors.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-1">
                    <select className="form-control" value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
                        <option value="">Size</option>
                        {sizes.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-1">
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Gia tu"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-1">
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Gia den"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-1">
                    <select className="form-control" value={inStock} onChange={(e) => setInStock(e.target.value)}>
                        <option value="">Trạng thái kho</option>
                        <option value="true">Còn hàng</option>
                        <option value="false">Hết hàng</option>
                    </select>
                </div>
                <div className="col-md-1">
                    <button type="submit" className="btn btn-primary">Tìm</button>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : (
                <>
                    <div className="row">
                        {products.length === 0 && (
                            <div className="col-12 text-center text-muted py-5">Không có sản phẩm phù hợp</div>
                        )}
                        {products.map((product) => (
                            <div key={product.id} className="col-md-3 mb-3">
                                <div className="card h-100">
                                    {product.imageUrl && (
                                        <img src={product.imageUrl} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{product.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{product.category?.name}</h6>
                                        <small className="d-block mb-2 text-muted">
                                            {product.productType?.name} | {product.manufacturer?.name} | {product.color?.name} | {product.size?.name}
                                        </small>
                                        <p className="mb-2 flex-grow-1">{product.description || 'Không có mô tả'}</p>
                                        <div className="font-weight-bold mb-1 text-success" style={{ fontSize: '16px' }}>
                                            {product.price?.toLocaleString('vi-VN')} ₫
                                        </div>
                                        <small className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                                            {product.stock > 0 ? `✓ Còn ${product.stock} sản phẩm` : '✕ Hết hàng'}
                                        </small>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0 || addingToCart === product.id}
                                            className="btn btn-primary mt-3 w-100"
                                        >
                                            {addingToCart === product.id ? '⏳ Đang thêm...' : '🛒 Thêm vào giỏ'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                                    <li key={item} className={`page-item ${page === item ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(item)}>{item}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}

            <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
                </div>
            </section>
        </div>
    );
};

export default Shop;
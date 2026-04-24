import React, { useEffect, useState } from 'react';
import { billApi, categoryApi, masterDataApi, productApi, userApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        manufacturers: 0,
        lowStock: 0,
        outOfStock: 0,
        pendingBills: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes, optionsRes] = await Promise.all([
                productApi.getAll({ page: 1, pageSize: 500 }),
                categoryApi.getAll({ page: 1, pageSize: 1 }),
                masterDataApi.getOptions(),
            ]);

            const products = productsRes.data?.items || [];
            const lowStock = products.filter((item) => item.stock > 0 && item.stock <= 5).length;
            const outOfStock = products.filter((item) => item.stock <= 0).length;
            const manufacturers = optionsRes.data?.manufacturers || [];

            let usersCount = 0;
            let pendingBills = 0;
            if (isAdmin()) {
                try {
                    const [usersRes, billsRes] = await Promise.all([
                        userApi.getAll({ page: 1, pageSize: 1 }),
                        billApi.getAll({ status: 'Pending', page: 1, pageSize: 1 }),
                    ]);
                    usersCount = usersRes.data?.totalCount || 0;
                    pendingBills = billsRes.data?.totalCount || 0;
                } catch (e) {
                    console.log('Cannot fetch admin stats');
                }
            }

            setStats({
                products: productsRes.data?.totalCount || products.length,
                categories: categoriesRes.data?.totalCount || 0,
                manufacturers: manufacturers.length,
                lowStock,
                outOfStock,
                pendingBills,
                users: usersCount,
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Bảng điều khiển cửa hàng đồng hồ</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container-fluid">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Đang tải...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-lg-3 col-6">
                                    <div className="small-box bg-primary">
                                        <div className="inner">
                                            <h3>{stats.products}</h3>
                                            <p>Mẫu đồng hồ</p>
                                        </div>
                                        <div className="icon">
                                            <i className="fas fa-clock"></i>
                                        </div>
                                        <a href="/products" className="small-box-footer">
                                            Quản lý sản phẩm <i className="fas fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="small-box bg-success">
                                        <div className="inner">
                                            <h3>{stats.categories}</h3>
                                            <p>Danh mục đồng hồ</p>
                                        </div>
                                        <div className="icon">
                                            <i className="fas fa-tags"></i>
                                        </div>
                                        <a href="/categories" className="small-box-footer">
                                            Danh mục đồng hồ <i className="fas fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="small-box bg-info">
                                        <div className="inner">
                                            <h3>{stats.manufacturers}</h3>
                                            <p>Thương hiệu</p>
                                        </div>
                                        <div className="icon">
                                            <i className="fas fa-industry"></i>
                                        </div>
                                        <a href="/manufacturers" className="small-box-footer">
                                            Thương hiệu đồng hồ <i className="fas fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-6">
                                    <div className="small-box bg-danger">
                                        <div className="inner">
                                            <h3>{stats.outOfStock}</h3>
                                            <p>Hết hàng</p>
                                        </div>
                                        <div className="icon">
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <a href="/products" className="small-box-footer">
                                            Kiểm tra tồn kho <i className="fas fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-4 col-6">
                                    <div className="small-box bg-warning">
                                        <div className="inner">
                                            <h3>{stats.lowStock}</h3>
                                            <p>Sắp hết hàng (&lt;=5)</p>
                                        </div>
                                        <div className="icon">
                                            <i className="fas fa-box-open"></i>
                                        </div>
                                        <a href="/products" className="small-box-footer">
                                            Bổ sung tồn kho <i className="fas fa-arrow-circle-right"></i>
                                        </a>
                                    </div>
                                </div>

                                {isAdmin() && (
                                    <div className="col-lg-4 col-6">
                                        <div className="small-box bg-secondary">
                                            <div className="inner">
                                                <h3>{stats.pendingBills}</h3>
                                                <p>Hóa đơn chờ xử lý</p>
                                            </div>
                                            <div className="icon">
                                                <i className="fas fa-file-invoice"></i>
                                            </div>
                                            <a href="/bills" className="small-box-footer">
                                                Xử lý hóa đơn <i className="fas fa-arrow-circle-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {isAdmin() && (
                                    <div className="col-lg-4 col-6">
                                        <div className="small-box bg-dark">
                                            <div className="inner">
                                                <h3>{stats.users}</h3>
                                                <p>Tài khoản nhân viên</p>
                                            </div>
                                            <div className="icon">
                                                <i className="fas fa-users"></i>
                                            </div>
                                            <a href="/users" className="small-box-footer">
                                                Quản lý tài khoản <i className="fas fa-arrow-circle-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Tổng quan vận hành cửa hàng đồng hồ</h3>
                                </div>
                                <div className="card-body">
                                    <p>Bảng điều khiển này được tối ưu cho bài toán quản lý cửa hàng đồng hồ.</p>
                                    <ul>
                                        <li><strong>Danh mục:</strong> Luxury, Sport, Smart, Classic Watches</li>
                                        <li><strong>Thương hiệu:</strong> Rolex, Omega, Seiko và các brand bổ sung</li>
                                        <li><strong>Vận hành:</strong> Theo dõi tồn kho, hóa đơn chờ xử lý, đơn hết hàng</li>
                                        <li><strong>Điều hướng nhanh:</strong> Sản phẩm, Danh mục, Thương hiệu, Hóa đơn</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

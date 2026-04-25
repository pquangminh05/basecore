import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="layout-container">
            {/* Navbar */}
            <nav className="main-navbar">
                <div className="navbar-content">
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="brand-logo">
                        <span>⌚ Watch Store</span>
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="user-menu">
                        <span className="user-name">👤 {user?.name || user?.username}</span>
                        <button 
                            className="btn-logout"
                            onClick={handleLogout}
                            title="Đăng xuất"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className={`main-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-header">
                    <div className="user-info">
                        <div className="user-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <div>
                            <p className="user-role">{user?.name || user?.username}</p>
                            <span className="user-badge">{isAdmin() ? '🛡️ Admin' : '👤 User'}</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <ul>
                        {/* Dashboard */}
                        <li className="menu-item">
                            <Link to="/" className={`menu-link ${isActive('/')}`}>
                                <span className="icon">📊</span>
                                <span>Bảng điều khiển</span>
                            </Link>
                        </li>

                        {/* User Menu */}
                        {!isAdmin() && (
                            <>
                                <li className="menu-divider">MUASẮM</li>
                                <li className="menu-item">
                                    <Link to="/shop" className={`menu-link ${isActive('/shop')}`}>
                                        <span className="icon">🛍️</span>
                                        <span>Cửa hàng</span>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/my-orders" className={`menu-link ${isActive('/my-orders')}`}>
                                        <span className="icon">📦</span>
                                        <span>Đơn hàng của tôi</span>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/products" className={`menu-link ${isActive('/products')}`}>
                                        <span className="icon">🎁</span>
                                        <span>Sản phẩm</span>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/categories" className={`menu-link ${isActive('/categories')}`}>
                                        <span className="icon">🏷️</span>
                                        <span>Danh mục</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Admin Menu */}
                        {isAdmin() && (
                            <>
                                <li className="menu-divider">QUẢN LÝ</li>
                                <li className="menu-item">
                                    <Link to="/products" className={`menu-link ${isActive('/products')}`}>
                                        <span className="icon">📦</span>
                                        <span>Sản phẩm</span>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/categories" className={`menu-link ${isActive('/categories')}`}>
                                        <span className="icon">🏷️</span>
                                        <span>Danh mục</span>
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/manufacturers" className={`menu-link ${isActive('/manufacturers')}`}>
                                        <span className="icon">🏭</span>
                                        <span>Thương hiệu</span>
                                    </Link>
                                </li>
                                <li className="menu-divider">KINH DOANH</li>
                                <li className="menu-item">
                                    <Link to="/bills" className={`menu-link ${isActive('/bills')}`}>
                                        <span className="icon">📋</span>
                                        <span>Đơn hàng</span>
                                    </Link>
                                </li>
                                <li className="menu-divider">HỆ THỐNG</li>
                                <li className="menu-item">
                                    <Link to="/users" className={`menu-link ${isActive('/users')}`}>
                                        <span className="icon">👥</span>
                                        <span>Người dùng</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
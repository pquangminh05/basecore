import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="watch-login-page">
            <div className="watch-login-card">
                <div className="watch-login-brand">
                    <span className="watch-login-badge">WATCH STORE</span>
                    <h1>Bảng điều hành bán hàng</h1>
                    <p>Quản lý sản phẩm đồng hồ, đơn hàng và vận hành cửa hàng.</p>
                </div>

                <div className="watch-login-form-wrap">
                    <div className="watch-login-header">
                        <h2>Đăng nhập</h2>
                        <small>Sử dụng tài khoản quản trị để tiếp tục</small>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible mb-3">
                            <button type="button" className="close" onClick={() => setError('')}>
                                &times;
                            </button>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="watch-login-form">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user"></span>
                                </div>
                            </div>
                        </div>

                        <div className="input-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-dark btn-block watch-login-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm"></span>
                            ) : 'Đăng nhập hệ thống'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

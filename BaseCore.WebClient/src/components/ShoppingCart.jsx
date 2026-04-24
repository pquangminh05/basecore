import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { orderApi } from '../services/api';
import './ShoppingCart.css';

const ShoppingCart = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePlaceOrder = async () => {
        if (!shippingAddress.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        if (cartItems.length === 0) {
            setError('Giỏ hàng trống');
            return;
        }

        // Kiểm tra tồn kho
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                setError(`Sản phẩm "${item.productName}" không đủ tồn kho. Còn lại: ${item.stock}`);
                return;
            }
        }

        setLoading(true);
        setError('');
        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
                shippingAddress: shippingAddress,
            };

            await orderApi.create(orderData);
            setSuccess('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.');
            clearCart();
            setShippingAddress('');
            
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="cart-modal-overlay" onClick={onClose}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2>🛒 Giỏ Hàng ({getTotalItems()} sản phẩm)</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="cart-modal-content">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Giỏ hàng của bạn trống</p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="cart-item">
                                    <img src={item.imageUrl} alt={item.productName} className="cart-item-image" />
                                    <div className="cart-item-info">
                                        <h4>{item.productName}</h4>
                                        <p className="price">{item.price.toLocaleString('vi-VN')} ₫</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button 
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="qty-btn"
                                        >−</button>
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                            className="qty-input"
                                        />
                                        <button 
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="qty-btn"
                                        >+</button>
                                    </div>
                                    <div className="cart-item-total">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.productId)}
                                        className="remove-btn"
                                    >🗑</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="shipping-section">
                            <label>Địa chỉ giao hàng:</label>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Nhập địa chỉ giao hàng..."
                                className="shipping-input"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="summary-row">
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="summary-row total">
                                <span>Tổng cộng:</span>
                                <span>{getTotalPrice().toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button 
                                onClick={clearCart}
                                className="btn btn-secondary"
                            >Xóa tất cả</button>
                            <button 
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? 'Đang xử lý...' : '✓ Đặt hàng'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;

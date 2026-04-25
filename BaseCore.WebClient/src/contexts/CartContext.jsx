import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'shopping_cart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initialization
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    });

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    const addToCart = useCallback((product, quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.productId === product.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, {
                productId: product.id,
                productName: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity,
                stock: product.stock,
            }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.productId === productId ? { ...item, quantity } : item
                )
            );
        }
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

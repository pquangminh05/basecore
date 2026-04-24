import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (data) => api.post('/auth/register', data),
};

// User API
export const userApi = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Product API
export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    search: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Category API
export const categoryApi = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Order API
export const orderApi = {
    create: (data) => api.post('/orders', data),
    getMyOrders: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Admin Order API
export const adminOrderApi = {
    getAllOrders: (params) => api.get('/orders/admin/all', { params }),
    searchOrders: (params) => api.get('/orders/admin/search', { params }),
    getDashboard: () => api.get('/orders/admin/dashboard'),
    getRevenue: (params) => api.get('/orders/admin/revenue', { params }),
    getTopProducts: (params) => api.get('/orders/admin/top-products', { params }),
    updateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
    cancelOrder: (id) => api.post(`/orders/admin/${id}/cancel`),
};

export const masterDataApi = {
    getOptions: () => api.get('/master-data/options'),
    getManufacturers: (params) => api.get('/master-data/manufacturers', { params }),
    createManufacturer: (data) => api.post('/master-data/manufacturers', data),
    updateManufacturer: (id, data) => api.put(`/master-data/manufacturers/${id}`, data),
    deleteManufacturer: (id) => api.delete(`/master-data/manufacturers/${id}`),
};

export const billApi = {
    getAll: (params) => api.get('/bills', { params }),
    getById: (id) => api.get(`/bills/${id}`),
    updateStatus: (id, data) => api.put(`/bills/${id}/status`, data),
};

export default api;
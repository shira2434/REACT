import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// שורה 3 בקובץ הזה:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({ baseURL: API_BASE_URL });

// צרף token לכל בקשה
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// אם token פג תוקף - נתק
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  addProduct: (product) => api.post('/products', product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/products/${productId}/reviews`),
  addReview: (review) => api.post('/reviews', review),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const usersAPI = {
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  addOrder: (order) => api.post('/orders', order),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
};

export const adminAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  getAllReviews: () => api.get('/reviews'),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  addCategory: (cat) => api.post('/categories', cat),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default api;

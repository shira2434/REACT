import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
};

export default api;

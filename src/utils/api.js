import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authorizedPersonApi = {
  list: () => api.get('/authorized-person/list'),
  add: (data) => api.post('/authorized-person/add', data),
  bulkUpload: (formData) => api.post('/authorized-person/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const formsApi = {
  getTradeEnquiries: () => api.get('/trade-enquiry'),
  getQuotations: () => api.get('/quotation'),
  getAuctions: () => api.get('/auction'),
  getAppointments: () => api.get('/appointment'),
  getBuyerSubmissions: () => api.get('/etrade/submissions?type=buyer'),
  getSellerSubmissions: () => api.get('/etrade/submissions?type=seller'),
  getContactSubmissions: () => api.get('/contact'),
  getBulkSellers: () => api.get('/bulk'),
};

export const productApi = {
  list: (siteId) => api.get(`/product${siteId ? `?siteId=${siteId}` : ''}`),
  add: (formData) => api.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/product/${id}`),
};

export const categoryApi = {
  list: (siteId) => api.get(`/category${siteId ? `?siteId=${siteId}` : ''}`),
  add: (data) => api.post('/category', data),
  update: (id, data) => api.put(`/category/${id}`, data),
  delete: (id) => api.delete(`/category/${id}`),
};

export default api;

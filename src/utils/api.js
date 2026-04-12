import axios from 'axios';

const API_BASE_URL = 'https://api.parekhchamber.com/api';

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
  update: (id, data) => api.put(`/authorized-person/${id}`, data),
  delete: (id) => api.delete(`/authorized-person/${id}`),
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
  getMembershipEnquiries: () => api.get('/membership'),
};

export const productApi = {
  list: (siteId) => api.get(`/product${siteId ? `?siteId=${siteId}` : ''}`),
  add: (formData) => api.post('/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/product/${id}`, formData, {
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

export const blogApi = {
  list: (siteId, status) => {
    let url = '/blogs';
    const params = [];
    if (siteId && siteId !== 'all') params.push(`siteId=${siteId}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return api.get(url);
  },
  add: (formData) => api.post('/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/blogs/${id}`),
};

export const careerApi = {
  list: (siteId, status) => {
    let url = '/careers';
    const params = [];
    if (siteId && siteId !== 'all') params.push(`siteId=${siteId}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return api.get(url);
  },
  add: (data) => api.post('/careers', data),
  update: (id, data) => api.put(`/careers/${id}`, data),
  delete: (id) => api.delete(`/careers/${id}`),
};

export const mediaEventApi = {
  list: (siteId) => {
    let url = '/media-events';
    if (siteId && siteId !== 'all') url += `?siteId=${siteId}`;
    return api.get(url);
  },
  add: (formData) => api.post('/media-events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/media-events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/media-events/${id}`),
};

export default api;

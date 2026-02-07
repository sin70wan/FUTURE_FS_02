import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getMe: () => 
    api.get('/auth/me'),
  
  logout: () => 
    api.post('/auth/logout'),
};

// Leads API
export const leadAPI = {
  // Get all leads with optional filters
  getLeads: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return api.get(`/leads?${params.toString()}`);
  },
  
  // Get single lead
  getLead: (id) => api.get(`/leads/${id}`),
  
  // Create new lead
  createLead: (leadData) => api.post('/leads', leadData),
  
  // Update lead
  updateLead: (id, leadData) => api.put(`/leads/${id}`, leadData),
  
  // Delete lead
  deleteLead: (id) => api.delete(`/leads/${id}`),
  
  // Add note to lead
  addNote: (id, noteData) => api.post(`/leads/${id}/notes`, noteData),
  
  // Get dashboard stats
  getDashboardStats: () => api.get('/leads/dashboard/stats'),
};

export default api;
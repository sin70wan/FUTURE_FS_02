import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
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

// Auth API calls
export const authAPI = {
    login: (email, password) => 
        api.post('/auth/login', { email, password }),
    
    register: (userData) => 
        api.post('/auth/register', userData),
    
    getMe: () => 
        api.get('/auth/me'),
    
    logout: () => 
        api.post('/auth/logout')
};

// Lead API calls
export const leadAPI = {
    getLeads: (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        return api.get(`/leads?${params.toString()}`);
    },
    
    getLead: (id) => api.get(`/leads/${id}`),
    
    createLead: (leadData) => api.post('/leads', leadData),
    
    updateLead: (id, leadData) => api.put(`/leads/${id}`, leadData),
    
    deleteLead: (id) => api.delete(`/leads/${id}`),
    
    addNote: (id, noteData) => api.post(`/leads/${id}/notes`, noteData),
    
    getDashboardStats: () => api.get('/leads/dashboard/stats')
};

export default api;
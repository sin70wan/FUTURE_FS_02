import api from './api';

// Decode JWT token without external library
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const authService = {
    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // Register user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user from token
    getCurrentUserFromToken: () => {
        const token = localStorage.getItem('token');
        if (token) {
            return decodeToken(token);
        }
        return null;
    },

    // Get user role
    getUserRole: () => {
        const user = authService.getCurrentUserFromToken();
        return user?.role || null;
    },

    // Check if admin
    isAdmin: () => {
        const role = authService.getUserRole();
        return role === 'admin';
    }
};
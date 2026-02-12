import api from './api';

export const auth = {
    login: async (email, password) => {
        try {
            console.log('Attempting login to:', '/auth/login');
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);
            
            if (response.data.token) {
                localStorage.setItem('crm_auth_token', response.data.token);
            }
            
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Register service error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('crm_auth_token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('crm_auth_token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // ✅ ADD THIS FUNCTION - Check if current user is admin
    isAdmin: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return false;
            
            const user = JSON.parse(userStr);
            return user.role === 'admin';
        } catch (e) {
            console.error('Error checking admin status:', e);
            return false;
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error parsing user:', e);
            return null;
        }
    }
};
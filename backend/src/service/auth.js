import api from './api';

export const auth = {
    // Login
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Check if admin
    isAdmin: () => {
        const user = auth.getCurrentUser();
        return user?.role === 'admin';
    }
};
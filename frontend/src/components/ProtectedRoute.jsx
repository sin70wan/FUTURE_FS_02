import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth'; // CHANGE THIS - from '../utils/auth' to '../services/auth'

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    const user = authService.getCurrentUserFromToken();
    
    if (!user) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
    
    // Check if route requires admin and user is not admin
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
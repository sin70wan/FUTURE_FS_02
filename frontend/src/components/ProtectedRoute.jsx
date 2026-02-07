import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 ProtectedRoute - Checking authentication...');
    console.log('🔑 Token in localStorage:', localStorage.getItem('token'));
    console.log('👤 User in localStorage:', localStorage.getItem('user'));
    
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('✅ Token found, setting authenticated to TRUE');
      setIsAuthenticated(true);
    } else {
      console.log('❌ No token found, setting authenticated to FALSE');
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  console.log('📊 ProtectedRoute state:', { loading, isAuthenticated });

  if (loading) {
    console.log('⏳ ProtectedRoute - Loading...');
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute - NOT authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute - Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
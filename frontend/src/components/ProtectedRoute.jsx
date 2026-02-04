import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    console.log('🔐 ProtectedRoute - Token check:', token ? 'Token exists' : 'No token');
    
    // For demo purposes, accept any token
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute - Allowing access');
  return children;
};

export default ProtectedRoute;

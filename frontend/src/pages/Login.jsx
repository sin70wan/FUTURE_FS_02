import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  console.log('🔐 Login attempt with:', formData.email);

  // SIMPLE VALIDATION - NO BACKEND CALL
  setTimeout(() => {
    if (formData.email === 'admin@nexuscrm.com' && formData.password === 'admin123') {
      console.log('✅ Valid credentials');
      
      // Create mock token
      const mockToken = 'demo-token-' + Date.now();
      
      console.log('🔄 Setting token:', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify({
        id: 'demo-id',
        name: 'Admin User',
        email: formData.email,
        role: 'admin'
      }));
      
      console.log('📋 After setting - Token:', localStorage.getItem('token'));
      console.log('📋 After setting - User:', localStorage.getItem('user'));
      
      toast.success('Login successful!');
      
      // Use window.location to force navigation
      console.log('🚀 Navigating to /dashboard');
      window.location.href = '/dashboard';
      
    } else {
      console.log('❌ Invalid credentials');
      setError('Invalid credentials. Use: admin@nexuscrm.com / admin123');
      toast.error('Login failed');
    }
    setLoading(false);
  }, 1000);
};

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@nexuscrm.com',
      password: 'admin123'
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          NexusCRM
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Client Lead Management System
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleDemoLogin}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              Use Demo Admin Account
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              Default admin: admin@nexuscrm.com / admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
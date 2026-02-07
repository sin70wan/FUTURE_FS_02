import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Search,
  Add,
  TrendingUp,
  Email,
  Phone,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getDashboardStats();
      const data = response.data;
      
      setStats(data.stats);
      setRecentLeads(data.recentLeads || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    navigate('/leads?action=add');
  };

  if (loading) {
    return (
      <Layout title="Dashboard Overview">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard Overview">
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
        <Button onClick={fetchDashboardData} variant="outlined">
          Retry
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      {/* Top Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search leads, companies..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddLead}
        >
          Add New Lead
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Leads
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.totalLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    +12%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                New Leads
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.newLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    +5%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Contacted
              </Typography>
              <Typography variant="h4">{stats?.contactedLeads || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Converted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.convertedLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    +18%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Leads */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Leads</Typography>
              <Button
                variant="text"
                onClick={() => navigate('/leads')}
              >
                View All
              </Button>
            </Box>
            
            {recentLeads.length > 0 ? (
              <Box>
                {recentLeads.map((lead) => (
                  <Box
                    key={lead._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {lead.name?.charAt(0) || 'L'}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {lead.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.email}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {lead.source}
                      </Typography>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: lead.status === 'New' ? '#dbeafe' : 
                                   lead.status === 'Contacted' ? '#fef3c7' : '#d1fae5',
                          color: lead.status === 'New' ? '#1e40af' : 
                                 lead.status === 'Contacted' ? '#92400e' : '#065f46',
                          fontSize: '0.75rem',
                          fontWeight: 'medium'
                        }}
                      >
                        {lead.status}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No leads found. Add your first lead!
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Email />}
                  onClick={() => navigate('/leads')}
                  sx={{ py: 1.5 }}
                >
                  Send Email
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={() => navigate('/leads')}
                  sx={{ py: 1.5 }}
                >
                  Make Call
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  onClick={handleAddLead}
                  sx={{ py: 1.5 }}
                >
                  Add Lead
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/leads')}
                  sx={{ py: 1.5 }}
                >
                  View All
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
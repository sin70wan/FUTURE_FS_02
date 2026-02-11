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
import api from '../services/api';
import { auth } from '../services/auth';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = auth.getCurrentUser();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads');
      const data = response.data;
      setLeads(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from leads data
  const getStats = () => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const lostLeads = leads.filter(lead => lead.status === 'lost').length;
    
    return {
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      lostLeads
    };
  };

  // Get recent leads (last 5)
  const getRecentLeads = () => {
    return leads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const handleAddLead = () => {
    navigate('/leads?action=add');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = getStats();
  const recentLeads = getRecentLeads();

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
        <Button onClick={fetchLeads} variant="outlined" sx={{ m: 2 }}>
          Retry
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      {/* Welcome Banner */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Welcome back, {user?.username || 'User'}!
        </Typography>
        <Typography variant="body2">
          You have {stats.totalLeads} total leads. {stats.newLeads} new leads need attention.
        </Typography>
      </Paper>

      {/* Top Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search leads, companies..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        {auth.isAdmin() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddLead}
          >
            Add New Lead
          </Button>
        )}
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
                <Typography variant="h4">{stats.totalLeads}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    Active
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
                <Typography variant="h4">{stats.newLeads}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    Need action
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
              <Typography variant="h4">{stats.contactedLeads}</Typography>
              <Typography variant="caption" color="textSecondary">
                In progress
              </Typography>
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
                <Typography variant="h4">{stats.convertedLeads}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981" variant="body2">
                    Success
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
                View All ({leads.length})
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
                      px: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: lead.status === 'new' ? '#3b82f6' :
                                   lead.status === 'contacted' ? '#f59e0b' :
                                   lead.status === 'converted' ? '#10b981' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {lead.name?.charAt(0)?.toUpperCase() || 'L'}
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
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: lead.status === 'new' ? '#dbeafe' : 
                                   lead.status === 'contacted' ? '#fef3c7' : 
                                   lead.status === 'converted' ? '#d1fae5' : '#f3f4f6',
                          color: lead.status === 'new' ? '#1e40af' : 
                                 lead.status === 'contacted' ? '#92400e' : 
                                 lead.status === 'converted' ? '#065f46' : '#4b5563',
                          fontSize: '0.75rem',
                          fontWeight: 'medium',
                          textTransform: 'capitalize'
                        }}
                      >
                        {lead.status}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" gutterBottom>
                  No leads found.
                </Typography>
                {auth.isAdmin() && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddLead}
                    sx={{ mt: 2 }}
                  >
                    Add Your First Lead
                  </Button>
                )}
              </Box>
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
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Email
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Phone />}
                  onClick={() => navigate('/leads')}
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Call
                </Button>
              </Grid>
              {auth.isAdmin() && (
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    onClick={handleAddLead}
                    sx={{ py: 1.5, justifyContent: 'flex-start' }}
                  >
                    Add Lead
                  </Button>
                </Grid>
              )}
              <Grid item xs={auth.isAdmin() ? 6 : 12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/leads')}
                  sx={{ py: 1.5 }}
                >
                  View All Leads
                </Button>
              </Grid>
            </Grid>

            {/* Recent Activity Summary */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Conversion Rate</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {stats.totalLeads > 0 
                    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) 
                    : 0}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Lost Leads</Typography>
                <Typography variant="body2" fontWeight="medium" color="error">
                  {stats.lostLeads || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
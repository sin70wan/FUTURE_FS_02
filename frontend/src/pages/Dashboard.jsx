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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  Add,
  Email,
  Phone,
  PersonAdd,
  TrendingUp,
  TrendingDown
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
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      {/* Top Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
        <IconButton 
          color="primary" 
          sx={{ bgcolor: 'primary.main', color: 'white' }}
          onClick={() => navigate('/leads')}
        >
          <Add />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Add New Lead
          </Typography>
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Leads
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.totalLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981">
                    +12%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    vs last month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Leads
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.newLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981">
                    +5%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    vs last week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contacted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.contactedLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color="#64748b">
                    0%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    vs last month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Converted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">{stats?.convertedLeads || 0}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: '#10b981', mr: 1 }} />
                  <Typography color="#10b981">
                    +18%
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    vs last month
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Leads</Typography>
              <Typography 
                color="primary" 
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/leads')}
              >
                View All
              </Typography>
            </Box>
            <List>
              {recentLeads.length > 0 ? (
                recentLeads.map((lead, index) => (
                  <React.Fragment key={lead._id || index}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar>{lead.name?.charAt(0) || 'L'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>{lead.name}</strong> - {lead.email}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {lead.company || 'No company'}
                            </Typography>
                            {` — Status: ${lead.status} | Source: ${lead.source}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentLeads.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <Typography color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                  No leads yet. Add your first lead!
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Stats</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Lead Status Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>New</Typography>
                  <Typography fontWeight="bold">{stats?.newLeads || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Contacted</Typography>
                  <Typography fontWeight="bold">{stats?.contactedLeads || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Converted</Typography>
                  <Typography fontWeight="bold">{stats?.convertedLeads || 0}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card 
                  sx={{ textAlign: 'center', p: 2, cursor: 'pointer' }}
                  onClick={() => navigate('/leads')}
                >
                  <Email sx={{ fontSize: 40, color: '#2563eb', mb: 1 }} />
                  <Typography variant="body2">Send Email</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ textAlign: 'center', p: 2, cursor: 'pointer' }}>
                  <Phone sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                  <Typography variant="body2">Make Call</Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
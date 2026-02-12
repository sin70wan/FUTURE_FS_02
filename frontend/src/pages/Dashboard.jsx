import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  ContactMail as ContactIcon,
  CheckCircle as ConvertedIcon,
  Cancel as LostIcon
} from '@mui/icons-material';
import { auth } from '../services/auth';
import { leadService } from '../services/leadService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const userData = auth.getCurrentUser();
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, leadsData] = await Promise.all([
        leadService.getStats(),
        leadService.getAllLeads({ limit: 5 })
      ]);
      setStats(statsData);
      setRecentLeads(leadsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = auth.isAdmin();

  const getStatusColor = (status) => {
    const colors = { new: 'info', contacted: 'warning', converted: 'success', lost: 'error' };
    return colors[status] || 'default';
  };

  const statCards = [
    { label: 'Total Leads', value: stats?.total || 0, icon: <PeopleIcon />, color: '#667eea' },
    { label: 'New Leads', value: stats?.stats?.find(s => s._id === 'new')?.count || 0, icon: <ContactIcon />, color: '#4299e1' },
    { label: 'Contacted', value: stats?.stats?.find(s => s._id === 'contacted')?.count || 0, icon: <TrendingUpIcon />, color: '#ed8936' },
    { label: 'Converted', value: stats?.stats?.find(s => s._id === 'converted')?.count || 0, icon: <ConvertedIcon />, color: '#48bb78' },
    { label: 'Lost', value: stats?.stats?.find(s => s._id === 'lost')?.count || 0, icon: <LostIcon />, color: '#f56565' },
  ];

  return (
    <Box>
      {/* Header with Gradient */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '3px solid white',
                  mr: 3
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Welcome back, {user?.username || 'User'}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={user?.email}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={isAdmin ? <AdminIcon /> : <PersonIcon />}
                    label={isAdmin ? 'Administrator' : 'Team Member'}
                    size="small"
                    sx={{
                      bgcolor: isAdmin ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={fetchDashboardData}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 50c0-22.1 17.9-40 40-40s40 17.9 40 40-17.9 40-40 40-40-17.9-40-40z" fill="%23ffffff" fill-opacity="0.05"/%3E%3C/svg%3E") repeat',
            opacity: 0.1
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: stat.color,
                          width: 56,
                          height: 56,
                          boxShadow: `0 8px 16px ${stat.color}40`
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions & Recent Leads */}
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/leads')}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(145deg, #5a6fd6 0%, #6a4392 100%)',
                      }
                    }}
                  >
                    Add New Lead
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/leads')}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    View All Leads
                  </Button>

                  {isAdmin && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      startIcon={<AdminIcon />}
                      onClick={() => navigate('/admin')}
                      sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
                    >
                      Admin Panel
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Leads */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Leads
                  </Typography>
                  
                  {recentLeads.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        No leads yet. Create your first lead!
                      </Typography>
                    </Box>
                  ) : (
                    recentLeads.map((lead, index) => (
                      <Box
                        key={lead._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 2,
                          borderBottom: index < recentLeads.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {lead.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {lead.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.email}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={lead.status}
                            size="small"
                            color={getStatusColor(lead.status)}
                          />
                          <Button
                            size="small"
                            onClick={() => navigate(`/leads/${lead._id}`)}
                          >
                            View
                          </Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
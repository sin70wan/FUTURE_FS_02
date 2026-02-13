import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, Paper, Typography, Box, Card, CardContent,
    Chip, CircularProgress, Avatar, Button, LinearProgress,
    Divider, Stack, IconButton, Tooltip, Fade
} from '@mui/material';
import {
    People as PeopleIcon,
    ContactPage as ContactIcon,
    CheckCircle as ConvertedIcon,
    Schedule as ContactedIcon,
    Add as AddIcon,
    Visibility as VisibilityIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
    NotificationsActive as NotificationsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../services/api';
import { authService } from '../services/auth';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [recentLeads, setRecentLeads] = useState([]);

    useEffect(() => {
        const userData = authService.getCurrentUserFromToken();
        setUser(userData);
        fetchStats();
        fetchRecentLeads();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/leads/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchRecentLeads = async () => {
        try {
            const response = await api.get('/leads?sortBy=createdAt&sortOrder=desc');
            setRecentLeads(response.data.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch recent leads:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    const statusCounts = stats?.stats?.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {}) || {};

    const total = stats?.total || 0;

    const statCards = [
        {
            title: 'Total Leads',
            value: total,
            icon: <PeopleIcon sx={{ fontSize: 32 }} />,
            color: '#4361ee',
            bgColor: '#eef2ff',
            trend: '+12%'
        },
        {
            title: 'New',
            value: statusCounts.new || 0,
            icon: <ContactIcon sx={{ fontSize: 32 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd',
            percentage: total ? ((statusCounts.new || 0) / total * 100).toFixed(1) : 0
        },
        {
            title: 'Contacted',
            value: statusCounts.contacted || 0,
            icon: <ContactedIcon sx={{ fontSize: 32 }} />,
            color: '#ed6c02',
            bgColor: '#fff3e0',
            percentage: total ? ((statusCounts.contacted || 0) / total * 100).toFixed(1) : 0
        },
        {
            title: 'Converted',
            value: statusCounts.converted || 0,
            icon: <ConvertedIcon sx={{ fontSize: 32 }} />,
            color: '#2e7d32',
            bgColor: '#e8f5e9',
            percentage: total ? ((statusCounts.converted || 0) / total * 100).toFixed(1) : 0
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            new: { bg: '#e3f2fd', color: '#1976d2' },
            contacted: { bg: '#fff3e0', color: '#ed6c02' },
            converted: { bg: '#e8f5e9', color: '#2e7d32' },
            lost: { bg: '#ffebee', color: '#d32f2f' }
        };
        return colors[status] || { bg: '#f5f5f5', color: '#757575' };
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Welcome back, {user?.username || 'User'}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your leads today.
                    </Typography>
                </Box>
                <Box display="flex" gap={2}>
                    <Tooltip title="Add New Lead" arrow>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/leads')}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                                }
                            }}
                        >
                            New Lead
                        </Button>
                    </Tooltip>
                </Box>
            </Box>

            {/* Stats Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: card.bgColor, color: card.color, width: 56, height: 56 }}>
                                        {card.icon}
                                    </Avatar>
                                    <Chip 
                                        label={card.percentage ? `${card.percentage}%` : card.trend}
                                        size="small"
                                        sx={{
                                            bgcolor: card.percentage ? `${card.color}20` : '#e8f5e9',
                                            color: card.percentage ? card.color : '#2e7d32',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>
                                    {card.value}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Recent Leads */}
                <Grid item xs={12} md={8}>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                    <AssignmentIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Recent Leads
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Latest 5 leads added to your CRM
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                endIcon={<VisibilityIcon />}
                                onClick={() => navigate('/leads')}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                View All
                            </Button>
                        </Box>

                        <Stack spacing={2}>
                            {recentLeads.length > 0 ? (
                                recentLeads.map((lead, index) => {
                                    const statusStyle = getStatusColor(lead.status);
                                    return (
                                        <Fade in={true} key={lead._id} style={{ transitionDelay: `${index * 50}ms` }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'background.paper',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: 1
                                                    }
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: statusStyle.bg, color: statusStyle.color }}>
                                                        {lead.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {lead.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {lead.email} • {lead.source || 'website'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Chip
                                                        label={lead.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: statusStyle.bg,
                                                            color: statusStyle.color,
                                                            fontWeight: 600,
                                                            textTransform: 'capitalize'
                                                        }}
                                                    />
                                                    <Tooltip title="View Details" arrow>
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => navigate(`/leads/${lead._id}`)}
                                                            sx={{ 
                                                                bgcolor: 'action.hover',
                                                                '&:hover': { bgcolor: 'action.selected' }
                                                            }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </Fade>
                                    );
                                })
                            ) : (
                                <Box 
                                    sx={{ 
                                        p: 4, 
                                        textAlign: 'center',
                                        bgcolor: 'action.hover',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography color="text.secondary" gutterBottom>
                                        No leads yet
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate('/leads')}
                                        sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                                    >
                                        Add Your First Lead
                                    </Button>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Status Summary & Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        {/* Status Summary Card */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3, 
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Status Summary
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Lead distribution overview
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={2}>
                                {['new', 'contacted', 'converted', 'lost'].map((status) => {
                                    const count = statusCounts[status] || 0;
                                    const percentage = total ? ((count / total) * 100).toFixed(1) : 0;
                                    const statusStyle = getStatusColor(status);
                                    
                                    return (
                                        <Box key={status}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ textTransform: 'capitalize', opacity: 0.9 }}>
                                                    {status}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {count} ({percentage}%)
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={percentage}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: statusStyle.color,
                                                        borderRadius: 4
                                                    }
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Paper>

                        {/* Quick Actions Card */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3, 
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                                    <NotificationsIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Quick Actions
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Commonly used tasks
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/leads')}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5
                                    }}
                                >
                                    Add New Lead
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => navigate('/leads')}
                                    sx={{ 
                                        justifyContent: 'flex-start', 
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5
                                    }}
                                >
                                    View All Leads
                                </Button>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption" color="text.secondary" align="center">
                                    Need help? Contact support
                                </Typography>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
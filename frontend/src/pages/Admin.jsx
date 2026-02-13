import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Grid, Card, CardContent,
    Button, Chip, CircularProgress, Alert, Avatar,
    LinearProgress, Stack, Divider, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip, Zoom, Fade, Badge, Container
} from '@mui/material';
import {
    People as PeopleIcon,
    Security as SecurityIcon,
    Person as PersonIcon,
    SupervisorAccount as SupervisorIcon,
    Assignment as AssignmentIcon,
    BarChart as BarChartIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    AdminPanelSettings as AdminPanelIcon,
    VerifiedUser as VerifiedUserIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Settings as SettingsIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../services/api';
import { authService } from '../services/auth';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[20],
        border: '1px solid rgba(255,255,255,0.3)',
    },
}));

const AdminBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    boxShadow: theme.shadows[4],
}));

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recentUsers, setRecentUsers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = authService.getCurrentUserFromToken();
        setUser(userData);
        
        // Redirect if not admin
        if (userData?.role !== 'admin') {
            navigate('/dashboard');
        } else {
            fetchAdminStats();
        }
    }, [navigate]);

    const fetchAdminStats = async () => {
        try {
            const usersResponse = await api.get('/admin/users');
            const users = usersResponse.data;
            
            const leadsResponse = await api.get('/leads/stats');
            
            setStats({
                totalUsers: users.length,
                adminUsers: users.filter(u => u.role === 'admin').length,
                regularUsers: users.filter(u => u.role === 'user').length,
                leads: leadsResponse.data
            });
            
            // Get 5 most recent users
            setRecentUsers(users.slice(0, 5));
        } catch (error) {
            setError('Failed to fetch admin statistics');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} thickness={4} sx={{ color: 'secondary.main' }} />
                <Typography variant="h6" color="text.secondary">
                    Loading Admin Dashboard...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Fade in={true}>
                    <Alert 
                        severity="error" 
                        sx={{ borderRadius: 3 }}
                        action={
                            <Button color="inherit" size="small" onClick={fetchAdminStats} startIcon={<RefreshIcon />}>
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                </Fade>
            </Container>
        );
    }

    const adminCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <PeopleIcon sx={{ fontSize: 32 }} />,
            color: '#4361ee',
            path: '/admin/users',
            bgColor: 'rgba(67, 97, 238, 0.1)',
            trend: '+12%',
            description: 'All registered users'
        },
        {
            title: 'Administrators',
            value: stats?.adminUsers || 0,
            icon: <SecurityIcon sx={{ fontSize: 32 }} />,
            color: '#dc004e',
            path: '/admin/users',
            bgColor: 'rgba(220, 0, 78, 0.1)',
            trend: '0%',
            description: 'Users with admin access'
        },
        {
            title: 'Regular Users',
            value: stats?.regularUsers || 0,
            icon: <PersonIcon sx={{ fontSize: 32 }} />,
            color: '#2e7d32',
            path: '/admin/users',
            bgColor: 'rgba(46, 125, 50, 0.1)',
            trend: '+8%',
            description: 'Standard users'
        },
        {
            title: 'Total Leads',
            value: stats?.leads?.total || 0,
            icon: <SupervisorIcon sx={{ fontSize: 32 }} />,
            color: '#ed6c02',
            path: '/leads',
            bgColor: 'rgba(237, 108, 2, 0.1)',
            trend: '+5%',
            description: 'All leads in system'
        }
    ];

    const systemStats = [
        { label: 'System Health', value: '98%', color: '#2e7d32', icon: <CheckCircleIcon /> },
        { label: 'Active Sessions', value: '24', color: '#4361ee', icon: <VerifiedUserIcon /> },
        { label: 'Pending Actions', value: '3', color: '#ed6c02', icon: <ScheduleIcon /> },
        { label: 'Warnings', value: '0', color: '#d32f2f', icon: <WarningIcon /> }
    ];

    const quickActions = [
        { label: 'Create Admin User', icon: <AdminPanelIcon />, path: '/admin/users', color: 'secondary' },
        { label: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings', color: 'primary' },
        { label: 'View All Leads', icon: <AssignmentIcon />, path: '/leads', color: 'warning' },
        { label: 'User Reports', icon: <BarChartIcon />, path: '/admin/reports', color: 'success' }
    ];

    return (
        <Box sx={{ 
            flexGrow: 1, 
            bgcolor: '#0a1929',
            minHeight: '100vh',
            p: 4,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px',
                background: 'linear-gradient(135deg, rgba(220,0,78,0.1) 0%, rgba(67,97,238,0.1) 100%)',
                zIndex: 0
            }
        }}>
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Admin Header */}
                <Box sx={{ 
                    mb: 5, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    position: 'relative'
                }}>
                    <Box>
                        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Box sx={{ 
                                        bgcolor: 'success.main', 
                                        width: 16, 
                                        height: 16, 
                                        borderRadius: '50%',
                                        border: '2px solid white'
                                    }} />
                                }
                            >
                                <Avatar 
                                    sx={{ 
                                        width: 64, 
                                        height: 64, 
                                        bgcolor: 'secondary.main',
                                        boxShadow: '0 4px 20px rgba(220,0,78,0.3)'
                                    }}
                                >
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </Avatar>
                            </Badge>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'secondary.light', fontWeight: 600, letterSpacing: 1 }}>
                                    ADMIN ACCESS
                                </Typography>
                                <Typography variant="h3" sx={{ 
                                    fontWeight: 800, 
                                    color: 'white',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                    Administrator Panel
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                                    Welcome back, {user?.username}. You have full system access.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* System Status Badge */}
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 2, 
                            bgcolor: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 3
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={3}>
                            {systemStats.map((stat, index) => (
                                <Box key={index} display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ bgcolor: stat.color, width: 32, height: 32 }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {stat.label}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Box>

                {/* Stats Cards Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {adminCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                <StyledCard sx={{ 
                                    bgcolor: 'rgba(10, 25, 41, 0.8)',
                                    position: 'relative',
                                    overflow: 'visible'
                                }}>
                                    <AdminBadge>
                                        <AdminPanelIcon sx={{ fontSize: 14 }} />
                                        ADMIN
                                    </AdminBadge>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                            <Box>
                                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
                                                    {card.title}
                                                </Typography>
                                                <Typography variant="h2" sx={{ 
                                                    fontWeight: 800, 
                                                    color: 'white',
                                                    mt: 1,
                                                    textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                }}>
                                                    {card.value}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
                                                    {card.description}
                                                </Typography>
                                            </Box>
                                            <Avatar sx={{ 
                                                bgcolor: card.color,
                                                width: 56,
                                                height: 56,
                                                boxShadow: `0 4px 20px ${card.color}80`
                                            }}>
                                                {card.icon}
                                            </Avatar>
                                        </Box>
                                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Chip 
                                                label={card.trend}
                                                size="small"
                                                sx={{
                                                    bgcolor: card.trend.startsWith('+') ? 'rgba(46, 125, 50, 0.2)' : 'rgba(211, 47, 47, 0.2)',
                                                    color: card.trend.startsWith('+') ? '#4caf50' : '#f44336',
                                                    fontWeight: 600,
                                                    border: '1px solid',
                                                    borderColor: card.trend.startsWith('+') ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'
                                                }}
                                            />
                                            <Button 
                                                size="small"
                                                onClick={() => navigate(card.path)}
                                                sx={{ 
                                                    color: 'white',
                                                    textTransform: 'none',
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                                }}
                                                endIcon={<ArrowForwardIcon />}
                                            >
                                                Manage
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Actions Bar */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3, 
                        mb: 4,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                            <VerifiedUserIcon sx={{ color: 'secondary.main' }} />
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Administrative Quick Actions
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    color={action.color}
                                    startIcon={action.icon}
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2
                                        }
                                    }}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Paper>

                {/* Main Content Grid */}
                <Grid container spacing={3}>
                    {/* User Management Section */}
                    <Grid item xs={12} md={7}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3, 
                                borderRadius: 3,
                                bgcolor: 'rgba(10, 25, 41, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                height: '100%'
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                                        <PeopleIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            User Management Console
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            Create, edit, and manage user permissions
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button 
                                    variant="contained" 
                                    color="secondary"
                                    onClick={() => navigate('/admin/users')}
                                    startIcon={<AddIcon />}
                                    sx={{ 
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        px: 3,
                                        boxShadow: '0 4px 20px rgba(220,0,78,0.3)',
                                        '&:hover': { boxShadow: '0 6px 25px rgba(220,0,78,0.4)' }
                                    }}
                                >
                                    Create User
                                </Button>
                            </Box>

                            {/* Users Table */}
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>User</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Role</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentUsers.map((recentUser, index) => (
                                            <TableRow 
                                                key={recentUser._id}
                                                sx={{
                                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 32, 
                                                                height: 32,
                                                                bgcolor: recentUser.role === 'admin' ? 'secondary.main' : 'primary.main'
                                                            }}
                                                        >
                                                            {recentUser.username.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography sx={{ color: 'white' }}>
                                                            {recentUser.username}
                                                        </Typography>
                                                        {recentUser._id === user?.userId && (
                                                            <Chip 
                                                                label="YOU" 
                                                                size="small" 
                                                                sx={{ 
                                                                    bgcolor: 'info.main',
                                                                    color: 'white',
                                                                    height: 20,
                                                                    fontSize: '10px'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {recentUser.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={recentUser.role.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: recentUser.role === 'admin' ? 'rgba(220,0,78,0.2)' : 'rgba(67,97,238,0.2)',
                                                            color: recentUser.role === 'admin' ? '#ff4081' : '#5c9eff',
                                                            fontWeight: 600,
                                                            border: '1px solid',
                                                            borderColor: recentUser.role === 'admin' ? 'rgba(220,0,78,0.3)' : 'rgba(67,97,238,0.3)'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Box sx={{ 
                                                            width: 8, 
                                                            height: 8, 
                                                            borderRadius: '50%', 
                                                            bgcolor: 'success.main',
                                                            boxShadow: '0 0 10px #4caf50'
                                                        }} />
                                                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                            Active
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit User" arrow>
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => navigate('/admin/users')}
                                                            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                                        >
                                                            <SettingsIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Button 
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/admin/users')}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                    mt: 3, 
                                    textTransform: 'none',
                                    borderRadius: 3,
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                View All Users
                            </Button>
                        </Paper>
                    </Grid>

                    {/* System Overview Section */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            {/* Lead Statistics Card */}
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(10, 25, 41, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                                    <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                                        <BarChartIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            Lead Analytics
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            System-wide lead distribution
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    {['new', 'contacted', 'converted', 'lost'].map((status) => {
                                        const count = stats?.leads?.stats?.find(s => s._id === status)?.count || 0;
                                        const total = stats?.leads?.total || 1;
                                        const percentage = ((count / total) * 100).toFixed(1);
                                        const colors = {
                                            new: { bg: 'rgba(25, 118, 210, 0.2)', color: '#90caf9', label: 'New' },
                                            contacted: { bg: 'rgba(237, 108, 2, 0.2)', color: '#ffb74d', label: 'Contacted' },
                                            converted: { bg: 'rgba(46, 125, 50, 0.2)', color: '#81c784', label: 'Converted' },
                                            lost: { bg: 'rgba(211, 47, 47, 0.2)', color: '#ef5350', label: 'Lost' }
                                        };
                                        
                                        return (
                                            <Grid item xs={6} key={status}>
                                                <Box sx={{ 
                                                    p: 2, 
                                                    bgcolor: colors[status].bg,
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: colors[status].color + '40'
                                                }}>
                                                    <Typography variant="body2" sx={{ color: colors[status].color, fontWeight: 600 }}>
                                                        {colors[status].label}
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mt: 1 }}>
                                                        {count}
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={parseFloat(percentage)}
                                                        sx={{
                                                            mt: 1,
                                                            height: 4,
                                                            borderRadius: 2,
                                                            bgcolor: 'rgba(255,255,255,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: colors[status].color,
                                                                borderRadius: 2
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, display: 'block' }}>
                                                        {percentage}% of total
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                            Total System Leads
                                        </Typography>
                                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                                            {stats?.leads?.total || 0}
                                        </Typography>
                                    </Box>
                                    <Button 
                                        variant="contained"
                                        color="warning"
                                        onClick={() => navigate('/leads')}
                                        sx={{ 
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            px: 3,
                                            boxShadow: '0 4px 20px rgba(237,108,2,0.3)'
                                        }}
                                    >
                                        Manage Leads
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Admin Resources Card */}
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <AdminPanelIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            Administrator Resources
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                                            • Full system access and configuration<br />
                                            • User management and role assignment<br />
                                            • System monitoring and analytics<br />
                                            • Security and compliance settings
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Admin;
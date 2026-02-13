import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Drawer,
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Menu, MenuItem, Avatar, Badge, Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { authService } from '../services/auth'; // CHANGE THIS - from '../utils/auth' to '../services/auth'

const drawerWidth = 240;

const Layout = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userData = authService.getCurrentUserFromToken();
        if (userData) {
            setUser(userData);
            setIsAdmin(userData.role === 'admin');
        }
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false);
        handleMenuClose();
    };

    const handleLogout = () => {
        authService.logout();
    };

    // Menu items - ALL users can see these
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Leads', icon: <PeopleIcon />, path: '/leads' },
    ];

    // Admin only menu items - only visible to admins
    const adminMenuItems = [
        { text: 'Admin Dashboard', icon: <AdminIcon />, path: '/admin' },
        { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/users' },
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
                    Mini CRM
                </Typography>
            </Toolbar>
            <Divider />
            
            {/* Regular Menu - Everyone sees */}
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text} 
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            
            {/* Admin Menu - Only for admins */}
            {isAdmin && (
                <>
                    <Divider />
                    <List>
                        {adminMenuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.text} 
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    backgroundColor: 'secondary.light',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'secondary.main' }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: isAdmin ? 'secondary.main' : 'primary.main'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        {isAdmin ? 'Administrator Panel' : 'CRM Dashboard'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ ml: 1 }}
                        >
                            <Avatar sx={{ 
                                width: 35, 
                                height: 35, 
                                bgcolor: isAdmin ? 'error.main' : 'primary.dark'
                            }}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem disabled>
                                <Typography variant="caption">
                                    Signed in as: {user?.username || 'User'}
                                </Typography>
                            </MenuItem>
                            <MenuItem disabled>
                                <Chip 
                                    label={user?.role || 'user'} 
                                    size="small"
                                    color={isAdmin ? 'secondary' : 'primary'}
                                />
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
                
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
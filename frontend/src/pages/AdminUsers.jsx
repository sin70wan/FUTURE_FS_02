import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, Avatar, Alert, Snackbar, CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../services/api';
import { authService } from '../services/auth';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            showSnackbar('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const user = authService.getCurrentUserFromToken();
        setCurrentUser(user);
        fetchUsers();
    }, [fetchUsers]); // Now includes fetchUsers in dependency array

    const handleCreateUser = async () => {
        try {
            await api.post('/auth/register', formData);
            fetchUsers();
            handleCloseDialog();
            showSnackbar('User created successfully', 'success');
        } catch (error) {
            showSnackbar(error.response?.data?.error || 'Failed to create user', 'error');
        }
    };

    const handleUpdateUser = async () => {
        try {
            await api.put(`/admin/users/${selectedUser._id}`, {
                username: formData.username,
                email: formData.email,
                role: formData.role
            });
            fetchUsers();
            handleCloseDialog();
            showSnackbar('User updated successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                fetchUsers();
                showSnackbar('User deleted successfully', 'success');
            } catch (error) {
                showSnackbar('Failed to delete user', 'error');
            }
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setSelectedUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setFormData({ username: '', email: '', password: '', role: 'user' });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    User Management
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Create New User
                </Button>
            </Box>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                mr: 1,
                                                bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main'
                                            }}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </Avatar>
                                            {user.username}
                                            {user._id === currentUser?.userId && (
                                                <Chip 
                                                    label="You" 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                    color="info"
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role}
                                            color={user.role === 'admin' ? 'secondary' : 'primary'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleOpenDialog(user)}
                                            disabled={user._id === currentUser?.userId}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteUser(user._id)}
                                            disabled={user._id === currentUser?.userId || user.role === 'admin'}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Create New User'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        margin="normal"
                        required
                    />
                    {!selectedUser && (
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            margin="normal"
                            required
                            helperText="Minimum 6 characters"
                        />
                    )}
                    <TextField
                        fullWidth
                        select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        margin="normal"
                        SelectProps={{ native: true }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={selectedUser ? handleUpdateUser : handleCreateUser}
                        variant="contained"
                        color="secondary"
                    >
                        {selectedUser ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminUsers;
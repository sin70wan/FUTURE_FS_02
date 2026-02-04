import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
    Typography,
    Alert
} from '@mui/material';

const LeadForm = ({ open, onClose, onSubmit, initialData, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        status: 'New',
        location: ''
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                company: initialData.company || '',
                source: initialData.source || 'Website',
                status: initialData.status || 'New',
                location: initialData.location || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                source: 'Website',
                status: 'New',
                location: ''
            });
        }
        setErrors({});
    }, [initialData, open]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {mode === 'edit' ? 'Edit Lead' : 'Add New Lead'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        name="name"
                        label="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                    />
                    
                    <TextField
                        name="email"
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                    />
                    
                    <TextField
                        name="phone"
                        label="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    
                    <TextField
                        name="company"
                        label="Company"
                        value={formData.company}
                        onChange={handleChange}
                        fullWidth
                    />
                    
                    <TextField
                        name="location"
                        label="Location"
                        value={formData.location}
                        onChange={handleChange}
                        fullWidth
                    />
                    
                    <TextField
                        select
                        name="source"
                        label="Source"
                        value={formData.source}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="Website">Website</MenuItem>
                        <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                        <MenuItem value="Referral">Referral</MenuItem>
                        <MenuItem value="Email Campaign">Email Campaign</MenuItem>
                        <MenuItem value="Social">Social</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    
                    <TextField
                        select
                        name="status"
                        label="Status"
                        value={formData.status}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Contacted">Contacted</MenuItem>
                        <MenuItem value="Converted">Converted</MenuItem>
                        <MenuItem value="Lost">Lost</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {mode === 'edit' ? 'Update' : 'Create'} Lead
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LeadForm;
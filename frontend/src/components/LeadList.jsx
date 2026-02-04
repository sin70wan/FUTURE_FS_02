import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Edit,
    Delete,
    Email,
    Phone,
    Person
} from '@mui/icons-material';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusColors = {
    'New': { bg: '#dbeafe', text: '#1e40af' },
    'Contacted': { bg: '#fef3c7', text: '#92400e' },
    'Converted': { bg: '#d1fae5', text: '#065f46' },
    'Lost': { bg: '#fee2e2', text: '#991b1b' }
};

const sourceIcons = {
    'Website': '🌐',
    'LinkedIn': '💼',
    'Referral': '👥',
    'Email Campaign': '📧',
    'Social': '📱',
    'Other': '📊'
};

const LeadList = ({ 
    leads, 
    loading, 
    error, 
    onEdit, 
    onDelete, 
    onView,
    filters = {},
    searchTerm = ''
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading leads: {error}
            </Alert>
        );
    }

    const filteredLeads = leads.filter(lead => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            lead.name?.toLowerCase().includes(term) ||
            lead.email?.toLowerCase().includes(term) ||
            lead.company?.toLowerCase().includes(term)
        );
    });

    const displayedLeads = filteredLeads.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Source</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Last Contact</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedLeads.map((lead) => (
                            <TableRow 
                                key={lead._id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onView && onView(lead)}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                bgcolor: '#3b82f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {lead.name?.charAt(0) || <Person />}
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {lead.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {lead.company}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                
                                <TableCell>
                                    <Typography>{lead.email}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {lead.phone}
                                    </Typography>
                                </TableCell>
                                
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6">
                                            {sourceIcons[lead.source] || '📊'}
                                        </Typography>
                                        <Typography>{lead.source}</Typography>
                                    </Box>
                                </TableCell>
                                
                                <TableCell>
                                    <Chip
                                        label={lead.status}
                                        size="small"
                                        sx={{
                                            bgcolor: statusColors[lead.status]?.bg,
                                            color: statusColors[lead.status]?.text,
                                            fontWeight: 'medium'
                                        }}
                                    />
                                </TableCell>
                                
                                <TableCell>
                                    <Typography>
                                        {new Date(lead.lastContact).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton 
                                            size="small"
                                            onClick={() => window.location.href = `mailto:${lead.email}`}
                                        >
                                            <Email fontSize="small" />
                                        </IconButton>
                                        {onEdit && (
                                            <IconButton 
                                                size="small"
                                                onClick={() => onEdit(lead)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton 
                                                size="small"
                                                onClick={() => onDelete(lead)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLeads.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default LeadList;
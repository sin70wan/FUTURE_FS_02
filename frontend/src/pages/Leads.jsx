import React, { useState, useEffect } from 'react';
import {
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import LeadList from '../components/LeadList';
import LeadForm from '../components/LeadForm';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getLeads();
      setLeads(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leads');
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await leadAPI.deleteLead(selectedLead._id);
      setLeads(leads.filter(lead => lead._id !== selectedLead._id));
      toast.success('Lead deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedLead(null);
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'create') {
        const response = await leadAPI.createLead(formData);
        setLeads([response.data, ...leads]);
        toast.success('Lead created successfully');
      } else {
        const response = await leadAPI.updateLead(selectedLead._id, formData);
        setLeads(leads.map(lead => 
          lead._id === selectedLead._id ? response.data : lead
        ));
        toast.success('Lead updated successfully');
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleViewLead = (lead) => {
    navigate(`/leads/${lead._id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredLeads = leads.filter(lead => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!lead.name?.toLowerCase().includes(term) && 
          !lead.email?.toLowerCase().includes(term) && 
          !lead.company?.toLowerCase().includes(term)) {
        return false;
      }
    }
    
    if (statusFilter !== 'All' && lead.status !== statusFilter) {
      return false;
    }
    
    if (sourceFilter !== 'All' && lead.source !== sourceFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <Layout title="Leads">
      {/* Top Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Manage your incoming leads and track their conversion status
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleAddLead}
          >
            Add New Lead
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search name, email..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </TextField>
          
          <TextField
            select
            label="Source"
            size="small"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Email Campaign">Email Campaign</MenuItem>
            <MenuItem value="Social">Social</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            onClick={() => {
              setStatusFilter('All');
              setSourceFilter('All');
              setSearchTerm('');
            }}
          >
            Clear filters
          </Button>
        </Box>
      </Paper>

      {/* Leads List */}
      {error ? (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <LeadList
            leads={filteredLeads}
            loading={loading}
            onEdit={handleEditLead}
            onDelete={handleDeleteClick}
            onView={handleViewLead}
            searchTerm={searchTerm}
            filters={{ status: statusFilter, source: sourceFilter }}
          />
          
          {/* Pagination */}
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
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedLead?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Lead Form */}
      <LeadForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedLead}
        mode={formMode}
      />
    </Layout>
  );
};

export default Leads;
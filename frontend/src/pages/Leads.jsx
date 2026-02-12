import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import LeadList from '../components/LeadList';
import LeadForm from '../components/LeadForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { leadService } from '../services/leadService';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setOpenForm(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setOpenForm(true);
  };

  const handleDeleteClick = (lead) => {
    setSelectedLead(lead);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await leadService.deleteLead(selectedLead._id || selectedLead.id);
      setLeads(prev => prev.filter(lead => 
        (lead._id || lead.id) !== (selectedLead._id || selectedLead.id)
      ));
      setOpenDelete(false);
      setSelectedLead(null);
    } catch (err) {
      setError('Failed to delete lead');
    }
  };

  const handleFormSubmit = async (leadData) => {
    try {
      if (selectedLead) {
        const updatedLead = await leadService.updateLead(
          selectedLead._id || selectedLead.id, 
          leadData
        );
        setLeads(prev => prev.map(lead => 
          (lead._id || lead.id) === (selectedLead._id || selectedLead.id) 
            ? updatedLead 
            : lead
        ));
      } else {
        const newLead = await leadService.createLead(leadData);
        setLeads(prev => [newLead, ...prev]);
      }
      setOpenForm(false);
      setSelectedLead(null);
    } catch (err) {
      throw err;
    }
  };

  if (loading && leads.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Lead Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLead}>
          Add New Lead
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <LeadList 
        leads={leads}
        loading={loading}
        onEdit={handleEditLead}
        onDelete={handleDeleteClick}
        onRefresh={fetchLeads}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <DialogContent>
          <LeadForm
            lead={selectedLead}
            onSubmit={handleFormSubmit}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${selectedLead?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setOpenDelete(false);
          setSelectedLead(null);
        }}
      />
    </Box>
  );
};

export default Leads;
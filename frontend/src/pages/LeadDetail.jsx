import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getLead(id);
      setLead(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lead details');
      toast.error('Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteContent) => {
    try {
      const response = await leadAPI.addNote(id, { content: noteContent });
      setLead(response.data);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const handleUpdateLead = async (updatedData) => {
    try {
      const response = await leadAPI.updateLead(id, updatedData);
      setLead(response.data);
      toast.success('Lead updated successfully');
    } catch (err) {
      toast.error('Failed to update lead');
    }
  };

  const handleConvert = async () => {
    try {
      await leadAPI.updateLead(id, { status: 'Converted' });
      fetchLead();
      toast.success('Lead converted to customer!');
    } catch (err) {
      toast.error('Failed to convert lead');
    }
  };

  if (loading) {
    return (
      <Layout title="Lead Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Lead Details">
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/leads')}
          sx={{ mt: 2 }}
        >
          Back to Leads
        </Button>
      </Layout>
    );
  }

  return (
    <Layout title={lead.name}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/leads')}
        sx={{ mb: 3 }}
      >
        Back to Leads
      </Button>

      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" gutterBottom>
          {lead.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {lead.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Status: {lead.status}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Add Note</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '80px'
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (newNote.trim()) {
                  handleAddNote(newNote);
                }
              }}
              sx={{ height: 'fit-content' }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default LeadDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { leadService } from '../services/leadService';
import ConfirmDialog from '../components/ConfirmDialog';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeadById(id);
      setLead(data);
    } catch (err) {
      setError('Failed to fetch lead details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const updatedLead = await leadService.addNote(id, { content: newNote });
      setLead(updatedLead);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    try {
      await leadService.deleteLead(id);
      navigate('/leads');
    } catch (err) {
      setError('Failed to delete lead');
    }
  };

  const getStatusColor = (status) => {
    const colors = { new: 'primary', contacted: 'warning', converted: 'success', lost: 'error' };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Lead not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/leads')} sx={{ mt: 2 }}>
          Back to Leads
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/leads')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Lead Details</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
              {lead.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{lead.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" />
                <Chip label={lead.source} variant="outlined" size="small" />
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/leads/edit/${lead._id || lead.id}`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDelete(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email</Typography>
            <Typography variant="body1">{lead.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Phone</Typography>
            <Typography variant="body1">{lead.phone || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Created</Typography>
            <Typography variant="body2">{new Date(lead.createdAt).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Updated</Typography>
            <Typography variant="body2">{new Date(lead.updatedAt).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Assigned To</Typography>
            <Typography variant="body2">{lead.assignedTo?.username || 'Unassigned'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Notes</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={addingNote}
          />
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!newNote.trim() || addingNote}
            sx={{ alignSelf: 'flex-end' }}
          >
            {addingNote ? <CircularProgress size={24} /> : 'Add Note'}
          </Button>
        </Box>

        {lead.notes?.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No notes yet
          </Typography>
        ) : (
          lead.notes?.map((note, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">{note.createdBy?.username || 'User'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(note.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                {note.content}
              </Typography>
              {index < lead.notes.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))
        )}
      </Paper>

      <ConfirmDialog
        open={openDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </Box>
  );
};

export default LeadDetail;
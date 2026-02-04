import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  Divider,
  Grid,
  Paper,
  IconButton,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Business,
  AccessTime,
  CheckCircle,
  Add,
  Delete
} from '@mui/icons-material';

const LeadDetails = ({ lead, onUpdate, onAddNote, onDeleteNote, onConvert }) => {
  const [newNote, setNewNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...lead });

  const statusColors = {
    'New': { bg: '#dbeafe', text: '#1e40af' },
    'Contacted': { bg: '#fef3c7', text: '#92400e' },
    'Converted': { bg: '#d1fae5', text: '#065f46' },
    'Lost': { bg: '#fee2e2', text: '#991b1b' }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate({ ...lead, status: newStatus });
  };

  const handleSaveEdit = () => {
    onUpdate(editData);
    setEditing(false);
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: '#3b82f6', fontSize: 24, fontWeight: 'bold' }}>
                {lead.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">{lead.name}</Typography>
                <Typography variant="body1" color="text.secondary">{lead.company}</Typography>
                <Chip
                  label={lead.status}
                  sx={{
                    mt: 1,
                    bgcolor: statusColors[lead.status]?.bg,
                    color: statusColors[lead.status]?.text,
                    fontWeight: 'medium'
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant="contained"
                color={lead.status === 'Converted' ? 'success' : 'primary'}
                onClick={onConvert}
                disabled={lead.status === 'Converted'}
              >
                {lead.status === 'Converted' ? 'Converted' : 'Convert'}
              </Button>
            </Box>
          </Box>

          {/* Rest of your component content */}
          <Typography>Email: {lead.email}</Typography>
          <Typography>Phone: {lead.phone || 'Not provided'}</Typography>
          <Typography>Source: {lead.source}</Typography>
          
          {/* Add more content as needed */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LeadDetails;
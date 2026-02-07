import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const LeadDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/leads')}
        sx={{ mb: 3 }}
      >
        ← Back to Leads
      </Button>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Lead Details - ID: {id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Email: lead{id}@example.com
        </Typography>
        <Typography variant="body1" gutterBottom>
          Status: Active
        </Typography>
        <Typography variant="body1" gutterBottom>
          Phone: +1 (555) 123-4567
        </Typography>
        <Typography variant="body1" gutterBottom>
          Company: Example Corp
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" sx={{ mr: 2 }}>
            Edit Lead
          </Button>
          <Button variant="outlined">
            Add Note
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LeadDetail;
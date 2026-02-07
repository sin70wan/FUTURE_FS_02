import React from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const navigate = useNavigate();

  // Check auth
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  const mockLeads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Converted' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Leads Management</Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>All Leads</Typography>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{lead.name}</td>
                <td style={{ padding: '12px' }}>{lead.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    background: lead.status === 'New' ? '#e3f2fd' : 
                               lead.status === 'Contacted' ? '#fff3e0' : '#e8f5e9',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

export default Leads;
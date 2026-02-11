import React, { useState, useEffect } from 'react';
import { auth } from '../services/auth';
import api from '../services/api';
import LeadForm from './LeadForm';
import LeadDetails from './LeadDetails';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Get user from localStorage
  const user = auth.getCurrentUser();
  const isAdmin = auth.isAdmin();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setShowForm(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) {
      alert('Only admins can change status');
      return;
    }
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedLead) {
        await api.put(`/leads/${selectedLead._id}`, formData);
      } else {
        await api.post('/leads', formData);
      }
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return '#007bff';
      case 'contacted': return '#ffc107';
      case 'converted': return '#28a745';
      case 'lost': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={styles.loading}>Loading leads...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Leads Management</h1>
        <div style={styles.userInfo}>
          <span style={styles.role}>
            Logged in as: <strong>{user?.username}</strong> ({user?.role})
          </span>
          {isAdmin && (
            <button onClick={handleAddLead} style={styles.addButton}>
              + Add New Lead
            </button>
          )}
          <button onClick={auth.logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>No leads found</td>
              </tr>
            ) : (
              leads.map(lead => (
                <tr key={lead._id}>
                  <td style={styles.td}>{lead.name}</td>
                  <td style={styles.td}>{lead.email}</td>
                  <td style={styles.td}>{lead.phone || '-'}</td>
                  <td style={styles.td}>{lead.source}</td>
                  <td style={styles.td}>
                    {isAdmin ? (
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        style={{
                          ...styles.statusSelect,
                          backgroundColor: getStatusColor(lead.status),
                          color: 'white'
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    ) : (
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(lead.status)
                      }}>
                        {lead.status}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleViewDetails(lead)}
                      style={styles.viewButton}
                    >
                      View
                    </button>
                    
                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => handleEditLead(lead)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead._id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <LeadForm 
              lead={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showDetails && selectedLead && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <LeadDetails 
              lead={selectedLead}
              onClose={() => {
                setShowDetails(false);
                setSelectedLead(null);
              }}
              onUpdate={fetchLeads}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  role: { padding: '5px 10px', backgroundColor: '#e9ecef', borderRadius: '4px' },
  addButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  logoutButton: { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tableContainer: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' },
  td: { padding: '12px', borderBottom: '1px solid #dee2e6' },
  statusSelect: { padding: '5px 10px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' },
  statusBadge: { padding: '5px 10px', borderRadius: '4px', color: 'white', display: 'inline-block' },
  viewButton: { padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' },
  loading: { textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' },
  noData: { textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }
};

export default LeadList;
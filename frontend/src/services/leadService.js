import api from './api';

// Helper function to normalize lead data (convert _id to id or vice versa)
const normalizeLead = (lead) => {
    if (!lead) return lead;
    return {
        ...lead,
        id: lead._id || lead.id,  // Ensure we have both id formats
        _id: lead._id || lead.id
    };
};

const normalizeLeads = (leads) => {
    return Array.isArray(leads) ? leads.map(normalizeLead) : [];
};

export const leadService = {
    getAllLeads: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });
            const response = await api.get(`/leads?${params}`);
            return normalizeLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
            throw error;
        }
    },

    getLeadById: async (id) => {
        try {
            const response = await api.get(`/leads/${id}`);
            return normalizeLead(response.data);
        } catch (error) {
            console.error('Error fetching lead:', error);
            throw error;
        }
    },

    createLead: async (leadData) => {
        try {
            const response = await api.post('/leads', leadData);
            return normalizeLead(response.data);
        } catch (error) {
            console.error('Error creating lead:', error);
            throw error;
        }
    },

    updateLead: async (id, leadData) => {
        try {
            const response = await api.put(`/leads/${id}`, leadData);
            return normalizeLead(response.data);
        } catch (error) {
            console.error('Error updating lead:', error);
            throw error;
        }
    },

    deleteLead: async (id) => {
        try {
            const response = await api.delete(`/leads/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting lead:', error);
            throw error;
        }
    },

    addNote: async (id, note) => {
        try {
            const response = await api.post(`/leads/${id}/notes`, note);
            return normalizeLead(response.data);
        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    },

    getStats: async () => {
        try {
            const response = await api.get('/leads/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};
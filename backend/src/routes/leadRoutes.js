const express = require('express');
const router = express.Router();
const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    getDashboardStats
} = require('../controllers/leadController');

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Lead routes
router.route('/')
    .get(getLeads)
    .post(createLead);

router.route('/:id')
    .get(getLeadById)
    .put(updateLead)
    .delete(deleteLead);

// Note routes
router.post('/:id/notes', addNote);

module.exports = router;
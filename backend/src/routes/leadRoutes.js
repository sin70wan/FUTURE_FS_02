const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { auth } = require('../middleware/auth');  // Make sure this import is correct

// @desc    Get all leads
// @route   GET /api/leads
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        
        // If not admin, only show assigned leads
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }
        
        const leads = await Lead.find(query)
            .populate('assignedTo', 'username email')
            .sort('-createdAt');
            
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Get single lead
// @route   GET /api/leads/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('notes.createdBy', 'username');
            
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        // Check if user has access
        if (req.user.role !== 'admin' && lead.assignedTo?._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Create lead
// @route   POST /api/leads
router.post('/', auth, async (req, res) => {
    try {
        const lead = new Lead({
            ...req.body,
            assignedTo: req.user._id  // Auto-assign to current user
        });
        
        await lead.save();
        
        const populatedLead = await Lead.findById(lead._id)
            .populate('assignedTo', 'username email');
            
        res.status(201).json(populatedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Update lead
// @route   PUT /api/leads/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        // Check if user has access
        if (req.user.role !== 'admin' && lead.assignedTo?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const updates = Object.keys(req.body);
        updates.forEach(update => lead[update] = req.body[update]);
        
        await lead.save();
        
        const populatedLead = await Lead.findById(lead._id)
            .populate('assignedTo', 'username email');
            
        res.json(populatedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
router.post('/:id/notes', auth, async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Note content is required' });
        }
        
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        // Check if user has access
        if (req.user.role !== 'admin' && lead.assignedTo?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        lead.notes.push({
            content,
            createdBy: req.user._id
        });
        
        await lead.save();
        
        const populatedLead = await Lead.findById(lead._id)
            .populate('assignedTo', 'username email')
            .populate('notes.createdBy', 'username');
            
        res.json(populatedLead);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Delete lead (admin only)
// @route   DELETE /api/leads/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        // Only admins can delete
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const lead = await Lead.findByIdAndDelete(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        res.json({ message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Get lead statistics
// @route   GET /api/leads/stats
router.get('/stats', auth, async (req, res) => {
    try {
        let query = {};
        
        // If not admin, only show their leads
        if (req.user.role !== 'admin') {
            query.assignedTo = req.user._id;
        }
        
        const stats = await Lead.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const total = await Lead.countDocuments(query);
        
        res.json({ stats, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
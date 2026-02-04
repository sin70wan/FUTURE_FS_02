const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    try {
        const { status, source, search } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status && status !== 'All') {
            query.status = status;
        }
        
        // Filter by source
        if (source && source !== 'All') {
            query.source = source;
        }
        
        // Search by name, email, or company
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        const leads = await Lead.find(query).sort('-createdAt');
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    try {
        const lead = new Lead({
            ...req.body,
            notes: [{
                content: 'Lead created',
                type: 'created',
                createdBy: req.user ? req.user.name : 'System' // Use logged in user
            }]
        });
        
        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        // Track status change for notes
        if (req.body.status && req.body.status !== lead.status) {
            const statusNote = {
                content: `Status changed from ${lead.status} to ${req.body.status}`,
                type: 'status',
                createdBy: req.user ? req.user.name : 'System' // Use logged in user
            };
            req.body.notes = [...(lead.notes || []), statusNote];
        }
        
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        res.json(updatedLead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addNote = async (req, res) => {
    try {
        const { content, type = 'note' } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Note content is required' });
        }
        
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        const note = {
            content,
            type,
            createdBy: req.user ? req.user.name : 'System', // Use logged in user
            createdAt: new Date()
        };
        
        lead.notes.unshift(note);
        lead.lastContact = new Date();
        
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/leads/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ status: 'New' });
        const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
        const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
        
        // Get lead sources distribution
        const sourceStats = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        // Get recent leads
        const recentLeads = await Lead.find()
            .sort('-createdAt')
            .limit(5)
            .select('name email status source createdAt');
        
        res.json({
            stats: {
                totalLeads,
                newLeads,
                contactedLeads,
                convertedLeads
            },
            sourceStats,
            recentLeads
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    getDashboardStats
};
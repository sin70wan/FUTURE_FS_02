const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const { isAdmin } = require('../middleware/auth'); ← REMOVE THIS LINE
const Lead = require('../models/Lead');

// Apply auth to all routes
router.use(auth);

// GET all leads - Both admin and regular users can view
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'username email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single lead - Both can view
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('notes.createdBy', 'username');
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create lead - Admin only
router.post('/', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  try {
    const lead = new Lead({
      ...req.body,
      assignedTo: req.user.id
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update lead - Admin only
router.put('/:id', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE lead - Admin only
router.delete('/:id', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add note - Both admin and regular users
router.post('/:id/notes', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    lead.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
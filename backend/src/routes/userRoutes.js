const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');  // ✅ FIXED: Import both

// @desc    Get all users (admin only)
// @route   GET /api/users
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Create user (admin only)
// @route   POST /api/users
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ 
            username, 
            email, 
            password, 
            role: role || 'user',
            isActive: true 
        });
        
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { username, email, role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
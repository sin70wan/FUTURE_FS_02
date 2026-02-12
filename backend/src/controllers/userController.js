const User = require('../models/User');
const Lead = require('../models/Lead');

// @desc    Get all users (admin only)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get single user (admin only)
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create user (admin only)
// @route   POST /api/users
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, profile } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({
            username,
            email,
            password,
            role: role || 'user',
            profile
        });

        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const { username, email, role, isActive, profile } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        if (profile) user.profile = { ...user.profile, ...profile };

        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Reassign leads to admin or delete them
        await Lead.updateMany(
            { assignedTo: user._id },
            { assignedTo: req.user._id } // Reassign to admin
        );

        await user.deleteOne();
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get user stats (admin only)
// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        
        const stats = await Promise.all(users.map(async (user) => {
            const leads = await Lead.find({ assignedTo: user._id });
            const byStatus = {
                new: leads.filter(l => l.status === 'new').length,
                contacted: leads.filter(l => l.status === 'contacted').length,
                converted: leads.filter(l => l.status === 'converted').length,
                lost: leads.filter(l => l.status === 'lost').length
            };
            
            return {
                userId: user._id,
                username: user.username,
                email: user.email,
                totalLeads: leads.length,
                byStatus,
                conversionRate: leads.length > 0 
                    ? ((byStatus.converted / leads.length) * 100).toFixed(1)
                    : 0,
                lastActive: user.lastLogin,
                isActive: user.isActive
            };
        }));
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Reset user password (admin only)
// @route   POST /api/users/:id/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
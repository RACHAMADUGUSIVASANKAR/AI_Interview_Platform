const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -resetToken -resetTokenExpiry');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/user/profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, address, education, skills, projects, experience } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, address, education, skills, projects, experience },
            { new: true, runValidators: true }
        ).select('-password -resetToken -resetTokenExpiry');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// ─── @route  GET /api/admin/users ────────────────────────────────────────────
// @desc   Get all users with their statistics (excluding passwords)
// @access Private/Admin
router.get('/users', [auth, admin], asyncHandler(async (req, res) => {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

    res.json({ success: true, data: users });
}));

// ─── @route  GET /api/admin/stats ────────────────────────────────────────────
// @desc   Get platform-wide aggregate statistics
// @access Private/Admin
router.get('/stats', [auth, admin], asyncHandler(async (req, res) => {
    const statsResult = await User.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                totalXP: { $sum: '$xp' },
                totalLearningTime: { $sum: '$learningTime' },
            }
        }
    ]);

    const result = statsResult[0] || { totalUsers: 0, totalXP: 0, totalLearningTime: 0 };

    res.json({
        success: true,
        data: {
            totalUsers: result.totalUsers,
            totalXP: result.totalXP,
            totalLearningTime: result.totalLearningTime,
        }
    });
}));

// ─── @route  PATCH /api/admin/users/:userId/role ─────────────────────────────
// @desc   Update a user's role (Promote to Admin / Demote to User)
// @access Private/Admin
router.patch('/users/:userId/role', [auth, admin], asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: updatedUser });
}));

module.exports = router;

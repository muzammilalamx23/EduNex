const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc Get all users
 */
exports.getAllUsers = async (req, res) => {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

    return ApiResponse.success(res, 'Users retrieved.', users);
};

/**
 * @desc Get platform stats
 */
exports.getStats = async (req, res) => {
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

    return ApiResponse.success(res, 'Stats retrieved.', {
        totalUsers: result.totalUsers,
        totalXP: result.totalXP,
        totalLearningTime: result.totalLearningTime,
    });
};

/**
 * @desc Update user role
 */
exports.updateUserRole = async (req, res) => {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return ApiResponse.error(res, 'Invalid role specified.', 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return ApiResponse.error(res, 'User not found.', 404);

    return ApiResponse.success(res, 'User role updated.', updatedUser);
};

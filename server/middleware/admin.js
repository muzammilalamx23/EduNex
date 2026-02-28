const User = require('../models/User');

/**
 * admin middleware
 * Must be used AFTER auth middleware.
 * Checks that the authenticated user has role === 'admin'.
 * Performance: Requires role to be embedded in JWT payload.
 */
module.exports = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
};

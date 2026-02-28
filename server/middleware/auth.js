const jwt = require('jsonwebtoken');

/**
 * auth middleware
 * Verifies the JWT in the x-auth-token header.
 * Attaches req.user = { id } on success.
 * Forwards a proper error to the centralized error handler on failure.
 */
module.exports = function (req, res, next) {
    // Check HttpOnly cookies first, fallback to headers
    const token = (req.cookies && req.cookies.token) || req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided. Authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        // Differentiate expired vs. malformed tokens for clear client messages
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token. Authorization denied.' });
    }
};

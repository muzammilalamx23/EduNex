/**
 * Centralized Error Handler Middleware
 * 
 * This is the LAST middleware registered in index.js.
 * It catches errors forwarded by asyncHandler (next(err)) or thrown
 * in synchronous code, and always returns a consistent JSON response.
 *
 * Response shape: { success: false, message: string }
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    // ALWAYS log the error to console in production/development
    // Render captures console.error so this is vital for debugging
    console.error(`[${req.method}] ${req.url} →`, err.stack || err);

    // Mongoose bad ObjectId (e.g., invalid :id param)
    if (err.name === 'CastError') {
        return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    // Mongoose duplicate key (e.g., duplicate email on register)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use.`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join('. ') });
    }

    // Default: 500 Internal Server Error
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'An internal server error occurred.'
            : (err.message || 'An internal server error occurred.')
    });
};


module.exports = errorHandler;

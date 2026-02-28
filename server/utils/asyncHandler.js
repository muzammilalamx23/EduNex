/**
 * asyncHandler - Wraps async route handlers to automatically catch
 * rejected promises and forward them to the Express error middleware.
 * Eliminates the need for try/catch blocks in every single route.
 *
 * @param {Function} fn - An async Express route handler
 * @returns {Function} - A wrapped function that catches errors
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

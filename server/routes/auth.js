const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/authController');
const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

// ─── Brute Force Limiter ──────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many authentication attempts. Please try again in a minute.' },
});

// ─── Middleware: Validation Runner ───────────────────────────────────────────
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse.error(res, errors.array()[0].msg, 400);
    }
    next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/user', auth, asyncHandler(authController.getUser));

router.put('/profile', auth, [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty.'),
    body('linkedin').optional().trim(),
    body('github').optional().trim(),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], validate, asyncHandler(authController.updateProfile));

router.post('/register', authLimiter, [
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], validate, asyncHandler(authController.register));

router.post('/login', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
], validate, asyncHandler(authController.login));

router.post('/logout', authController.logout);

router.post('/enroll', auth, [
    body('courseId').notEmpty().withMessage('courseId is required.'),
], validate, asyncHandler(authController.enroll));

router.post('/lesson-complete', auth, [
    body('courseId').notEmpty().withMessage('courseId is required.'),
    body('lessonId').notEmpty().withMessage('lessonId is required.'),
], validate, asyncHandler(authController.lessonComplete));

router.get('/progress/:courseId', auth, asyncHandler(authController.getProgress));

router.post('/save-position', auth, [
    body('courseId').notEmpty().withMessage('courseId is required.'),
    body('lessonId').notEmpty().withMessage('lessonId is required.'),
], validate, asyncHandler(authController.savePosition));

router.post('/add-xp', auth, [
    body('activity').notEmpty().withMessage('activity key is required.'),
], validate, asyncHandler(authController.addXp));

router.post('/update-time', auth, [
    body('minutes').isNumeric().withMessage('minutes must be a number.'),
], validate, asyncHandler(authController.updateTime));

module.exports = router;

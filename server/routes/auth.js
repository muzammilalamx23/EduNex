const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// ─── Brute Force Limiter ──────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10, // Max 10 attempts per IP
    message: { success: false, message: 'Too many authentication attempts. Please try again in a minute.' },
});

// ─── Token Issuer Helper ──────────────────────────────────────────────────────
const generateTokenAndSetCookie = (res, user) => {
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set HTTPOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// ─── Helper: format validation errors ────────────────────────────────────────
const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, message: errors.array()[0].msg });
        return false;
    }
    return true;
};

// ─── @route  GET /api/auth/user ───────────────────────────────────────────────
// @desc   Get the current authenticated user
// @access Private
router.get('/user', auth, asyncHandler(async (req, res) => {
    // ── Streak & Daily Reset Logic ────────────────────────────────────────────
    const userDoc = await User.findById(req.user.id).select('-password -__v');
    if (!userDoc) {
        res.status(404);
        throw new Error('User not found.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (userDoc.lastActiveDate) {
        const lastActive = new Date(userDoc.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            userDoc.streak = 0;
            userDoc.dailyLearningTime = 0;
        } else if (diffDays === 1) {
            userDoc.dailyLearningTime = 0;
        }
    }

    userDoc.lastActiveDate = today;
    await userDoc.save();

    res.json({ success: true, data: userDoc });
}));

// ─── @route  PUT /api/auth/profile ────────────────────────────────────────────
router.put('/profile', auth, [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty.'),
    body('linkedin').optional().trim(),
    body('github').optional().trim(),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { fullName, linkedin, github, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    if (fullName) user.fullName = fullName;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;

    if (password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
            fullName: user.fullName,
            email: user.email,
            linkedin: user.linkedin,
            github: user.github,
        }
    });
}));

// ─── @route  POST /api/auth/lesson-complete ───────────────────────────────────
router.post('/lesson-complete', auth, [
    body('courseId').notEmpty().withMessage('courseId is required.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { courseId, xpGain = 100 } = req.body;
    const user = await User.findById(req.user.id);

    const course = user.enrolledCourses.find(
        (c) => c.courseId.toString() === courseId.toString()
    );
    if (!course) {
        res.status(404);
        throw new Error('Course not found in your enrollments.');
    }

    if (course.progress < 100) {
        course.progress = Math.min(course.progress + 10, 100);
        user.xp += xpGain;

        if (course.progress === 100) {
            user.coursesCompleted += 1;
        }
    }

    await user.save();
    res.json({
        success: true,
        message: 'Lesson completed.',
        data: {
            xp: user.xp,
            progress: course.progress,
            coursesCompleted: user.coursesCompleted,
        }
    });
}));

// ─── @route  POST /api/auth/update-time ──────────────────────────────────────
router.post('/update-time', auth, [
    body('minutes').isNumeric().withMessage('minutes must be a number.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { minutes } = req.body;
    const user = await User.findById(req.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    user.learningTime += minutes;
    user.dailyLearningTime += minutes;

    const STREAK_THRESHOLD = 30; // minutes required per day

    if (user.dailyLearningTime >= STREAK_THRESHOLD) {
        const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;

        if (!lastUpdate || lastUpdate < today) {
            if (lastUpdate) {
                const diffDays = Math.round((today - lastUpdate) / (1000 * 60 * 60 * 24));
                user.streak = diffDays === 1 ? user.streak + 1 : 1;
            } else {
                user.streak = 1;
            }
            user.lastStreakUpdate = today;
        }
    }

    await user.save();
    res.json({
        success: true,
        data: {
            learningTime: user.learningTime,
            dailyLearningTime: user.dailyLearningTime,
            streak: user.streak,
            streakMet: user.dailyLearningTime >= STREAK_THRESHOLD,
        }
    });
}));

// ─── @route  POST /api/auth/enroll ───────────────────────────────────────────
router.post('/enroll', auth, [
    body('courseId').notEmpty().withMessage('courseId is required.'),
    body('title').notEmpty().withMessage('Course title is required.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { courseId, title, thumbnail } = req.body;
    const user = await User.findById(req.user.id);

    const alreadyEnrolled = user.enrolledCourses.some(
        (c) => c.courseId.toString() === courseId.toString()
    );
    if (alreadyEnrolled) {
        res.status(400);
        throw new Error('You are already enrolled in this course.');
    }

    user.enrolledCourses.push({ courseId, title, thumbnail: thumbnail || '', progress: 0 });
    await user.save();

    res.json({
        success: true,
        message: 'Successfully enrolled.',
        data: user.enrolledCourses,
    });
}));

// ─── @route  POST /api/auth/register ─────────────────────────────────────────
router.post('/register', authLimiter, [
    body('fullName').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('An account with that email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ fullName, email, password: hashedPassword });

    generateTokenAndSetCookie(res, user);

    res.status(201).json({ success: true, message: 'Account created.' });
}));

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
router.post('/login', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(400);
        throw new Error('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials.');
    }

    generateTokenAndSetCookie(res, user);

    res.json({ success: true, message: 'Login successful.' });
}));

// ─── @route  POST /api/auth/logout ───────────────────────────────────────────
// @desc   Clear HttpOnly cookie to logout
// @access Public
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0) // Expire immediately
    });
    res.json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;

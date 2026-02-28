const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../utils/asyncHandler');

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────

/**
 * @route   GET /api/courses
 * @desc    Get all courses (Public: only published, Admin: all)
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = {};
    filter.status = 'published';

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    // Performance Add: Use Mongo Text Indexing instead of Regex collection scanning
    if (search) {
        filter.$text = { $search: search };
    }

    // Security Add: Cap limits and offsets to prevent Query DoS 
    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 1000); // Cap skip depth
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100); // Cap result size
    const skip = (pageNum - 1) * limitNum;

    // Use specific ranking if searching
    const projection = search ? { score: { $meta: "textScore" } } : {};
    const sortParams = search ? { score: { $meta: "textScore" } } : { createdAt: -1 };

    const courses = await Course.find(filter, projection)
        .sort(sortParams)
        .limit(limitNum)
        .skip(skip)
        .populate('createdBy', 'fullName')
        .lean();

    const count = await Course.countDocuments(filter);

    res.json({
        success: true,
        data: courses,
        pagination: {
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: Number(page)
        }
    });
}));

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('createdBy', 'fullName')
        .lean();

    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }
    res.json({ success: true, data: course });
}));


// ─── ADMIN ROUTES ───────────────────────────────────────────────────────────

/**
 * @route   GET /api/courses/admin/all
 * @desc    Get all courses (draft + published) for admin dashboard
 * @access  Private/Admin
 */
router.get('/admin/all', [auth, admin], asyncHandler(async (req, res) => {
    const courses = await Course.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'fullName')
        .lean();
    res.json({ success: true, data: courses });
}));


/**
 * @route   POST /api/courses
 * @desc    Create a new course (default status: draft)
 * @access  Private/Admin
 */
router.post('/', [auth, admin], [
    body('title').trim().notEmpty().withMessage('Course title is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('lessons').isArray({ min: 1 }).withMessage('At least one lesson is required.')
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0].msg);
    }

    const courseData = {
        ...req.body,
        createdBy: req.user.id,
        status: 'draft' // Default
    };

    const course = await Course.create(courseData);
    res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
}));

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private/Admin
 */
router.put('/:id', [auth, admin], asyncHandler(async (req, res) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, message: 'Course updated.', data: course });
}));

/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Toggle course publish status
 * @access  Private/Admin
 */
router.patch('/:id/publish', [auth, admin], asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }

    const newStatus = course.status === 'published' ? 'draft' : 'published';
    course.status = newStatus;
    await course.save();

    res.json({ success: true, message: `Course ${newStatus} successfully.`, status: newStatus });
}));

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private/Admin
 */
router.delete('/:id', [auth, admin], asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }

    await course.deleteOne();
    res.json({ success: true, message: 'Course removed.' });
}));

module.exports = router;


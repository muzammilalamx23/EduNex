const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../utils/asyncHandler');
const { extractYouTubeId, isValidYouTubeUrl } = require('../utils/youtube');

// ─── Local constants ──────────────────────────────────────────────────────────
// Hardcoded here (not via Course.schema.statics) for load-time safety.
// MUST stay in sync with Course.js COURSE_CATEGORIES.
const VALID_CATEGORIES = [
    'Development', 'Design', 'Business', 'Data Science',
    'Marketing', 'IT & Software', 'Personal Development', 'Other'
];

// ─── Utility: add totalDuration to .lean() results ───────────────────────────
// .lean() strips Mongoose virtuals. This helper re-adds totalDuration so that
// all API responses consistently include the computed field.
const withTotalDuration = (course) => ({
    ...course,
    totalDuration: (course.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0)
});

// ─── Utility: normalize tags ──────────────────────────────────────────────────
// Trims, lowercases, removes empty strings, and deduplicates.
const normalizeTags = (tags) =>
    [...new Set(
        (Array.isArray(tags) ? tags : [])
            .map(t => String(t).trim().toLowerCase())
            .filter(Boolean)
    )];

// ─── Reusable validator helper ────────────────────────────────────────────────
// Enhanced version: lesson-specific errors include the 1-indexed lesson number.
const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array()[0];
        let message = err.msg;
        // Humanize lesson[N] paths → "Lesson 3: ..."
        const lessonMatch = (err.path || '').match(/lessons\[(\d+)\]/);
        if (lessonMatch) {
            message = `Lesson ${parseInt(lessonMatch[1], 10) + 1}: ${err.msg}`;
        }
        res.status(400);
        throw new Error(message);
    }
    return true;
};

// ─── Utility: inject videoId into every lesson ────────────────────────────────────
// Processes the lessons array from the request body:
// - Extracts videoId from videoUrl using the YouTube parser
// - Strips any client-sent videoId (server is the sole source)
// - Preserves all other whitelisted lesson fields
const processLessons = (lessons) =>
    (lessons || []).map(({ title, videoUrl, content, pdfUrl, duration, order }) => ({
        title,
        videoUrl: videoUrl || '',
        videoId: videoUrl ? (extractYouTubeId(videoUrl) || '') : '',
        content: content || '',
        pdfUrl: pdfUrl || '',
        duration: typeof duration === 'number' ? duration : 0,
        order: typeof order === 'number' ? order : 0,
    }));

// ─── Shared lesson field validators ──────────────────────────────────────────
// Reused by both POST and PUT to keep validation DRY.
const lessonValidators = [
    body('lessons').isArray({ min: 1, max: 50 }).withMessage('Lessons must be an array of 1–50 items.'),
    // Guard: each element must be a plain object, not a string/null/number.
    // Without this, non-objects cause a Mongoose CastError (500) instead of a clean 400.
    body('lessons.*').isObject().withMessage('Each lesson must be an object with at least a title field.'),
    body('lessons.*.title')
        .trim().notEmpty().withMessage('Each lesson must have a title.')
        .isLength({ max: 200 }).withMessage('Lesson title cannot exceed 200 characters.'),
    body('lessons.*.videoUrl')
        .optional({ checkFalsy: true })
        .custom((url) => {
            // Only YouTube URLs are accepted. Rejects all other hosts including
            // direct MP4 links, Vimeo, Dailymotion, raw embed URLs, etc.
            if (url && !isValidYouTubeUrl(url)) {
                throw new Error(
                    'Video URL must be a valid YouTube link (youtube.com/watch?v=..., youtu.be/..., or youtube.com/embed/...)'
                );
            }
            return true;
        }),
    body('lessons.*.pdfUrl')
        .optional({ checkFalsy: true })
        .isURL({ protocols: ['http', 'https', 'ftp'] })
        .withMessage('Lesson PDF URL must be a valid URL.'),
    body('lessons.*.content')
        .optional()
        .isLength({ max: 20000 })
        .withMessage('Lesson content cannot exceed 20,000 characters.'),
    body('lessons.*.duration')
        .optional()
        .isFloat({ min: 0, max: 600 })
        .withMessage('Lesson duration must be a number between 0 and 600 minutes.'),
];

// ─── Public course field validators ──────────────────────────────────────────
const courseFieldValidators = [
    body('title')
        .isString().withMessage('Title must be a string.')
        .trim().notEmpty().withMessage('Course title is required.')
        .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),
    body('description')
        .isString().withMessage('Description must be a string.')
        .trim().notEmpty().withMessage('Description is required.')
        .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters.'),
    body('category')
        .optional()
        .isIn(VALID_CATEGORIES)
        .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`),
    body('difficulty')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Difficulty must be Beginner, Intermediate, or Advanced.'),
    body('thumbnail')
        .optional({ checkFalsy: true })
        .isURL({ protocols: ['http', 'https'] })
        .withMessage('Thumbnail must be a valid http/https URL.'),
    body('tags')
        .optional()
        .isArray({ max: 20 })
        .withMessage('Tags must be an array of up to 20 items.'),
    body('tags.*')
        .optional({ checkFalsy: true })  // skip empty strings and null
        .isString().trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tag must be a non-empty string under 50 characters.'),
];


// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

/**
 * @route   GET /api/courses
 * @desc    Get all published courses with search, filter, and pagination
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.$text = { $search: search };

    // Security: cap pagination depth to prevent query DoS
    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 1000);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const projection = search ? { score: { $meta: 'textScore' } } : {};
    const sortParams = search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    // Run find + countDocuments in parallel for efficiency
    const [courses, count] = await Promise.all([
        Course.find(filter, projection)
            .sort(sortParams)
            .limit(limitNum)
            .skip(skip)
            .populate('createdBy', 'fullName')
            .lean(),
        Course.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(count / limitNum) || 1;
    res.json({
        success: true,
        data: courses.map(withTotalDuration),
        pagination: {
            total: count,
            pages: totalPages,
            currentPage: Math.min(pageNum, totalPages),
            limit: limitNum
        }
    });
}));


// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────
// ⚠️  IMPORTANT: All specific admin sub-paths MUST be registered BEFORE /:id.
//     If /:id comes first, Express matches 'admin' as a course ID → CastError.

/**
 * @route   GET /api/courses/admin/all
 * @desc    Get all courses (draft + published) for admin panel — paginated
 * @access  Private/Admin
 */
router.get('/admin/all', [auth, admin], asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;

    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 1000);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (status && ['draft', 'published'].includes(status)) filter.status = status;

    const [courses, count] = await Promise.all([
        Course.find(filter)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)
            .populate('createdBy', 'fullName')
            .lean(),
        Course.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(count / limitNum) || 1;
    res.json({
        success: true,
        data: courses.map(withTotalDuration),
        pagination: {
            total: count,
            pages: totalPages,
            currentPage: Math.min(pageNum, totalPages),
            limit: limitNum
        }
    });
}));

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course by ID
 * @access  Public
 * ⚠️  Registered AFTER all specific paths to avoid catching them as IDs.
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('createdBy', 'fullName')
        .lean();

    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }
    res.json({ success: true, data: withTotalDuration(course) });
}));


/**
 * @route   POST /api/courses
 * @desc    Create a new course (default status: draft)
 * @access  Private/Admin
 */
router.post('/', [auth, admin], [
    ...courseFieldValidators,
    ...lessonValidators,
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    // ── Strict Whitelist ──────────────────────────────────────────────────────
    // We destructure ONLY the fields we allow. Any extra fields the client
    // sends (rating, status, createdBy, __proto__, etc.) are silently dropped.
    const { title, description, category, difficulty, thumbnail, lessons, tags } = req.body;

    const courseData = {
        title,
        description,
        category:   category   || 'Development',
        difficulty: difficulty || 'Beginner',
        lessons:    processLessons(lessons), // strips client-sent videoId, injects server-computed one
        tags: normalizeTags(tags),
        createdBy: req.user.id,
        status: 'draft',
    };
    if (thumbnail) courseData.thumbnail = thumbnail;

    const course = await Course.create(courseData);
    res.status(201).json({
        success: true,
        message: 'Course created successfully.',
        data: withTotalDuration(course.toObject())
    });
}));


/**
 * @route   PUT /api/courses/:id
 * @desc    Update course — whitelisted fields only (prevents mass-assignment)
 * @access  Private/Admin
 */
router.put('/:id', [auth, admin], [
    body('title')
        .optional().trim().notEmpty().withMessage('Title cannot be empty.')
        .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),
    body('description')
        .optional().trim().notEmpty().withMessage('Description cannot be empty.')
        .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters.'),
    body('category')
        .optional().isIn(VALID_CATEGORIES)
        .withMessage('Invalid category.'),
    body('difficulty')
        .optional().isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Invalid difficulty.'),
    body('thumbnail')
        .optional({ checkFalsy: true })
        .isURL({ protocols: ['http', 'https'] }).withMessage('Thumbnail must be a valid URL.'),
    body('tags').optional().isArray().withMessage('Tags must be an array.'),
    body('lessons.*.title')
        .optional().trim().notEmpty().withMessage('Lesson title cannot be empty.'),
    body('lessons.*.videoUrl')
        .optional({ checkFalsy: true }).isURL().withMessage('Video URL must be valid.'),
    body('lessons.*.content')
        .optional().isLength({ max: 20000 }).withMessage('Lesson content too long.'),
    body('lessons.*.duration')
        .optional().isFloat({ min: 0 }).withMessage('Duration must be a positive number.'),
], asyncHandler(async (req, res) => {
    if (!validate(req, res)) return;

    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }

    // Explicitly pick only the fields admins are allowed to update.
    // status → use the /publish endpoint. createdBy, _id, rating → locked permanently.
    const { title, description, category, difficulty, thumbnail, lessons, tags } = req.body;
    const allowedUpdates = {};
    if (title       !== undefined) allowedUpdates.title       = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (category    !== undefined) allowedUpdates.category    = category;
    if (difficulty  !== undefined) allowedUpdates.difficulty  = difficulty;
    if (thumbnail   !== undefined) allowedUpdates.thumbnail   = thumbnail;
    if (lessons !== undefined) allowedUpdates.lessons = processLessons(lessons);
    if (tags        !== undefined) allowedUpdates.tags        = normalizeTags(tags);

    const updated = await Course.findByIdAndUpdate(req.params.id, allowedUpdates, {
        new: true,
        runValidators: true
    });

    res.json({ success: true, message: 'Course updated.', data: withTotalDuration(updated.toObject()) });
}));


/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Toggle course between draft ↔ published
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

    res.json({
        success: true,
        message: `Course ${newStatus} successfully.`,
        status: newStatus
    });
}));


/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course and cascade-remove it from all user enrollment records.
 *          Without the cascade, deleted courses leave dangling courseId references
 *          in every enrolled user's enrolledCourses array — crashing CoursePlayer.
 * @access  Private/Admin
 */
router.delete('/:id', [auth, admin], asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found.');
    }

    const courseId = course._id;

    // Step 1: Delete the course document
    await course.deleteOne();

    // Step 2: Remove all enrollment records for this course from every user.
    // $pull removes all elements in the array that match the filter condition.
    const updateResult = await User.updateMany(
        { 'enrolledCourses.courseId': courseId },
        { $pull: { enrolledCourses: { courseId: courseId } } }
    );

    res.json({
        success: true,
        message: 'Course deleted successfully.',
        affectedUsers: updateResult.modifiedCount // useful for admin audit log
    });
}));


module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../utils/asyncHandler');
const courseController = require('../controllers/courseController');
const { VALID_CATEGORIES } = require('../utils/courseHelpers');
const { isValidYouTubeUrl } = require('../utils/youtube');
const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/ApiResponse');

// ─── Middleware: Validation Runner ───────────────────────────────────────────
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array()[0];
        let message = err.msg;
        const lessonMatch = (err.path || '').match(/lessons\[(\d+)\]/);
        if (lessonMatch) {
            message = `Lesson ${parseInt(lessonMatch[1], 10) + 1}: ${err.msg}`;
        }
        return ApiResponse.error(res, message, 400);
    }
    next();
};

// ─── Validators ──────────────────────────────────────────────────────────────
const lessonValidators = [
    body('lessons').isArray({ min: 1, max: 100 }).withMessage('Lessons must be an array of 1–100 items.'),
    body('lessons.*.title').trim().notEmpty().withMessage('Lesson title is required.'),
    body('lessons.*.type').optional().isIn(['video', 'reading', 'heading']).withMessage('Invalid lesson type.'),
    body('lessons.*.videoUrl').optional({ checkFalsy: true }).custom(url => {
        if (url && !isValidYouTubeUrl(url)) throw new Error('Invalid YouTube link.');
        return true;
    }),
];

const courseValidators = [
    body('title').trim().notEmpty().withMessage('Course title is required.').isLength({ max: 150 }),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('category').optional().isIn(VALID_CATEGORIES).withMessage('Invalid category.'),
    body('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get('/', asyncHandler(courseController.getAllCourses));
router.get('/admin/all', [auth, admin], asyncHandler(courseController.getAdminCourses));
router.get('/:id', asyncHandler(courseController.getCourse));

router.post('/', [auth, admin, ...courseValidators, ...lessonValidators], validate, asyncHandler(courseController.createCourse));

router.put('/:id', [auth, admin], validate, asyncHandler(courseController.updateCourse));

router.patch('/:id/publish', [auth, admin], asyncHandler(courseController.togglePublish));

router.delete('/:id', [auth, admin], asyncHandler(courseController.deleteCourse));

module.exports = router;

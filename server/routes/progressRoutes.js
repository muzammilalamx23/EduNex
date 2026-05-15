const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Strict rate limit for XP endpoints to prevent farming
const xpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Max 10 lesson completions per minute
    message: { success: false, message: 'Slow down! Too many requests to XP systems.' }
});

router.use(authMiddleware);

router.post('/complete-lesson', xpLimiter, progressController.markLessonComplete);
router.get('/', progressController.getUserProgress);

module.exports = router;

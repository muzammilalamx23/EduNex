const express = require('express');
const router = express.Router();
const playgroundController = require('../controllers/playgroundController');
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiter specifically for playground execution to prevent abuse/infinite loops
const playgroundLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, // limit each IP to 15 requests per windowMs
    message: { success: false, message: 'Too many executions requested. Please wait a minute.' }
});

router.use(auth); // All playground endpoints require authentication

router.post('/execute', playgroundLimiter, playgroundController.executeCode);
router.post('/submit', submissionController.submitCode);
router.get('/job/:jobId', playgroundController.getJobStatus);

module.exports = router;

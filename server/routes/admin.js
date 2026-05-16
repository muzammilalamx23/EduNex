const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../utils/asyncHandler');
const adminController = require('../controllers/adminController');
const submissionController = require('../controllers/submissionController');

router.get('/users', [auth, admin], asyncHandler(adminController.getAllUsers));
router.get('/stats', [auth, admin], asyncHandler(adminController.getStats));
router.patch('/users/:userId/role', [auth, admin], asyncHandler(adminController.updateUserRole));

// Code Review Moderation Routes
router.get('/submissions', [auth, admin], submissionController.getPendingSubmissions);
router.post('/submissions/:id/review', [auth, admin], submissionController.reviewSubmission);

module.exports = router;

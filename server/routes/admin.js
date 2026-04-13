const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncHandler = require('../utils/asyncHandler');
const adminController = require('../controllers/adminController');

router.get('/users', [auth, admin], asyncHandler(adminController.getAllUsers));
router.get('/stats', [auth, admin], asyncHandler(adminController.getStats));
router.patch('/users/:userId/role', [auth, admin], asyncHandler(adminController.updateUserRole));

module.exports = router;

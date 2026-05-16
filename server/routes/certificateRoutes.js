const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const auth = require('../middleware/auth');

router.post('/generate/:courseId', auth, certificateController.generateCertificate);
router.get('/verify/:certId', certificateController.verifyCertificate);

module.exports = router;

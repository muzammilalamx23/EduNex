const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// We use POST to send large context (history + code), but response is text/event-stream
router.route('/chat')
    .post(auth, aiController.streamAIChat);

module.exports = router;

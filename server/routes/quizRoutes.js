const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Assuming this exists or we can just use auth + role check

// We need an admin middleware, let's create a quick check if missing, but usually it's `auth, admin`
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

router.route('/')
    .post(auth, checkAdmin, quizController.createQuiz);

router.route('/:lessonId')
    .get(auth, quizController.getQuizByLesson);

router.route('/:lessonId/submit')
    .post(auth, quizController.submitQuiz);

module.exports = router;

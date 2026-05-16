const Quiz = require('../models/Quiz');
const assessmentService = require('../services/assessmentService');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

// @desc    Get quiz for a specific lesson
// @route   GET /api/quizzes/:lessonId
// @access  Private (Enrolled students)
exports.getQuizByLesson = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        
        // Find the quiz
        const quiz = await Quiz.findOne({ lessonId });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found for this lesson' });
        }

        // Return public profile (answers hidden)
        res.status(200).json({
            success: true,
            data: quiz.getPublicProfile()
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit quiz answers for evaluation
// @route   POST /api/quizzes/:lessonId/submit
// @access  Private (Enrolled students)
exports.submitQuiz = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const { answers } = req.body; // Array of numbers corresponding to selected option indices

        const quiz = await Quiz.findOne({ lessonId });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // Evaluate using service
        const results = await assessmentService.evaluateSubmission(req.user.id, quiz._id, answers);

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (err) {
        if (err.message === 'Invalid submission format or missing answers') {
            return res.status(400).json({ success: false, message: err.message });
        }
        next(err);
    }
};

// @desc    Create a new quiz (Admin only)
// @route   POST /api/quizzes
// @access  Private/Admin
exports.createQuiz = async (req, res, next) => {
    try {
        const { courseId, lessonId, title, questions, passingScore, xpReward } = req.body;
        
        const quiz = await Quiz.create({
            courseId,
            lessonId,
            title,
            questions,
            passingScore,
            xpReward
        });

        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (err) {
        next(err);
    }
};

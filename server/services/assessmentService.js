const Quiz = require('../models/Quiz');
const progressService = require('./progressService');
const User = require('../models/User');

class AssessmentService {
    /**
     * Evaluates a quiz submission and awards XP if passed
     * @param {string} userId - ID of the user
     * @param {string} quizId - ID of the quiz
     * @param {Array<number>} answers - Array of selected option indices
     * @returns {Object} Result object containing score, passing status, and explanations
     */
    async evaluateSubmission(userId, quizId, answers) {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
            throw new Error('Invalid submission format or missing answers');
        }

        let correctCount = 0;
        const results = quiz.questions.map((q, index) => {
            const isCorrect = answers[index] === q.correctAnswerIndex;
            if (isCorrect) correctCount++;
            
            return {
                questionId: q._id,
                isCorrect,
                correctAnswerIndex: q.correctAnswerIndex,
                explanation: q.explanation
            };
        });

        const scorePercentage = (correctCount / quiz.questions.length) * 100;
        const passed = scorePercentage >= quiz.passingScore;

        let xpAwarded = 0;
        if (passed) {
            try {
                // By marking the lesson complete, ProgressService handles XP, streaks, and duplication
                const progressResult = await progressService.markLessonComplete(userId, quiz.courseId, quiz.lessonId);
                xpAwarded = progressResult.xpEarned;
            } catch (err) {
                console.error('Failed to award XP for quiz:', err.message);
                // If it throws (e.g., already completed), xpAwarded remains 0
            }
        }

        return {
            passed,
            score: scorePercentage,
            correctCount,
            totalQuestions: quiz.questions.length,
            xpAwarded,
            results
        };
    }
}

module.exports = new AssessmentService();

const CodeSubmission = require('../models/CodeSubmission');

// @desc    Submit code for manual review
// @route   POST /api/playground/submit
// @access  Private
exports.submitCode = async (req, res, next) => {
    try {
        const { code, language, lessonId, lessonTitle } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: 'Code is required for submission.' });
        }

        const submission = await CodeSubmission.create({
            user: req.user.id,
            lessonId: lessonId || null,
            lessonTitle: lessonTitle || 'Playground Submission',
            code,
            language: language || 'javascript',
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Code submitted for review successfully.',
            data: submission
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all pending submissions for admin review
// @route   GET /api/admin/submissions
// @access  Private (Admin)
exports.getPendingSubmissions = async (req, res, next) => {
    try {
        const submissions = await CodeSubmission.find({ status: 'pending' })
            .populate('user', 'fullName email')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Review a submission (Approve/Needs Work with feedback)
// @route   POST /api/admin/submissions/:id/review
// @access  Private (Admin)
exports.reviewSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, reviewFeedback } = req.body;

        if (!['approved', 'needs_work', 'reviewed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        const submission = await CodeSubmission.findById(id);
        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found.' });
        }

        submission.status = status;
        submission.reviewFeedback = reviewFeedback || null;
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = new Date();

        await submission.save();

        // Dispatch a real-time notification
        const io = req.app.get('io');
        const notificationService = require('../services/notificationService');
        await notificationService.dispatch(io, submission.user.toString(), {
            type: 'review',
            title: 'Code Review Completed',
            message: `Your submission for ${submission.lessonTitle} has been reviewed by an instructor.`,
            actionUrl: `/dashboard`
        });

        res.status(200).json({
            success: true,
            message: 'Submission reviewed successfully.',
            data: submission
        });
    } catch (err) {
        next(err);
    }
};

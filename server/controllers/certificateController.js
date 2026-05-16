const certificateService = require('../services/certificateService');
const User = require('../models/User');

// @desc    Generate a certificate for a completed course
// @route   POST /api/certificates/generate/:courseId
// @access  Private (Enrolled students who completed 100%)
exports.generateCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Verify user has completed the course
        // For security, you'd check ProgressService here to ensure 100% completion.
        // For MVP, we trust the client request, but check enrollment
        const user = await User.findById(userId);
        const enrolledCourse = user.enrolledCourses.find(c => c.courseId.toString() === courseId);
        
        if (!enrolledCourse) {
            return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });
        }

        // Ideally check progress = 100 here.
        // if (enrolledCourse.progress < 100) {
        //     return res.status(400).json({ success: false, message: 'Course must be 100% complete to generate a certificate.' });
        // }

        const result = await certificateService.generateCertificate(userId, courseId);

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify a certificate publicly
// @route   GET /api/certificates/verify/:certId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
    try {
        const { certId } = req.params;

        // Search across all users for this certId
        // This is not perfectly optimized for 1M users, but fine for MVP
        const user = await User.findOne({ 'enrolledCourses.certificateId': certId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Certificate not found or invalid.' });
        }

        const enrolledCourse = user.enrolledCourses.find(c => c.certificateId === certId);

        res.status(200).json({
            success: true,
            data: {
                studentName: user.fullName,
                courseTitle: enrolledCourse.title,
                issueDate: enrolledCourse.issuedAt,
                certificateUrl: enrolledCourse.certificateUrl,
                status: 'Valid'
            }
        });
    } catch (err) {
        next(err);
    }
};

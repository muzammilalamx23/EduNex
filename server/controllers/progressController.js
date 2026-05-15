const progressService = require('../services/progressService');

exports.markLessonComplete = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.body;
        const userId = req.user.id;

        const result = await progressService.markLessonComplete(userId, courseId, lessonId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        next(error);
    }
};

exports.getUserProgress = async (req, res, next) => {
    try {
        const progress = await progressService.getUserProgress(req.user.id);
        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

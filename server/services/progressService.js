const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

class ProgressService {
    async markLessonComplete(userId, courseId, lessonId) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError('Course not found', 404);
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            throw new AppError('Lesson not found', 404);
        }

        // Find or create progress
        let progress = await UserProgress.findOne({ userId });
        if (!progress) {
            progress = new UserProgress({ userId });
        }

        // Check if already completed (Anti-XP Farming)
        const alreadyCompleted = progress.completedLessons.some(
            cl => cl.lessonId.toString() === lessonId.toString()
        );

        if (alreadyCompleted) {
            throw new AppError('Lesson already completed. XP already awarded.', 400);
        }

        const xpEarned = lesson.xpReward || 10;
        progress.totalXp += xpEarned;
        progress.completedLessons.push({ lessonId, courseId });

        this._updateStreak(progress);

        await progress.save();

        return {
            xpEarned,
            totalXp: progress.totalXp,
            currentStreak: progress.currentStreak,
            lessonId
        };
    }

    async awardMissionXP(userId, missionId, playgroundId, xpReward = 50) {
        if (!userId) return null;

        let progress = await UserProgress.findOne({ userId });
        if (!progress) {
            progress = new UserProgress({ userId });
        }

        // Check if mission already completed
        const alreadyCompleted = progress.completedMissions.some(
            cm => cm.missionId && cm.missionId.toString() === missionId?.toString()
        );

        if (alreadyCompleted) {
            throw new AppError('Mission already completed. XP already awarded.', 400);
        }

        progress.totalXp += xpReward;
        if (missionId) {
            progress.completedMissions.push({ missionId, playgroundId });
        }

        this._updateStreak(progress);
        await progress.save();

        return {
            xpEarned: xpReward,
            totalXp: progress.totalXp,
            currentStreak: progress.currentStreak
        };
    }

    async getUserProgress(userId) {
        let progress = await UserProgress.findOne({ userId })
            .populate('completedLessons.courseId', 'title slug')
            .populate('completedMissions.playgroundId', 'title');
            
        if (!progress) {
            progress = { totalXp: 0, currentStreak: 0, completedLessons: [] };
        }
        
        return progress;
    }

    _updateStreak(progress) {
        const now = new Date();
        const lastActivity = progress.lastActivityDate;
        
        if (!lastActivity) {
            progress.currentStreak = 1;
            progress.maxStreak = 1;
        } else {
            const diffInDays = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
            if (diffInDays === 1) {
                progress.currentStreak += 1;
                if (progress.currentStreak > progress.maxStreak) {
                    progress.maxStreak = progress.currentStreak;
                }
            } else if (diffInDays > 1) {
                progress.currentStreak = 1;
            }
        }
        progress.lastActivityDate = now;
    }
}

module.exports = new ProgressService();

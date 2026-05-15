const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One progress record per user
        index: true
    },
    totalXp: {
        type: Number,
        default: 0,
        min: 0,
        index: -1 // High to low indexing for leaderboards
    },
    currentStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    maxStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    lastActivityDate: {
        type: Date,
        default: null
    },
    // Track exact lessons completed to prevent duplicate XP farming
    completedLessons: [{
        lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        completedAt: { type: Date, default: Date.now }
    }],
    // Track missions completed in Playgrounds
    completedMissions: [{
        missionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        playgroundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playground', required: true },
        completedAt: { type: Date, default: Date.now }
    }],
    // Array of string enum or ObjectIds to a dedicated Badge schema
    achievements: [{
        badgeName: { type: String, required: true },
        unlockedAt: { type: Date, default: Date.now }
    }],
    totalLearningTimeSeconds: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index to quickly find if a user has completed a specific lesson
UserProgressSchema.index({ userId: 1, 'completedLessons.lessonId': 1 });

module.exports = mongoose.model('UserProgress', UserProgressSchema);

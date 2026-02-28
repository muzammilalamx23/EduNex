const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0
    },
    coursesCompleted: {
        type: Number,
        default: 0
    },
    learningTime: {
        type: Number, // in minutes
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    },
    dailyLearningTime: {
        type: Number,
        default: 0
    },
    lastStreakUpdate: {
        type: Date,
        default: null
    },
    enrolledCourses: [{
        courseId: String,
        title: String,
        progress: {
            type: Number,
            default: 0
        },
        thumbnail: String
    }],
    linkedin: {
        type: String,
        default: ""
    },
    github: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);

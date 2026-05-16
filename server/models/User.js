const mongoose = require('mongoose');

// ─── Enrolled Course Subdocument ──────────────────────────────────────────────
// completedLessons: lesson IDs the user has finished (for progress %, XP dedup, checkmarks)
// lastLessonId:     the lesson the user was viewing last — enables "Continue Learning" resume
const EnrolledCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: String,
    thumbnail: String,
    progress: {
        type: Number,
        default: 0
    },
    completedLessons: {
        type: [String], // stores lessonId strings
        default: []
    },
    // ID of the last lesson the user had open — null means start from lesson 0.
    // Updated every time the user switches to a different lesson.
    lastLessonId: {
        type: String,
        default: null
    },
    certificateUrl: {
        type: String,
        default: null
    },
    certificateId: {
        type: String,
        default: null
    },
    issuedAt: {
        type: Date,
        default: null
    }
}, { _id: false });


const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    coursesCompleted: {
        type: Number,
        default: 0,
        min: 0
    },
    learningTime: {
        type: Number, // cumulative minutes
        default: 0,
        min: 0
    },
    streak: {
        type: Number,
        default: 0,
        min: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    },
    dailyLearningTime: {
        type: Number, // resets each day
        default: 0,
        min: 0
    },
    lastStreakUpdate: {
        type: Date,
        default: null
    },
    enrolledCourses: [EnrolledCourseSchema],
    linkedin: {
        type: String,
        default: '',
        trim: true,
    },
    github: {
        type: String,
        default: '',
        trim: true,
    },
    activityLog: {
        type: [
            {
                date: String,
                minutes: Number
            }
        ],
        default: []
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', UserSchema);

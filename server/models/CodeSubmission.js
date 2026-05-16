const mongoose = require('mongoose');

const CodeSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.lessons', // Optional reference
    },
    lessonTitle: {
        type: String,
        default: 'Playground Submission'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'needs_work'],
        default: 'pending'
    },
    reviewFeedback: {
        type: String,
        default: null
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('CodeSubmission', CodeSubmissionSchema);

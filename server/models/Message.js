const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'rejected'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

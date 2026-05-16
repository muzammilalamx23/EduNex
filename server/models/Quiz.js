const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswerIndex: { type: Number, required: true },
        explanation: { type: String, default: '' },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
    }],
    passingScore: {
        type: Number, // Percentage 0-100
        default: 70
    },
    xpReward: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

// Add a method to return the quiz without correct answers
quizSchema.methods.getPublicProfile = function() {
    const quizObj = this.toObject();
    quizObj.questions.forEach(q => {
        delete q.correctAnswerIndex;
        delete q.explanation; // Hide explanation until answered
    });
    return quizObj;
};

module.exports = mongoose.model('Quiz', quizSchema);

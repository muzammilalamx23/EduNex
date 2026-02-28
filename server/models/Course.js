const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true
    },
    videoUrl: {
        type: String // Optional: a lesson could be reading-only
    },
    content: {
        type: String // Text-formatted notes
    },
    pdfUrl: {
        type: String // Link to PDF notes
    },
    duration: {
        type: String,
        default: '0:00'
    }
}, { _id: true });

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    category: {
        type: String,
        default: 'General'
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    lessons: [LessonSchema],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructor: String, // Keeping for backward compatibility if needed
    rating: {
        type: Number,
        default: 4.5
    }
}, {
    timestamps: true
});

// Adding Text Index for efficient searching and to prevent Regex DoS
CourseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', CourseSchema);


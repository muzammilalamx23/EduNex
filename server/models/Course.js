const mongoose = require('mongoose');

// ─── Exported Categories ──────────────────────────────────────────────────────
// Single source of truth — imported by routes and can be consumed by frontend.
const COURSE_CATEGORIES = [
    'Development',
    'Design',
    'Business',
    'Data Science',
    'Marketing',
    'IT & Software',
    'Personal Development',
    'Other'
];

// ─── Lesson Subdocument ───────────────────────────────────────────────────────
const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true,
        maxlength: [200, 'Lesson title cannot exceed 200 characters']
    },
    // Original YouTube URL as pasted by the admin (for display/audit purposes).
    // Route validator enforces YouTube-only via isValidYouTubeUrl().
    videoUrl: {
        type: String,
        trim: true,
        default: ''
    },
    // Pre-extracted 11-char YouTube video ID.
    // Computed server-side from videoUrl on create/update — never set by client.
    // Stored to avoid URL parsing at render time.
    videoId: {
        type: String,
        trim: true,
        default: ''
    },
    content: {
        type: String,
        default: '',
        maxlength: [20000, 'Lesson content cannot exceed 20,000 characters']
    },
    pdfUrl: {
        type: String,
        trim: true,
        default: ''
    },
    duration: {
        type: Number,
        default: 0,
        min: [0, 'Duration cannot be negative'],
        max: [600, 'Single lesson duration cannot exceed 600 minutes (10 hours)']
    },
    order: {
        type: Number,
        default: 0
    }
}, { _id: true });


// ─── Course Schema ────────────────────────────────────────────────────────────
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [150, 'Course title cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    category: {
        type: String,
        enum: {
            values: COURSE_CATEGORIES,
            message: '"{VALUE}" is not a valid category.'
        },
        default: 'Development'
    },
    difficulty: {
        type: String,
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: '"{VALUE}" is not a valid difficulty level.'
        },
        default: 'Beginner'
    },
    thumbnail: {
        type: String,
        trim: true,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    // Tags enable topic-level search (e.g. "async", "closures", "flexbox").
    // Stored lowercase for consistent matching.
    tags: {
        type: [String],
        default: []
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
    // Denormalized counter — incremented on enroll, decremented on unenroll.
    // Avoids an expensive User collection aggregation for enrollment counts.
    enrollmentCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Rating: 0 = unrated. Updated when a review system is implemented.
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },   // include virtuals in res.json() output
    toObject: { virtuals: true }
});

// ─── Virtual: totalDuration ───────────────────────────────────────────────────
// Computes the sum of all lesson durations (in minutes) on the fly.
// Only works when lessons are embedded (not projected out).
CourseSchema.virtual('totalDuration').get(function () {
    if (!this.lessons || this.lessons.length === 0) return 0;
    return this.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Text index covers title, description, AND tags for comprehensive search.
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// ─── Static: CATEGORIES ───────────────────────────────────────────────────────
// Expose the list so routes can validate against it without duplication.
CourseSchema.statics.CATEGORIES = COURSE_CATEGORIES;

module.exports = mongoose.model('Course', CourseSchema);

const mongoose = require('mongoose');
const slugify = require('slugify');

// ─── Exported Categories ──────────────────────────────────────────────────────
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
    section: {
        type: String,
        default: 'General'
    },
    videoUrl: {
        type: String,
        trim: true,
        default: ''
    },
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
    type: {
        type: String,
        enum: ['video', 'reading', 'heading', 'quiz'],
        default: 'video'
    },
    order: {
        type: Number,
        default: 0
    },
    // Enterprise Integration: Links specific lessons to an interactive Playground Mission
    playgroundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playground',
        default: null
    },
    xpReward: {
        type: Number,
        default: 10,
        min: 0
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
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
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
        default: 'Development',
        index: true
    },
    difficulty: {
        type: String,
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: '"{VALUE}" is not a valid difficulty level.'
        },
        default: 'Beginner',
        index: true
    },
    thumbnail: {
        type: String,
        trim: true,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    },
    tags: {
        type: [String],
        default: [],
        index: true
    },
    technologies: {
        type: [String],
        default: [],
        index: true
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
    enrollmentCount: {
        type: Number,
        default: 0,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    estimatedDuration: {
        type: Number, // In minutes
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ─── Virtual: totalDuration ───────────────────────────────────────────────────
CourseSchema.virtual('totalDuration').get(function () {
    if (!this.lessons || this.lessons.length === 0) return 0;
    return this.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
});

// ─── Pre-Save Hook: Generate Slug ──────────────────────────────────────────────
CourseSchema.pre('save', function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

// ─── Compound & Text Indexes ──────────────────────────────────────────────────
// Optimized for catalog filtering, pagination, and full-text search
CourseSchema.index({ category: 1, difficulty: 1, status: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text', technologies: 'text' });

CourseSchema.statics.CATEGORIES = COURSE_CATEGORIES;

module.exports = mongoose.model('Course', CourseSchema);

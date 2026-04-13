require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

const courses = [
    {
        title: "Frontend Foundations: HTML & CSS",
        instructor: "Alex Rivera",
        duration: "8h 30m",
        rating: 4.9,
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
        description: "Master the building blocks of the web. Learn semantic HTML, CSS layouts, and responsive design.",
        lessons: [
            // HTML PHASE
            {
                title: "Phase 1: HTML Mastery",
                type: "heading"
            },
            {
                title: "Introduction to Web Architecture",
                section: "HTML Topics",
                type: "reading",
                content: "Learn how the internet works, the role of browsers, and how HTML serves as the skeleton of every webpage.",
                duration: 5
            },
            {
                title: "Semantic HTML Best Practices",
                section: "HTML Topics",
                type: "reading",
                content: "Deep dive into <header>, <main>, <footer>, and <article> tags for better SEO and accessibility.",
                duration: 10
            },
            {
                title: "HTML in 100 Seconds (Fireship)",
                section: "HTML Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/embed/ok-plXXHlWw",
                duration: 2
            },
            {
                title: "HTML Full Course for Beginners (Mosh)",
                section: "HTML Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE",
                duration: 60
            },
            
            // CSS PHASE
            {
                title: "Phase 2: CSS Foundations",
                type: "heading"
            },
            {
                title: "The CSS Box Model Explained",
                section: "CSS Topics",
                type: "reading",
                content: "Understanding Margin, Border, Padding, and Content—the pillars of web layout.",
                duration: 8
            },
            {
                title: "CSS in 100 Seconds (Fireship)",
                section: "CSS Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/embed/OEV8gMkCHXQ",
                duration: 2
            },
            {
                title: "CSS Full Course (Mosh)",
                section: "CSS Videos",
                type: "video",
                videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
                duration: 90
            }
        ]
    },
    {
        title: "Modern JavaScript Essentials",
        instructor: "Sarah Drasner",
        duration: "10h 15m",
        rating: 4.8,
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60",
        description: "Learn the programming language that powers the internet. From basics to ES6+ features.",
        lessons: [
            { title: "Variables and Constants", videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c", duration: 10 },
            { title: "Data Types", videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c", duration: 15 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Course.deleteMany({});
        console.log('Cleared existing courses');
        
        // Find an admin user to assign as the creator
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.error('Error: No admin user found in DB. Please create an admin user first.');
            process.exit(1);
        }

        const coursesWithMetaData = courses.map(c => ({
            ...c,
            createdBy: adminUser._id,
            status: 'published'
        }));

        await Course.insertMany(coursesWithMetaData);
        console.log('Added seed courses');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

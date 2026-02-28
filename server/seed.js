require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const courses = [
    {
        title: "Frontend Foundations: HTML & CSS",
        instructor: "Alex Rivera",
        duration: "8h 30m",
        rating: 4.9,
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60",
        description: "Master the building blocks of the web. Learn semantic HTML, CSS layouts, and responsive design.",
        modules: [
            {
                title: "Introduction to HTML",
                lessons: [
                    {
                        title: "HTML Full Course (Crash Course)",
                        type: "video",
                        videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
                        duration: "2:00:00"
                    }
                ]
            },
            {
                title: "CSS Styles & Layouts",
                lessons: [
                    {
                        title: "CSS Full Course",
                        type: "video",
                        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
                        duration: "1:30:00"
                    },
                    {
                        title: "HTML/CSS Knowledge Check",
                        type: "quiz",
                        duration: "5:00",
                        questions: [
                            {
                                question: "What does HTML stand for?",
                                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Management"],
                                answer: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "Modern JavaScript Essentials",
        instructor: "Sarah Drasner",
        duration: "10h 15m",
        rating: 4.8,
        level: "Beginner",
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60",
        description: "Learn the programming language that powers the internet. From basics to ES6+ features.",
        modules: [
            {
                title: "JS Basics",
                lessons: [
                    { title: "Variables and Constants", videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c", duration: "10:00" },
                    { title: "Data Types", videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c", duration: "15:00" }
                ]
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        await Course.deleteMany({});
        console.log('Cleared existing courses');
        await Course.insertMany(courses);
        console.log('Added seed courses');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

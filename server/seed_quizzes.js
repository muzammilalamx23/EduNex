require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');

async function seedQuizzes() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // 1. React Quiz
        const reactCourse = await Course.findOne({ title: /React.js Mastery/i });
        if (reactCourse && !reactCourse.lessons.some(l => l.type === 'quiz')) {
            reactCourse.lessons.push({
                title: "React Fundamentals Assessment",
                type: "quiz",
                section: "Project",
                quiz: {
                    questions: [
                        {
                            questionText: "Which hook is used to manage state in a functional component?",
                            options: ["useEffect", "useState", "useContext", "useReducer"],
                            correctOptionIndex: 1,
                            explanation: "useState is the primary hook for managing local component state."
                        },
                        {
                            questionText: "What does JSX stand for?",
                            options: ["JavaScript XML", "Java Syntax Extension", "JSON X", "JavaScript Xtreme"],
                            correctOptionIndex: 0,
                            explanation: "JSX stands for JavaScript XML. It allows us to write HTML in React."
                        },
                        {
                            questionText: "Can you mutate state directly in React (e.g., state.count = 1)?",
                            options: ["Yes, anytime", "No, you must use the setState function", "Only in class components"],
                            correctOptionIndex: 1,
                            explanation: "State should never be mutated directly. Always use the setter function provided by useState."
                        }
                    ]
                }
            });
            await reactCourse.save();
            console.log('✅ Added Quiz to "React.js Mastery"');
        } else {
            console.log('⏭️ React Quiz already exists or course not found.');
        }

        // 2. HTML & CSS Quiz
        const htmlCssCourse = await Course.findOne({ title: /Frontend Foundations/i });
        if (htmlCssCourse && !htmlCssCourse.lessons.some(l => l.type === 'quiz')) {
            htmlCssCourse.lessons.push({
                title: "HTML & CSS Mastery Quiz",
                type: "quiz",
                section: "CSS Videos", // Adding to the last section
                quiz: {
                    questions: [
                        {
                            questionText: "Which HTML tag is used to define an internal style sheet?",
                            options: ["<css>", "<style>", "<script>", "<link>"],
                            correctOptionIndex: 1,
                            explanation: "The <style> tag is used inside the <head> to write internal CSS."
                        },
                        {
                            questionText: "What does CSS stand for?",
                            options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
                            correctOptionIndex: 2,
                            explanation: "CSS stands for Cascading Style Sheets."
                        },
                        {
                            questionText: "Which property is used to change the background color?",
                            options: ["bgcolor", "color", "background-color", "bg-color"],
                            correctOptionIndex: 2,
                            explanation: "The background-color property is used to set the background color of an element."
                        }
                    ]
                }
            });
            await htmlCssCourse.save();
            console.log('✅ Added Quiz to "Frontend Foundations: HTML & CSS"');
        } else {
            console.log('⏭️ HTML/CSS Quiz already exists or course not found.');
        }

        // 3. JavaScript Quiz
        const jsCourse = await Course.findOne({ title: /Modern JavaScript/i });
        if (jsCourse && !jsCourse.lessons.some(l => l.type === 'quiz')) {
            jsCourse.lessons.push({
                title: "JavaScript Logic & Syntax Quiz",
                type: "quiz",
                section: "Advanced",
                quiz: {
                    questions: [
                        {
                            questionText: "Which keyword is used to declare a variable that cannot be reassigned?",
                            options: ["var", "let", "const", "static"],
                            correctOptionIndex: 2,
                            explanation: "const is used to declare variables that cannot be reassigned after initialization."
                        },
                        {
                            questionText: "What is the output of 'typeof null' in JavaScript?",
                            options: ["null", "undefined", "object", "string"],
                            correctOptionIndex: 2,
                            explanation: "In JavaScript, typeof null is notoriously evaluated as 'object' due to a legacy bug."
                        },
                        {
                            questionText: "How do you write a strict equality comparison?",
                            options: ["=", "==", "===", "!=="],
                            correctOptionIndex: 2,
                            explanation: "=== checks for both value and type equality (strict equality)."
                        }
                    ]
                }
            });
            await jsCourse.save();
            console.log('✅ Added Quiz to "Modern JavaScript Essentials"');
        } else {
            console.log('⏭️ JavaScript Quiz already exists or course not found.');
        }

        console.log('\n🎉 All Quizzes Seeded Successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error seeding quizzes:', err);
        process.exit(1);
    }
}

seedQuizzes();

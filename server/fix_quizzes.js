require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

async function fixQuizzes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔄 Connected to MongoDB');

        // We need to create Quiz documents for the quiz lessons in HTML and JS courses.
        const html = await Course.findOne({title: /Frontend Foundations/i});
        const js = await Course.findOne({title: /Modern JavaScript/i});

        if (html) {
            const htmlQuizLesson = html.lessons.find(l => l.type === 'quiz');
            if (htmlQuizLesson) {
                await Quiz.deleteOne({ lessonId: htmlQuizLesson._id });
                await Quiz.create({
                    courseId: html._id,
                    lessonId: htmlQuizLesson._id,
                    title: htmlQuizLesson.title,
                    passingScore: 70,
                    xpReward: 50,
                    questions: [
                        {
                            questionText: "Which HTML tag is used to define an internal style sheet?",
                            options: ["<css>", "<style>", "<script>", "<link>"],
                            correctAnswerIndex: 1,
                            explanation: "The <style> tag is used to embed CSS directly within an HTML document's <head> section."
                        },
                        {
                            questionText: "What does CSS stand for?",
                            options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                            correctAnswerIndex: 1,
                            explanation: "CSS stands for Cascading Style Sheets, describing how HTML elements are displayed."
                        },
                        {
                            questionText: "Which property is used to change the background color?",
                            options: ["color", "bgcolor", "background-color", "bg-color"],
                            correctAnswerIndex: 2,
                            explanation: "The background-color property sets the background color of an element."
                        }
                    ]
                });
                console.log(`✅ Fixed Quiz for HTML Course (Lesson ID: ${htmlQuizLesson._id})`);
            }
        }

        if (js) {
            const jsQuizLesson = js.lessons.find(l => l.type === 'quiz');
            if (jsQuizLesson) {
                await Quiz.deleteOne({ lessonId: jsQuizLesson._id });
                await Quiz.create({
                    courseId: js._id,
                    lessonId: jsQuizLesson._id,
                    title: jsQuizLesson.title,
                    passingScore: 70,
                    xpReward: 50,
                    questions: [
                        {
                            questionText: "Which keyword is used to declare a constant in JavaScript?",
                            options: ["var", "let", "const", "constant"],
                            correctAnswerIndex: 2,
                            explanation: "The 'const' keyword is used to declare variables whose values cannot be reassigned."
                        },
                        {
                            questionText: "What does 'typeof' return for an array?",
                            options: ["array", "object", "list", "undefined"],
                            correctAnswerIndex: 1,
                            explanation: "In JavaScript, arrays are technically objects, so typeof returns 'object'."
                        },
                        {
                            questionText: "Which method is used to add an element to the end of an array?",
                            options: ["push()", "pop()", "shift()", "unshift()"],
                            correctAnswerIndex: 0,
                            explanation: "The push() method adds one or more elements to the end of an array."
                        }
                    ]
                });
                console.log(`✅ Fixed Quiz for JS Course (Lesson ID: ${jsQuizLesson._id})`);
            }
        }

        console.log('🎉 Quizzes fixed successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixQuizzes();

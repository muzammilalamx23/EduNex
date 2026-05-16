const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedQuiz = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find the React course
        const course = await Course.findOne({ title: /React/i });
        if (!course) {
            console.log('No React course found. Run course seeder first.');
            process.exit(1);
        }

        // Add a Quiz Lesson to the course if it doesn't exist
        const hasQuizLesson = course.lessons.some(l => l.type === 'quiz');
        let lessonId;

        if (!hasQuizLesson) {
            course.lessons.push({
                title: 'React Fundamentals Quiz',
                type: 'quiz',
                section: 'Assessment',
                order: 99,
                xpReward: 100
            });
            await course.save();
            console.log('Added Quiz Lesson to React Course');
            
            // Get the ID of the newly added lesson
            const newLesson = course.lessons.find(l => l.type === 'quiz');
            lessonId = newLesson._id;
        } else {
            const quizLesson = course.lessons.find(l => l.type === 'quiz');
            lessonId = quizLesson._id;
            console.log('Quiz Lesson already exists in Course');
        }

        // Create the actual Quiz document
        await Quiz.deleteMany({ lessonId });
        
        await Quiz.create({
            courseId: course._id,
            lessonId: lessonId,
            title: 'React Core Concepts Mastery',
            passingScore: 66,
            xpReward: 100,
            questions: [
                {
                    questionText: 'What hook is used to manage state in functional components?',
                    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
                    correctAnswerIndex: 1,
                    explanation: 'useState is the primary React Hook for adding local state to functional components.'
                },
                {
                    questionText: 'Which of the following is true about React props?',
                    options: [
                        'Props can be modified by the child component',
                        'Props are immutable (read-only) once passed to a child',
                        'Props are only used for class components',
                        'Props replace state entirely'
                    ],
                    correctAnswerIndex: 1,
                    explanation: 'Props are strictly read-only. A child component must never modify its own props directly.'
                },
                {
                    questionText: 'What is the Virtual DOM?',
                    options: [
                        'A completely new web browser',
                        'A direct interface to the SQL database',
                        'A lightweight JavaScript representation of the actual DOM',
                        'A backend rendering engine'
                    ],
                    correctAnswerIndex: 2,
                    explanation: 'The Virtual DOM is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM.'
                }
            ]
        });

        console.log('Quiz Data Seeded Successfully!');
        process.exit(0);

    } catch (err) {
        console.error('Seeding failed', err);
        process.exit(1);
    }
};

seedQuiz();

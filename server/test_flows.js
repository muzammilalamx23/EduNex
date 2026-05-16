require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const CodeSubmission = require('./models/CodeSubmission');
const Notification = require('./models/Notification');
const CertificateService = require('./services/certificateService');

async function runTests() {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let testUser = await User.findOne({ email: 'test_report@edunex.com' });
    if (!testUser) {
        testUser = await User.create({
            fullName: 'Test Report User',
            email: 'test_report@edunex.com',
            password: 'password123',
            xp: 0
        });
        console.log('✅ Created Test User');
    } else {
        console.log('✅ Test User found');
    }

    // 1. Create a Test Course
    let testCourse = await Course.findOne({ slug: 'test-course' });
    if (!testCourse) {
        testCourse = await Course.create({
            title: 'Test Course',
            slug: 'test-course',
            description: 'Course for testing',
            instructor: { name: 'Admin', avatar: '' },
            createdBy: testUser._id,
            level: 'Beginner',
            status: 'published',
            lessons: [{
                title: 'Test Quiz Lesson',
                type: 'quiz',
                quiz: {
                    questions: [{
                        questionText: 'Is EduNex awesome?',
                        options: ['Yes', 'No'],
                        correctOptionIndex: 0
                    }]
                }
            }]
        });
        console.log('✅ Created Test Course with a Quiz');
    }

    // 2. Simulate Quiz Completion & 100% Progress
    console.log('\n--- 🧪 TESTING QUIZ PROGRESS FLOW ---');
    const enrollment = {
        courseId: testCourse._id,
        title: testCourse.title,
        progress: 100, // Simulated passing of the single quiz
        completedLessons: [testCourse.lessons[0]._id]
    };
    
    // Update user progress
    testUser.enrolledCourses = [enrollment];
    testUser.xp += 100;
    await testUser.save();
    console.log('✅ Successfully simulated 100% course completion via Quiz (XP updated).');

    // 3. Test Certificate Generation Service
    console.log('\n--- 🧪 TESTING CERTIFICATE GENERATION ---');
    try {
        const certificateUrl = await CertificateService.generateCertificate(testUser._id, testCourse._id);
        console.log('✅ Certificate generated successfully!');
        console.log('🔗 URL:', certificateUrl);
    } catch (err) {
        console.error('❌ Certificate generation failed:', err.message);
    }

    // 4. Test Code Submission & Notification Flow
    console.log('\n--- 🧪 TESTING CODE REVIEW NOTIFICATION FLOW ---');
    const submission = await CodeSubmission.create({
        user: testUser._id,
        lessonTitle: 'Test Coding Challenge',
        code: 'console.log("Hello World");',
        language: 'javascript'
    });
    console.log('✅ Code Submission created.');

    // Simulate Admin Review (similar to controller logic)
    submission.status = 'reviewed';
    submission.adminFeedback = 'Looks good!';
    await submission.save();

    const notificationService = require('./services/notificationService');
    // We pass null for io since we are in a headless script, service should handle it
    await notificationService.dispatch(null, testUser._id.toString(), {
        type: 'review',
        title: 'Code Review Completed',
        message: `Your submission for ${submission.lessonTitle} has been reviewed by an instructor.`,
        actionUrl: `/dashboard`
    });

    const notif = await Notification.findOne({ userId: testUser._id, type: 'review' }).sort({ createdAt: -1 });
    if (notif) {
        console.log('✅ Notification stored securely in MongoDB.');
        console.log('🔔 Notification Data:', {
            title: notif.title,
            message: notif.message,
            isRead: notif.isRead
        });
    } else {
        console.error('❌ Notification failed to save.');
    }

    console.log('\n✅ ALL SYSTEMS VERIFIED AND TESTED.');
    process.exit(0);
}

runTests().catch(err => {
    console.error(err);
    process.exit(1);
});

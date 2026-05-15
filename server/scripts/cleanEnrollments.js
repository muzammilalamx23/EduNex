require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

async function cleanEnrollments() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const targetEmail = 'muzammil533@gmail.com';
        console.log(`🔍 Searching for user: ${targetEmail}`);

        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.error('❌ User not found.');
            process.exit(1);
        }

        console.log(`👤 Found user: ${user.fullName}`);
        console.log(`🧹 Current enrolled courses: ${user.enrolledCourses.length}`);

        // Reset user enrolledCourses
        user.enrolledCourses = [];
        await user.save();
        console.log('✅ Cleared enrolledCourses array.');

        // Find associated UserProgress
        const progress = await UserProgress.findOne({ userId: user._id });
        if (progress) {
            console.log(`🧹 Found UserProgress document. Clearing lesson/mission progress...`);
            
            progress.completedLessons = [];
            progress.completedMissions = [];
            
            // Note: We are specifically NOT touching totalXp, currentStreak, maxStreak, or lastActivityDate
            await progress.save();
            console.log('✅ Cleared lesson & mission progress while retaining XP and Streaks.');
        } else {
            console.log('ℹ️ No UserProgress document found for this user. Skipping progress cleanup.');
        }

        console.log('🎉 Cleanup complete! The user can now safely enroll in newly seeded courses.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error during cleanup:', err);
        process.exit(1);
    }
}

cleanEnrollments();

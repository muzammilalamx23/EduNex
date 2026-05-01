const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Issuer helper to generate JWT and set HttpOnly cookie
 */
const generateTokenAndSetCookie = (res, user) => {
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

/**
 * @desc Get current authenticated user
 */
exports.getUser = async (req, res) => {
    const userDoc = await User.findById(req.user.id).select('-password -__v');
    if (!userDoc) return ApiResponse.error(res, 'User not found.', 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Streak & Reset Logic
    if (userDoc.lastActiveDate) {
        const lastActive = new Date(userDoc.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            userDoc.streak = 0;
            userDoc.dailyLearningTime = 0;
        } else if (diffDays === 1) {
            userDoc.dailyLearningTime = 0;
        }
    }

    userDoc.lastActiveDate = today;
    await userDoc.save();

    return ApiResponse.success(res, 'User retrieved.', userDoc);
};

/**
 * @desc Register user
 */
exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return ApiResponse.error(res, 'An account with that email already exists.', 400);

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ fullName, email, password: hashedPassword });
    generateTokenAndSetCookie(res, user);

    return ApiResponse.success(res, 'Account created.', null, 201);
};

/**
 * @desc Login user
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return ApiResponse.error(res, 'Invalid credentials.', 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return ApiResponse.error(res, 'Invalid credentials.', 400);

    generateTokenAndSetCookie(res, user);
    return ApiResponse.success(res, 'Login successful.');
};

/**
 * @desc Logout user
 */
exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
    });
    return ApiResponse.success(res, 'Logged out successfully.');
};

/**
 * @desc Update user profile
 */
exports.updateProfile = async (req, res) => {
    const { fullName, linkedin, github, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    if (fullName) user.fullName = fullName;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;

    if (password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    return ApiResponse.success(res, 'Profile updated.', {
        fullName: user.fullName,
        email: user.email,
        linkedin: user.linkedin,
        github: user.github,
    });
};

/**
 * @desc Enroll in course
 */
exports.enroll = async (req, res) => {
    const { courseId } = req.body;

    const course = await Course.findById(courseId).lean();
    if (!course) return ApiResponse.error(res, 'Course not found.', 404);
    if (course.status !== 'published') return ApiResponse.error(res, 'Course unavailable.', 400);

    const user = await User.findById(req.user.id);
    const alreadyEnrolled = user.enrolledCourses.some(c => c.courseId.toString() === courseId);
    if (alreadyEnrolled) return ApiResponse.error(res, 'Already enrolled.', 400);

    user.enrolledCourses.push({
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail || '',
        progress: 0,
        completedLessons: []
    });

    await Promise.all([
        user.save(),
        Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })
    ]);

    return ApiResponse.success(res, 'Successfully enrolled.', user.enrolledCourses);
};

/**
 * @desc Mark lesson complete
 */
exports.lessonComplete = async (req, res) => {
    const XP_PER_LESSON = 100;
    const { courseId, lessonId } = req.body;

    const [user, course] = await Promise.all([
        User.findById(req.user.id),
        Course.findById(courseId).select('lessons').lean(),
    ]);

    if (!user) return ApiResponse.error(res, 'User not found.', 404);
    if (!course) return ApiResponse.error(res, 'Course not found.', 404);

    const enrollment = user.enrolledCourses.find(c => c.courseId.toString() === courseId);
    if (!enrollment) return ApiResponse.error(res, 'Not enrolled.', 404);

    if (enrollment.completedLessons.includes(lessonId)) {
        return ApiResponse.success(res, 'Already completed.', {
            xp: user.xp,
            progress: enrollment.progress,
            coursesCompleted: user.coursesCompleted,
            completedLessons: enrollment.completedLessons,
        });
    }

    enrollment.completedLessons.push(lessonId);
    const totalLessons = course.lessons.length;
    const newProgress = totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 100;

    const wasCompleteBefore = enrollment.progress >= 100;
    enrollment.progress = newProgress;
    user.xp += XP_PER_LESSON;

    if (newProgress >= 100 && !wasCompleteBefore) user.coursesCompleted += 1;

    await user.save();
    return ApiResponse.success(res, 'Lesson completed.', {
        xp: user.xp,
        progress: enrollment.progress,
        coursesCompleted: user.coursesCompleted,
        completedLessons: enrollment.completedLessons,
    });
};

/**
 * @desc Save current learning position
 */
exports.savePosition = async (req, res) => {
    const { courseId, lessonId } = req.body;
    const result = await User.updateOne(
        { _id: req.user.id, 'enrolledCourses.courseId': courseId },
        { $set: { 'enrolledCourses.$.lastLessonId': lessonId } }
    );

    if (result.matchedCount === 0) return ApiResponse.error(res, 'Enrollment not found.', 404);
    return ApiResponse.success(res, 'Position saved.');
};

/**
 * @desc Award XP for playground activities
 */
exports.addXp = async (req, res) => {
    const PLAYGROUND_XP_MAP = {
        mission_complete: 50,
        playground_level_1: 50,
        playground_level_2: 60,
        playground_level_3: 70,
        playground_level_4: 80,
        playground_level_5: 90,
        playground_level_10: 200,
    };

    const { activity } = req.body;
    const xpToAdd = PLAYGROUND_XP_MAP[activity];
    if (!xpToAdd) return ApiResponse.error(res, 'Unknown activity.', 400);

    const user = await User.findById(req.user.id);
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    user.xp += xpToAdd;
    await user.save();

    return ApiResponse.success(res, `+${xpToAdd} XP awarded.`, { xp: user.xp, awarded: xpToAdd });
};

/**
 * @desc Get course progress
 */
exports.getProgress = async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id).select('enrolledCourses').lean();
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    const enrollment = user.enrolledCourses.find(c => c.courseId.toString() === courseId);
    if (!enrollment) return ApiResponse.error(res, 'Not enrolled.', 404);

    return ApiResponse.success(res, 'Progress retrieved.', {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        lastLessonId: enrollment.lastLessonId || null,
    });
};

/**
 * @desc Update learning time and streak
 */
exports.updateTime = async (req, res) => {
    const { minutes } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    user.learningTime += minutes;
    user.dailyLearningTime += minutes;

    // Track historical activity
    const todayStr = today.toISOString().split('T')[0];
    const logIndex = user.activityLog.findIndex(log => log.date === todayStr);
    if (logIndex !== -1) {
        user.activityLog[logIndex].minutes += minutes;
    } else {
        user.activityLog.push({ date: todayStr, minutes });
    }
    // Keep only last 14 days to prevent array getting too large
    if (user.activityLog.length > 14) {
        user.activityLog = user.activityLog.slice(-14);
    }

    const STREAK_THRESHOLD = 30; 
    if (user.dailyLearningTime >= STREAK_THRESHOLD) {
        const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;
        if (!lastUpdate || lastUpdate < today) {
            if (lastUpdate) {
                const diffDays = Math.round((today - lastUpdate) / (1000 * 60 * 60 * 24));
                user.streak = diffDays === 1 ? user.streak + 1 : 1;
            } else {
                user.streak = 1;
            }
            user.lastStreakUpdate = today;
        }
    }

    await user.save();
    return ApiResponse.success(res, 'Time updated.', {
        learningTime: user.learningTime,
        dailyLearningTime: user.dailyLearningTime,
        streak: user.streak,
        streakMet: user.dailyLearningTime >= STREAK_THRESHOLD,
    });
};

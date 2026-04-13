const Course = require('../models/Course');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const { withTotalDuration, normalizeTags, processLessons } = require('../utils/courseHelpers');

/**
 * @desc Get all published courses
 */
exports.getAllCourses = async (req, res) => {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.$text = { $search: search };

    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 1000);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const projection = search ? { score: { $meta: 'textScore' } } : {};
    const sortParams = search ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    const [courses, count] = await Promise.all([
        Course.find(filter, projection)
            .sort(sortParams)
            .limit(limitNum)
            .skip(skip)
            .populate('createdBy', 'fullName')
            .lean(),
        Course.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(count / limitNum) || 1;
    return ApiResponse.success(res, 'Courses retrieved.', {
        courses: courses.map(withTotalDuration),
        pagination: {
            total: count,
            pages: totalPages,
            currentPage: Math.min(pageNum, totalPages),
            limit: limitNum
        }
    });
};

/**
 * @desc Get single course
 */
exports.getCourse = async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('createdBy', 'fullName')
        .lean();

    if (!course) return ApiResponse.error(res, 'Course not found.', 404);
    return ApiResponse.success(res, 'Course retrieved.', withTotalDuration(course));
};

/**
 * @desc Get all courses for admin
 */
exports.getAdminCourses = async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;

    const pageNum = Math.min(Math.max(Number(page) || 1, 1), 1000);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (status && ['draft', 'published'].includes(status)) filter.status = status;

    const [courses, count] = await Promise.all([
        Course.find(filter)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)
            .populate('createdBy', 'fullName')
            .lean(),
        Course.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(count / limitNum) || 1;
    return ApiResponse.success(res, 'Admin courses retrieved.', {
        courses: courses.map(withTotalDuration),
        pagination: {
            total: count,
            pages: totalPages,
            currentPage: Math.min(pageNum, totalPages),
            limit: limitNum
        }
    });
};

/**
 * @desc Create course
 */
exports.createCourse = async (req, res) => {
    const { title, description, category, difficulty, thumbnail, lessons, tags } = req.body;

    const courseData = {
        title,
        description,
        category: category || 'Development',
        difficulty: difficulty || 'Beginner',
        lessons: processLessons(lessons),
        tags: normalizeTags(tags),
        createdBy: req.user.id,
        status: 'draft',
    };
    if (thumbnail) courseData.thumbnail = thumbnail;

    const course = await Course.create(courseData);
    return ApiResponse.success(res, 'Course created successfully.', withTotalDuration(course.toObject()), 201);
};

/**
 * @desc Update course
 */
exports.updateCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return ApiResponse.error(res, 'Course not found.', 404);

    const { title, description, category, difficulty, thumbnail, lessons, tags } = req.body;
    const allowedUpdates = {};
    if (title !== undefined) allowedUpdates.title = title;
    if (description !== undefined) allowedUpdates.description = description;
    if (category !== undefined) allowedUpdates.category = category;
    if (difficulty !== undefined) allowedUpdates.difficulty = difficulty;
    if (thumbnail !== undefined) allowedUpdates.thumbnail = thumbnail;
    if (lessons !== undefined) allowedUpdates.lessons = processLessons(lessons);
    if (tags !== undefined) allowedUpdates.tags = normalizeTags(tags);

    const updated = await Course.findByIdAndUpdate(req.params.id, allowedUpdates, {
        new: true,
        runValidators: true
    });

    return ApiResponse.success(res, 'Course updated Successfully.', withTotalDuration(updated.toObject()));
};

/**
 * @desc Toggle publish status
 */
exports.togglePublish = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return ApiResponse.error(res, 'Course not found.', 404);

    const newStatus = course.status === 'published' ? 'draft' : 'published';
    course.status = newStatus;
    await course.save();

    return ApiResponse.success(res, `Course ${newStatus} successfully.`, { status: newStatus });
};

/**
 * @desc Delete course
 */
exports.deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return ApiResponse.error(res, 'Course not found.', 404);

    const courseId = course._id;
    await course.deleteOne();

    const updateResult = await User.updateMany(
        { 'enrolledCourses.courseId': courseId },
        { $pull: { enrolledCourses: { courseId: courseId } } }
    );

    return ApiResponse.success(res, 'Course deleted successfully.', { affectedUsers: updateResult.modifiedCount });
};

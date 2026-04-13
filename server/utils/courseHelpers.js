const { extractYouTubeId } = require('./youtube');

/**
 * Utility: add totalDuration to .lean() results
 */
exports.withTotalDuration = (course) => ({
    ...course,
    totalDuration: (course.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0)
});

/**
 * Utility: normalize tags (trim, lowercase, deduplicate)
 */
exports.normalizeTags = (tags) =>
    [...new Set(
        (Array.isArray(tags) ? tags : [])
            .map(t => String(t).trim().toLowerCase())
            .filter(Boolean)
    )];

/**
 * Utility: inject videoId into every lesson
 */
exports.processLessons = (lessons) =>
    (lessons || []).map(({ title, videoUrl, content, pdfUrl, duration, order, type, section }) => ({
        title,
        videoUrl: videoUrl || '',
        videoId: videoUrl ? (extractYouTubeId(videoUrl) || '') : '',
        content: content || '',
        pdfUrl: pdfUrl || '',
        duration: typeof duration === 'number' ? duration : 0,
        order: typeof order === 'number' ? order : 0,
        type: type || 'video',
        section: section || 'General',
    }));

exports.VALID_CATEGORIES = [
    'Development', 'Design', 'Business', 'Data Science',
    'Marketing', 'IT & Software', 'Personal Development', 'Other'
];

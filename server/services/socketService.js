const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const initSocket = (io) => {
    // Socket Authentication Middleware
    io.use(async (socket, next) => {
        try {
            // Parse cookies manually
            let token = socket.handshake.auth.token;
            if (!token && socket.handshake.headers.cookie) {
                const cookies = require('cookie').parse(socket.handshake.headers.cookie);
                token = cookies.token;
            }

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user.id).select('fullName role enrolledCourses');
            
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`[Socket.IO] Authenticated client connected: ${socket.user.fullName} (${socket.id})`);

        // Join Course Community Room
        socket.on('join_course_room', (courseId) => {
            const isAdmin = socket.user.role === 'admin';
            const isEnrolled = socket.user.enrolledCourses.some(c => c.courseId.toString() === courseId);
            
            if (isAdmin || isEnrolled) {
                const roomName = `course_${courseId}`;
                socket.join(roomName);
                logger.info(`[Socket.IO] User ${socket.user.fullName} joined room: ${roomName}`);
                socket.emit('joined_room', { room: roomName });
            } else {
                socket.emit('error', { message: 'Access denied to this course room.' });
            }
        });

        // Leave Course Community Room
        socket.on('leave_course_room', (courseId) => {
            const roomName = `course_${courseId}`;
            socket.leave(roomName);
            logger.info(`[Socket.IO] User ${socket.user.fullName} left room: ${roomName}`);
        });

        // Typing Indicator
        socket.on('typing', ({ courseId, isTyping }) => {
            const roomName = `course_${courseId}`;
            socket.to(roomName).emit('user_typing', {
                userId: socket.user._id,
                fullName: socket.user.fullName,
                isTyping
            });
        });

        socket.on('disconnect', () => {
            logger.info(`[Socket.IO] Client disconnected: ${socket.user.fullName} (${socket.id})`);
        });
    });
};

module.exports = initSocket;

const Message = require('../models/Message');
const Course = require('../models/Course');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.getMessages = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Validation: Ensure course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check enrollment or admin role
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        const isAdmin = user.role === 'admin';
        const isEnrolled = user.enrolledCourses.some(c => c.courseId.toString() === courseId);
        
        if (!isAdmin && !isEnrolled) {
            return res.status(403).json({ success: false, message: 'Access denied. You must be enrolled in this course.' });
        }

        // Fetch messages. 
        // Admins see all (active + pending), Students see active, and maybe their own pending (we'll just show active to students to simplify, except maybe they want to know if it's pending).
        const filter = { courseId };
        if (!isAdmin) {
            filter.$or = [
                { status: 'active' },
                { sender: user._id, status: 'pending' }
            ];
        }

        const messages = await Message.find(filter)
            .populate('sender', 'fullName')
            .sort({ createdAt: 1 })
            .limit(500); // Prevent massive payloads

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        console.error('getMessages Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { text } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isAdmin = user.role === 'admin';
        const isEnrolled = user.enrolledCourses.some(c => c.courseId.toString() === courseId);
        
        if (!isAdmin && !isEnrolled) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Message text is required.' });
        }

        const msg = await Message.create({
            courseId,
            sender: user._id,
            text,
            status: 'active' // Text messages are instantly active
        });

        const populatedMsg = await msg.populate('sender', 'fullName');

        // Emit new message event to the room via socket
        const io = req.app.get('io');
        if (io) {
            io.to(`course_${courseId}`).emit('new_message', populatedMsg);
        }

        res.status(201).json({ success: true, data: populatedMsg });
    } catch (err) {
        console.error('sendMessage Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { courseId } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isAdmin = user.role === 'admin';
        const isEnrolled = user.enrolledCourses.some(c => c.courseId.toString() === courseId);
        
        if (!isAdmin && !isEnrolled) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required.' });
        }

        // Cloudinary provides the full cloud URL natively via req.file.path
        const imageUrl = req.file.path;

        const msg = await Message.create({
            courseId,
            sender: user._id,
            imageUrl,
            status: isAdmin ? 'active' : 'pending' // Admin uploads active immediately
        });

        const populatedMsg = await msg.populate('sender', 'fullName');

        // Emit message if it is active (admin uploaded)
        if (isAdmin) {
            const io = req.app.get('io');
            if (io) {
                io.to(`course_${courseId}`).emit('new_message', populatedMsg);
            }
        }

        res.status(201).json({ success: true, data: populatedMsg, message: isAdmin ? undefined : 'Image uploaded and pending admin approval.' });

    } catch (err) {
        console.error('uploadImage Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { courseId, msgId } = req.params;
        
        const message = await Message.findById(msgId);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isAdmin = user.role === 'admin';
        if (!isAdmin && message.sender.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own messages.' });
        }

        await Message.findByIdAndDelete(msgId);
        
        // Note: For Cloudinary specifically, to delete images from the cloud we would use cloudinary.uploader.destroy().
        // For simplicity, we just delete the database record for now.

        // Emit delete event to the room
        const io = req.app.get('io');
        if (io) {
            io.to(`course_${courseId}`).emit('message_deleted', msgId);
        }

        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (err) {
        console.error('deleteMessage Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.moderateImage = async (req, res) => {
    try {
        const { courseId, msgId } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required.' });
        }

        const message = await Message.findById(msgId);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        if (action === 'approve') {
            message.status = 'active';
            await message.save();
        } else if (action === 'reject') {
            message.status = 'rejected';
            await message.save();
            // Optional: delete or keep the file
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action.' });
        }

        // Emit moderation event to the room
        const io = req.app.get('io');
        if (io) {
            io.to(`course_${courseId}`).emit('message_moderated', message);
            // If approved, treat as new message for real-time clients
            if (action === 'approve') {
                const populatedMsg = await message.populate('sender', 'fullName');
                io.to(`course_${courseId}`).emit('new_message', populatedMsg);
            }
        }

        res.status(200).json({ success: true, data: message });
    } catch (err) {
        console.error('moderateImage Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const Notification = require('../models/Notification');

class NotificationService {
    /**
     * Dispatch a notification: Save to DB and emit via Socket.IO
     * @param {Object} io - Socket.io instance
     * @param {String} userId - The user to receive the notification
     * @param {Object} payload - { type, title, message, actionUrl }
     */
    async dispatch(io, userId, payload) {
        try {
            // Save to Database
            const notification = await Notification.create({
                userId,
                type: payload.type || 'system',
                title: payload.title,
                message: payload.message,
                actionUrl: payload.actionUrl || null
            });

            // Emit via Socket.IO to the user's personal room
            if (io) {
                io.to(`user_${userId}`).emit('notification:new', notification);
            }

            return notification;
        } catch (error) {
            console.error('[NotificationService] Failed to dispatch:', error);
            // Don't throw, as notifications are usually fire-and-forget
            return null;
        }
    }
}

module.exports = new NotificationService();

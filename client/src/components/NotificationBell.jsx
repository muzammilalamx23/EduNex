import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence  } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data.data.notifications);
                setUnreadCount(res.data.data.unreadCount);
            } catch {
                console.error("Failed to fetch notifications");
            }
        };

        fetchNotifications();

        // Connect Socket
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('notification:new', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.success(`New Notification: ${notification.title}`, {
                icon: '🔔',
                duration: 4000
            });
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {
            console.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {
            console.error("Failed to mark all as read");
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-[90]" 
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-3 w-80 max-h-[85vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="overflow-y-auto flex-1 max-h-96">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                        <Bell size={32} className="mb-3 opacity-20" />
                                        <p className="text-sm">You're all caught up!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {notifications.map(notif => (
                                            <div 
                                                key={notif._id} 
                                                className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${!notif.isRead ? 'bg-violet-50/50 dark:bg-violet-500/5' : ''}`}
                                                onClick={() => {
                                                    if (!notif.isRead) handleMarkAsRead(notif._id);
                                                }}
                                            >
                                                <div className="flex gap-3">
                                                    {!notif.isRead && <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 shrink-0"></div>}
                                                    <div className={notif.isRead ? 'pl-2' : ''}>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{notif.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                                        <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-wider">
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {notif.actionUrl && (
                                                            <Link 
                                                                to={notif.actionUrl}
                                                                onClick={() => setIsOpen(false)}
                                                                className="text-xs font-bold text-violet-600 mt-2 inline-block hover:underline"
                                                            >
                                                                View details
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence  } from 'framer-motion';
import {
    Users,
    MessageSquare,
    Image as ImageIcon,
    Send,
    Lock,
    Loader2,
    Trash2,
    CheckCircle,
    XCircle,
    ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api, { API_BASE_URL } from '../utils/api';
import Navbar from '../components/Navbar';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { useAuth } from '../context/AuthContext';

const Community = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Fetch Course & Messages
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch course to show title/info in the blurred state too
                const courseRes = await api.get(`/courses/${courseId}`);
                setCourse(courseRes.data.data);
                
                if (user) {
                    const isEnrolled = user.role === 'admin' || user.enrolledCourses?.some(c => c.courseId === courseId);
                    if (isEnrolled || user.role === 'admin') {
                        const msgRes = await api.get(`/courses/${courseId}/community`);
                        setMessages(msgRes.data.data);
                    }
                }
            } catch (err) {
                console.error(err);
                if (user) {
                    toast.error('Failed to load community data.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        fetchInitialData();

        // Socket.io Real-time Setup
        if (user) {
            const isEnrolled = user.role === 'admin' || user.enrolledCourses?.some(c => c.courseId === courseId);
            if (isEnrolled) {
                // Initialize Socket
                socketRef.current = io(API_BASE_URL.replace('/api', ''), {
                    withCredentials: true,
                    transports: ['websocket', 'polling']
                });

                const socket = socketRef.current;

                socket.on('connect', () => {
                    socket.emit('join_course_room', courseId);
                });

                socket.on('new_message', (msg) => {
                    setMessages(prev => {
                        // Prevent duplicates
                        if (prev.some(m => m._id === msg._id)) return prev;
                        return [...prev, msg];
                    });
                });

                socket.on('message_deleted', (msgId) => {
                    setMessages(prev => prev.filter(m => m._id !== msgId));
                });

                socket.on('message_moderated', (msg) => {
                    setMessages(prev => prev.map(m => m._id === msg._id ? msg : m));
                });

                socket.on('user_typing', ({ fullName, isTyping }) => {
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        if (isTyping) newSet.add(fullName);
                        else newSet.delete(fullName);
                        return newSet;
                    });
                });
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_course_room', courseId);
                socketRef.current.disconnect();
            }
        };
    }, [courseId, user]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedImage) return;

        try {
            if (selectedImage) {
                setUploading(true);
                const formData = new FormData();
                formData.append('image', selectedImage);
                
                const res = await api.post(`/courses/${courseId}/community/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                if (res.data.success) {
                    toast.success(res.data.message || 'Image selected successfully!');
                    setMessages(prev => [...prev, res.data.data]);
                }
                setSelectedImage(null);
            }

            if (newMessage.trim()) {
                // We emit HTTP request, and the server broadcasts via socket
                // We don't push it locally to avoid duplication unless we want optimistic updates.
                // For simplicity, wait for the socket 'new_message' event.
                await api.post(`/courses/${courseId}/community`, { text: newMessage });
                setNewMessage('');
                if (socketRef.current) {
                    socketRef.current.emit('typing', { courseId, isTyping: false });
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error sending message');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMessage = async (msgId) => {
        try {
            await api.delete(`/courses/${courseId}/community/${msgId}`);
            // Optimistic update
            setMessages(prev => prev.filter(m => m._id !== msgId));
            toast.success('Message deleted');
        } catch (err) {
            toast.error('Failed to delete message');
        }
    };

    const handleModerate = async (msgId, action) => {
        try {
            await api.patch(`/courses/${courseId}/community/${msgId}/moderate`, { action });
            toast.success(`Message ${action}d!`);
            // Refresh messages
            const msgRes = await api.get(`/courses/${courseId}/community`);
            setMessages(msgRes.data.data);
        } catch (err) {
            toast.error('Moderation failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-600" size={48} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center text-gray-900">
                <h1 className="text-2xl font-bold mb-4">Course not found</h1>
                <Link to="/courses" className="px-6 py-2 bg-violet-600 text-white font-bold rounded-xl">Back to Courses</Link>
            </div>
        );
    }

    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'admin';
    const isEnrolled = isAdmin || user?.enrolledCourses?.some(c => c.courseId === courseId);

    const hasAccess = isLoggedIn && isEnrolled;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col relative overflow-hidden">
            <BackgroundAnimation />
            <Navbar />

            <div className="flex-grow flex flex-col max-w-6xl w-full mx-auto pt-24 pb-8 px-4 sm:px-6 relative z-10 h-screen max-h-screen">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 shadow-sm rounded-3xl p-6 mb-4 mt-8 flex-shrink-0">
                    <div>
                        <button
                            onClick={() => navigate(`/course-detail/${courseId}`)}
                            className="flex items-center gap-2 text-gray-400 hover:text-violet-600 transition-colors mb-2 group text-sm"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Course Detail</span>
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <MessageSquare className="text-violet-600" />
                            {course.title} Community
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0 text-sm font-medium bg-violet-600/10 text-violet-600 px-4 py-2 rounded-xl border border-violet-100">
                        <Users size={16} /> Active Discussion
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow relative h-full flex flex-col rounded-3xl bg-white border border-gray-200 shadow-md backdrop-blur-md overflow-hidden">
                    
                    {!hasAccess && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm p-6 text-center">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white border border-gray-200 p-8 rounded-3xl max-w-md w-full shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock size={32} />
                                </div>
                                <h2 className="text-2xl font-black mb-2">Restricted Access</h2>
                                <p className="text-gray-500 mb-8">
                                    {!isLoggedIn 
                                        ? "This is a premium community. You must be logged in to join the discussion." 
                                        : "You must be enrolled in this course to access its private community."}
                                </p>
                                {!isLoggedIn ? (
                                    <button 
                                        onClick={() => navigate('/auth')}
                                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all"
                                    >
                                        Log In / Sign Up
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate(`/course-detail/${courseId}`)}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
                                    >
                                        View Course Overview
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    )}

                    {/* Messages Feed */}
                    <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <AnimatePresence>
                            {hasAccess && messages.length === 0 && (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    <p>No messages yet. Be the first to start the conversation!</p>
                                </div>
                            )}

                            {hasAccess && messages.map((msg) => {
                                const isMine = msg.sender?._id === user?.userId || msg.sender?._id === user?._id;
                                const isPending = msg.status === 'pending';
                                const serverOrigin = API_BASE_URL.replace('/api', '');
                                
                                return (
                                    <motion.div 
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-500">
                                                {msg.sender?.fullName || 'User'}
                                            </span>
                                            <span className="text-[10px] text-zinc-600">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className={`relative max-w-[85%] sm:max-w-[70%] group rounded-2xl px-5 py-3 ${
                                            isMine ? 'bg-violet-600 text-white ml-auto rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'
                                        }`}>
                                            {isPending && (
                                                <div className="absolute -top-3 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">
                                                    Pending Approval
                                                </div>
                                            )}

                                            {msg.imageUrl && (
                                                <div className="mb-2 rounded-xl overflow-hidden cursor-pointer" onClick={() => window.open(`${serverOrigin}${msg.imageUrl}`, '_blank')}>
                                                    <img src={`${serverOrigin}${msg.imageUrl}`} alt="upload" className={`w-full max-h-64 object-cover ${isPending && !isAdmin ? 'blur-md' : ''}`} />
                                                </div>
                                            )}
                                            
                                            {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}

                                            {/* Admin Controls Overlay */}
                                            {isAdmin && isPending && (
                                                <div className="mt-3 flex gap-2">
                                                    <button onClick={() => handleModerate(msg._id, 'approve')} className="flex items-center gap-1 bg-green-500 text-gray-900 text-xs px-2 py-1 rounded hover:bg-green-600"><CheckCircle size={14}/> Approve</button>
                                                    <button onClick={() => handleModerate(msg._id, 'reject')} className="flex items-center gap-1 bg-red-500 text-gray-900 text-xs px-2 py-1 rounded hover:bg-red-600"><XCircle size={14}/> Reject</button>
                                                </div>
                                            )}

                                            {/* Delete button wrapper */}
                                            {(isAdmin || isMine) && (
                                                <button 
                                                    onClick={() => handleDeleteMessage(msg._id)}
                                                    className={`absolute top-2 ${isMine ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:bg-red-500/20 rounded-lg`}
                                                    title="Delete message"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        
                        {/* Typing Indicator */}
                        {typingUsers.size > 0 && (
                            <div className="flex items-center gap-2 text-gray-500 text-xs mt-2 pl-4">
                                <Loader2 className="animate-spin" size={14} />
                                <span>
                                    {Array.from(typingUsers).join(', ')} {typingUsers.size > 1 ? 'are' : 'is'} typing...
                                </span>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 sm:p-6 bg-gray-50 border-t border-gray-200 ${!hasAccess ? 'pointer-events-none opacity-50' : ''}`}>
                        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                            
                            <div className="flex-grow relative bg-black/50 border border-gray-200 rounded-2xl flex items-end min-h-[56px] px-2 py-2 transition-all focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500">
                                <label className="cursor-pointer p-2 text-gray-500 hover:text-violet-600 transition-colors flex-shrink-0">
                                    <input 
                                        type="file" 
                                        accept="image/jpeg, image/png, image/webp"
                                        className="hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && file.size > 2 * 1024 * 1024) {
                                                toast.error("File is too large (max 2MB)");
                                                return;
                                            }
                                            setSelectedImage(file);
                                        }} 
                                    />
                                    <ImageIcon size={20} />
                                </label>
                                
                                <div className="flex-grow flex flex-col justify-center">
                                    {selectedImage && (
                                        <div className="flex items-center gap-2 mb-1 px-3 py-1 bg-violet-600/10 text-violet-600 text-xs rounded-lg w-max">
                                            <ImageIcon size={12} /> {selectedImage.name}
                                            <button type="button" onClick={() => setSelectedImage(null)} className="hover:text-gray-900"><XCircle size={14}/></button>
                                        </div>
                                    )}
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                            if (socketRef.current) {
                                                socketRef.current.emit('typing', { courseId, isTyping: e.target.value.length > 0 });
                                            }
                                        }}
                                        onBlur={() => {
                                            if (socketRef.current) {
                                                socketRef.current.emit('typing', { courseId, isTyping: false });
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="w-full bg-transparent border-none text-sm text-gray-900 placeholder:text-gray-400 px-2 py-1 max-h-32 resize-none focus:outline-none focus:ring-0"
                                        rows={Math.min(4, Math.max(1, newMessage.split('\n').length))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && !selectedImage) || uploading}
                                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white p-4 rounded-2xl transition-colors flex-shrink-0"
                            >
                                {uploading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;

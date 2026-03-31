import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Zap, Clock, Trophy, Search, Loader2, ChevronRight,
    User as UserIcon, Calendar, BookOpen, Plus, Edit, Trash2,
    CheckCircle, XCircle, Layout, ExternalLink, MoreVertical
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('courses'); // 'users' or 'courses'
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null });

    const fetchData = async () => {
        try {
            const [usersRes, statsRes, coursesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats'),
                api.get('/courses/admin/all')
            ]);
            setUsers(usersRes.data.data || []);
            setStats(statsRes.data.data || {});
            setCourses(coursesRes.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Access denied. Admin privileges required.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const triggerDelete = (id) => {
        setDeleteModal({ isOpen: true, courseId: id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.courseId) return;
        try {
            await api.delete(`/courses/${deleteModal.courseId}`);
            toast.success("Course deleted");
            setCourses(courses.filter(c => c._id !== deleteModal.courseId));
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setDeleteModal({ isOpen: false, courseId: null });
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            const res = await api.patch(`/courses/${id}/publish`);
            toast.success(`Course ${res.data.status}`);
            setCourses(courses.map(c => c._id === id ? { ...c, status: res.data.status } : c));
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
            <div className="w-full max-w-7xl">
                <div className="h-10 w-48 bg-[var(--color-surface-light)] rounded animate-pulse mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                     {[1,2,3,4].map(i => <div key={i} className="h-28 bg-[var(--color-surface-light)] rounded-2xl animate-pulse"></div>)}
                </div>
                <div className="h-96 w-full bg-[var(--color-surface-light)] rounded-2xl animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] text-white relative">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold mb-4 text-white">Admin Console</h1>
                        <p className="text-zinc-400">Manage platform users and course content.</p>
                    </div>
                    {activeTab === 'courses' && (
                        <Link
                            to="/admin/create-course"
                            className="btn btn-primary px-6 py-3 font-medium transition-all transform flex items-center gap-2 text-sm"
                        >
                            <Plus size={20} />
                            Create New Course
                        </Link>
                    )}
                </header>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center">
                        {error}
                    </div>
                )}

                {/* Platform Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="cyan" />
                    <StatCard icon={BookOpen} label="Total Courses" value={courses.length} color="violet" />
                    <StatCard icon={Clock} label="Learning Hours" value={Math.round((stats?.totalLearningTime || 0) / 60)} color="blue" />
                    <StatCard icon={CheckCircle} label="Published" value={courses.filter(c => c.status === 'published').length} color="orange" />
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-zinc-800">
                    <button
                        onClick={() => { setActiveTab('courses'); setSearchTerm(""); }}
                        className={`pb-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'courses' ? 'text-cyan-400 border-cyan-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                    >
                        Course Management
                    </button>
                    <button
                        onClick={() => { setActiveTab('users'); setSearchTerm(""); }}
                        className={`pb-4 px-2 font-bold text-sm transition-all border-b-2 ${activeTab === 'users' ? 'text-cyan-400 border-cyan-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                    >
                        User Directory
                    </button>
                </div>

                {/* Management Section */}
                <div className="glass-card overflow-hidden p-0">
                    <div className="p-6 border-b border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            {activeTab === 'courses' ? <BookOpen size={20} className="text-violet-400" /> : <Users size={20} className="text-cyan-400" />}
                            {activeTab === 'courses' ? 'Platform Courses' : 'User Management'}
                        </h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <label htmlFor="admin-search" className="sr-only">Search</label>
                            <input
                                id="admin-search"
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--color-bg-dark)] border border-[var(--color-border-subtle)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'courses' ? (
                                <motion.table
                                    key="courses-table"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full text-left"
                                >
                                    <thead>
                                        <tr className="text-xs font-semibold text-zinc-400 uppercase tracking-widest bg-[var(--color-surface-light)]/20">
                                            <th className="px-6 py-4">Course Info</th>
                                            <th className="px-6 py-4">Lessons</th>
                                            <th className="px-6 py-4">Difficulty</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border-subtle)]">
                                        {filteredCourses.map((course) => (
                                            <tr key={course._id} className="hover:bg-[var(--color-surface-light)] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={course.thumbnail} alt={course.title} className="w-12 h-8 rounded object-cover border border-zinc-800" />
                                                        <div>
                                                            <p className="font-bold text-sm text-white">{course.title}</p>
                                                            <p className="text-xs text-zinc-500">{course.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">
                                                    {course.lessons?.length || 0} Lessons
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs tracking-wider uppercase font-bold px-2.5 py-1 rounded border ${course.difficulty === 'Beginner' ? 'border-blue-500/20 text-blue-400 bg-blue-500/10' :
                                                        course.difficulty === 'Intermediate' ? 'border-cyan-500/20 text-cyan-400 bg-cyan-500/10' :
                                                            'border-indigo-500/20 text-indigo-400 bg-indigo-500/10'
                                                        }`}>
                                                        {course.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleTogglePublish(course._id)}
                                                        className={`flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg border transition-all hover:scale-105 ${course.status === 'published'
                                                            ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                                                            : 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                                                            }`}
                                                    >
                                                        {course.status === 'published' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        {course.status}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                                                            className="p-2 text-zinc-400 hover:text-indigo-400 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => triggerDelete(course._id)}
                                                            className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </motion.table>
                            ) : (
                                <motion.table
                                    key="users-table"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full text-left"
                                >
                                    <thead>
                                        <tr className="text-xs font-semibold text-zinc-400 uppercase tracking-widest bg-[var(--color-surface-light)]/20">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Activity Stats</th>
                                            <th className="px-6 py-4">Progress</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4 text-right">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border-subtle)]">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-[var(--color-surface-light)] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                            <UserIcon size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-white">{user.fullName}</p>
                                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Badge icon={Trophy} value={`${user.xp} XP`} color="violet" />
                                                        <Badge icon={Zap} value={`${user.streak}d`} color="orange" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-zinc-400 mb-1">{user.enrolledCourses?.length || 0} Enrolled</div>
                                                    <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (user.enrolledCourses?.length || 0) * 10)}%` }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-[var(--color-surface-light)] text-zinc-400 border border-[var(--color-border-subtle)]'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs text-zinc-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </motion.table>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Custom Confirm Delete Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Delete Course?</h3>
                                    <p className="text-zinc-400 text-sm mt-1">This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    onClick={() => setDeleteModal({ isOpen: false, courseId: null })}
                                    className="flex-1 py-2.5 rounded-xl font-medium bg-[var(--color-surface-light)] text-white hover:bg-[var(--color-border-hover)] transition-colors border border-[var(--color-border-subtle)]"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        cyan: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
        violet: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    };

    return (
        <div className="glass-card p-6 flex items-center gap-5">
            <div className={`p-4 rounded-2xl border ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black">{value}</p>
            </div>
        </div>
    );
};

const Badge = ({ icon: Icon, value, color }) => {
    const colors = {
        cyan: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20 text-indigo-400',
        violet: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20 text-cyan-400',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 text-blue-400',
        orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20 text-orange-400'
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase border ${colors[color]}`}>
            <Icon size={12} />
            {value}
        </span>
    );
};

export default AdminDashboard;

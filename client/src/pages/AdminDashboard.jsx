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

    const fetchData = async () => {
        try {
            const [usersRes, statsRes, coursesRes] = await Promise.all([
                api.get('/api/admin/users'),
                api.get('/api/admin/stats'),
                api.get('/api/courses/admin/all')
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

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.delete(`/api/courses/${id}`);
            toast.success("Course deleted");
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const handleTogglePublish = async (id) => {
        try {
            const res = await api.patch(`/api/courses/${id}/publish`);
            toast.success(`Course ${res.data.status}`);
            setCourses(courses.map(c => c._id === id ? { ...c, status: res.data.status } : c));
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-400" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-4">Admin <span className="text-gradient">Console</span></h1>
                        <p className="text-zinc-400">Manage platform users and course content.</p>
                    </div>
                    {activeTab === 'courses' && (
                        <Link
                            to="/admin/create-course"
                            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
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
                    <StatCard icon={Clock} label="Learning Hours" value={Math.round((stats?.totalLearningTime || 0) / 60)} color="emerald" />
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
                <div className="glass-card border-zinc-800 bg-zinc-900/20 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            {activeTab === 'courses' ? <BookOpen size={20} className="text-violet-400" /> : <Users size={20} className="text-cyan-400" />}
                            {activeTab === 'courses' ? 'Platform Courses' : 'User Management'}
                        </h2>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500"
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
                                        <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-black/20">
                                            <th className="px-6 py-4">Course Info</th>
                                            <th className="px-6 py-4">Lessons</th>
                                            <th className="px-6 py-4">Difficulty</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {filteredCourses.map((course) => (
                                            <tr key={course._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={course.thumbnail} alt={course.title} className="w-12 h-8 rounded object-cover border border-zinc-800" />
                                                        <div>
                                                            <p className="font-bold text-sm text-white">{course.title}</p>
                                                            <p className="text-[10px] text-zinc-500">{course.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">
                                                    {course.lessons?.length || 0} Lessons
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] tracking-widest uppercase font-black px-2 py-0.5 rounded border ${course.difficulty === 'Beginner' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                                            course.difficulty === 'Intermediate' ? 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5' :
                                                                'border-violet-500/20 text-violet-400 bg-violet-500/5'
                                                        }`}>
                                                        {course.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleTogglePublish(course._id)}
                                                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg border transition-all ${course.status === 'published'
                                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                                                : 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                                                            }`}
                                                    >
                                                        {course.status === 'published' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                        {course.status}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/admin/edit-course/${course._id}`)}
                                                            className="p-2 text-zinc-400 hover:text-cyan-400 bg-zinc-800/50 rounded-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCourse(course._id)}
                                                            className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-800/50 rounded-lg"
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
                                        <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-black/20">
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Activity Stats</th>
                                            <th className="px-6 py-4">Progress</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4 text-right">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                            <UserIcon size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-white">{user.fullName}</p>
                                                            <p className="text-[10px] text-zinc-500">{user.email}</p>
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
                                                    <div className="text-[10px] text-zinc-400 mb-1">{user.enrolledCourses?.length || 0} Enrolled</div>
                                                    <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, (user.enrolledCourses?.length || 0) * 10)}%` }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>
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
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        violet: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
        emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    };

    return (
        <div className="glass-card border-zinc-800 p-6 flex items-center gap-5">
            <div className={`p-4 rounded-2xl border ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </div>
    );
};

const Badge = ({ icon: Icon, value, color }) => {
    const colors = {
        cyan: 'text-cyan-400 bg-cyan-400/5',
        violet: 'text-violet-400 bg-violet-400/5',
        emerald: 'text-emerald-400 bg-emerald-400/5',
        orange: 'text-orange-400 bg-orange-400/5'
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-white/5 ${colors[color]}`}>
            <Icon size={8} />
            {value}
        </span>
    );
};

export default AdminDashboard;

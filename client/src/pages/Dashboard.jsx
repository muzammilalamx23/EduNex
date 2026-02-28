import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout, BookOpen, User, Settings, LogOut, Zap, Trophy, Clock, Loader2, Save, Github, Linkedin, Lock, ArrowRight, Compass, ShieldCheck, FileCheck, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SidebarLink = ({ icon: Icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

const ProfileSettings = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        linkedin: user?.linkedin || "",
        github: user?.github || "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/api/auth/profile', formData);
            // New backend: { success: true, message: '...' }
            setMessage({ type: 'success', text: response.data.message || 'Profile updated.' });
            onUpdate();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
                <p className="text-zinc-400">Manage your personal information and social links.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address (Read-only)</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">LinkedIn Profile</label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="linkedin.com/in/username"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">GitHub Profile</label>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="github.com/username"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </form>
        </motion.div>
    );
};

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const { logout } = useAuth();

    // fetchUserData runs on mount and after profile updates.
    // It fetches the user profile + course catalog together so that
    // enrolledCourses can be reconciled with the current catalog IDs.
    const fetchUserData = useCallback(async () => {
        try {
            const [userRes, coursesRes] = await Promise.all([
                api.get('/api/auth/user'),
                api.get('/api/courses')
            ]);

            // New backend response: { success, data: {...} }
            const profile = userRes.data.data;
            const catalog = coursesRes.data.data;

            // Reconcile enrolled course IDs against the live catalog
            const syncedCourses = (profile.enrolledCourses || [])
                .map((enrolled) => {
                    const live = catalog.find((c) => c.title === enrolled.title);
                    return live ? { ...enrolled, courseId: live._id } : null;
                })
                .filter(Boolean);

            // Deduplicate by title (guards against legacy duplicate DB entries)
            const uniqueCourses = syncedCourses.reduce((acc, cur) => {
                return acc.find((x) => x.title === cur.title) ? acc : [...acc, cur];
            }, []);

            setUserData({ ...profile, enrolledCourses: uniqueCourses });
        } catch {
            toast.error('Session expired. Please log in again.');
            logout();
            navigate('/auth');
        } finally {
            setLoading(false);
        }
    }, [navigate, logout]); // stable deps — navigate and logout never change

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); // FIX: correct dependency array

    const handleLogout = () => {
        logout(); // AuthContext clears token + user state
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] text-white flex">
                <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col hidden lg:flex fixed h-full">
                    <div className="flex items-center mb-10 px-2 animate-pulse">
                        <div className="h-8 bg-zinc-800 rounded w-32"></div>
                    </div>
                    <div className="space-y-4 flex-1 w-full px-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-10 bg-zinc-800/50 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-12 bg-zinc-800/50 rounded-xl animate-pulse mt-auto mx-2"></div>
                </aside>
                <main className="flex-1 p-8 md:p-12 overflow-y-auto ml-0 lg:ml-64">
                    <header className="flex justify-between items-center mb-10">
                        <div className="space-y-3">
                            <div className="h-8 bg-zinc-800 rounded w-64 animate-pulse"></div>
                            <div className="h-4 bg-zinc-800/50 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-zinc-800 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-10 bg-zinc-800 rounded-xl animate-pulse"></div>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card h-36 bg-zinc-900/50 border-zinc-800/50 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                    <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-64 bg-zinc-900/50 border-zinc-800/50 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    const formatLearningTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col hidden lg:flex fixed h-full">
                <Link to="/" className="flex items-center mb-10 px-2">
                    <span className="text-2xl font-black tracking-tighter text-white">Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Nex</span></span>
                </Link>

                <nav className="space-y-2 flex-1">
                    <SidebarLink icon={Layout} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarLink icon={BookOpen} label="My Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                    <SidebarLink icon={Compass} label="Explore Catalog" onClick={() => navigate('/courses')} />
                    <SidebarLink icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    {/* FIX: Settings now routes to Profile tab instead of being a dead link */}
                    <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('profile')} />
                    {userData?.role === 'admin' && (
                        <SidebarLink icon={ShieldCheck} label="Admin Panel" onClick={() => navigate('/admin')} />
                    )}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors mt-auto"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto ml-0 lg:ml-64">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-white">
                            {activeTab === 'overview' ? `Welcome back, ${userData?.fullName.split(' ')[0]}!` : activeTab === 'courses' ? 'My Learning Path' : 'Profile Management'}
                        </h1>
                        <div className="flex flex-col gap-1">
                            <div className="text-zinc-400">
                                {activeTab === 'overview' ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            Your current streak: <span className="text-cyan-400 font-bold">{userData?.streak || 0} Days 🔥</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {userData?.dailyLearningTime >= 30 ? (
                                                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                                    <Zap size={12} /> Daily Goal Met! (+1 day added)
                                                </span>
                                            ) : (
                                                <span className="text-zinc-500">
                                                    Learn {30 - (userData?.dailyLearningTime || 0)} more minutes today to increase your streak
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : activeTab === 'courses' ? (
                                    `You are currently enrolled in ${userData?.enrolledCourses?.length || 0} courses.`
                                ) : (
                                    'Keep your professional details up to date.'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {userData?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-all"
                            >
                                <ShieldCheck size={18} />
                                Admin Panel
                            </Link>
                        )}
                        <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors relative">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full"></span>
                            <Zap size={20} />
                        </button>
                        <img
                            src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=06b6d4&color=fff&rounded=true`}
                            className="w-10 h-10 rounded-xl border border-zinc-800 cursor-pointer"
                            alt="Avatar"
                            onClick={() => setActiveTab('profile')}
                        />
                    </div>
                </header>

                {activeTab === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                            {/* Daily Goal Tracker */}
                            <div className="glass-card bg-cyan-500/5 border-cyan-500/10 flex flex-col items-center justify-center py-6">
                                <div className="relative w-24 h-24 mb-4">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-white/5"
                                        />
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 * (1 - Math.min((userData?.dailyLearningTime || 0) / 30, 1))}
                                            className="text-cyan-500 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-black text-white">{Math.min(Math.round((userData?.dailyLearningTime || 0) / 30 * 100), 100)}%</span>
                                    </div>
                                </div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Daily Goal</h3>
                                <p className="text-sm font-bold text-cyan-400">{userData?.dailyLearningTime || 0}/30 mins</p>
                            </div>

                            <div className="glass-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total XP</h3>
                                    <p className="text-xl font-black text-white">{userData?.xp?.toLocaleString() || 0}</p>
                                </div>
                            </div>
                            <div className="glass-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Completed</h3>
                                    <p className="text-xl font-black text-white">{userData?.coursesCompleted || 0} Courses</p>
                                </div>
                            </div>
                            <div className="glass-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Learning Time</h3>
                                    <p className="text-xl font-black text-white">{formatLearningTime(userData?.learningTime || 0)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white text-gradient inline-block">Continue Learning</h2>
                            {userData?.enrolledCourses?.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('courses')}
                                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                                >
                                    View All Courses <ArrowRight size={14} />
                                </button>
                            )}
                        </div>

                        {userData?.enrolledCourses?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userData.enrolledCourses.slice(0, 3).map((course) => (
                                    <div
                                        key={course.courseId}
                                        onClick={() => navigate(`/course/${course.courseId}`)}
                                        className="glass-card group cursor-pointer overflow-hidden border-zinc-800 hover:border-cyan-500/30 transition-all duration-500"
                                    >
                                        <div className="h-40 bg-zinc-900 mb-4 rounded-xl relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 font-bold text-white drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                                                {course.title.split(':')[0]}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm mb-3 text-zinc-300 line-clamp-1">{course.title}</h4>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mr-4 border border-white/5">
                                                <div
                                                    className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-cyan-400 font-bold tabular-nums">{course.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-zinc-800 bg-zinc-900/20"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-500">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No active courses yet</h3>
                                <p className="text-zinc-500 max-w-sm mb-8">You haven't enrolled in any courses yet. Start your journey by browsing our curated tech curriculum.</p>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 group"
                                >
                                    Explore Courses
                                    <Zap size={18} className="group-hover:fill-current" />
                                </button>
                            </motion.div>
                        )}
                    </>
                ) : activeTab === 'courses' ? (
                    <div className="space-y-6">
                        {userData?.enrolledCourses?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userData.enrolledCourses.map((course) => (
                                    <div key={course.courseId} className="glass-card group cursor-pointer overflow-hidden border-zinc-800 hover:border-cyan-500/30 transition-all duration-500">
                                        <div className="h-40 bg-zinc-900 mb-4 rounded-xl relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 font-bold text-white drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-2">
                                                {course.title.split(':')[0]}
                                                {course.progress === 100 && <FileCheck size={16} className="text-emerald-400" />}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm mb-3 text-zinc-300 line-clamp-1">{course.title}</h4>
                                        <div className="flex justify-between items-center text-xs mb-4">
                                            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mr-4 border border-white/5">
                                                <div
                                                    className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-cyan-400 font-bold tabular-nums">{course.progress}%</span>
                                        </div>
                                        {course.progress === 100 ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toast.success('🎓 Certificate generation coming soon!'); }}
                                                className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white"
                                            >
                                                <FileCheck size={14} />
                                                Download Certificate
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate(`/course/${course.courseId}`)}
                                                className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                            >
                                                Continue Learning
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-zinc-800 bg-zinc-900/20">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-500">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No enrolled courses</h3>
                                <p className="text-zinc-500 max-w-sm mb-8">Your enrolled courses will appear here. Start by exploring our curriculum.</p>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                                >
                                    Explore Courses
                                    <Zap size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ProfileSettings user={userData} onUpdate={fetchUserData} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;

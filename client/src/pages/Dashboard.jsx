import React, { useState, useEffect, useCallback } from 'react';
import { Layout, BookOpen, User, Settings, LogOut, Zap, Trophy, Clock, Loader2, Save, Github, Linkedin, Lock, ArrowRight, Compass, ShieldCheck, FileCheck, Bell, BarChart2, Medal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SidebarLink = ({ icon: Icon, label, active = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-violet-100 text-violet-600 border border-violet-200' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
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
            const response = await api.put('/auth/profile', formData);
            // New backend: { success: true, message: '...' }
            setMessage({ type: 'success', text: response.data.message || 'Profile updated.' });
            onUpdate();
        } catch {
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
                <p className="text-gray-500">Manage your personal information and social links.</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-blue-500/10 text-violet-600 border border-blue-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Full Name</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address (Read-only)</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">LinkedIn Profile</label>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="linkedin.com/in/username"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">GitHub Profile</label>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="github.com/username"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-violet-500 transition-colors"
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
    const [generatingCertId, setGeneratingCertId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const { logout } = useAuth();

    // fetchUserData runs on mount and after profile updates.
    // The enrolled courses are now stored with proper ObjectId references,
    // so we trust the user document directly — no catalog reconciliation needed.
    const fetchUserData = useCallback(async () => {
        try {
            const userRes = await api.get('/auth/user');
            setUserData(userRes.data.data);
        } catch {
            toast.error('Session expired. Please log in again.');
            logout();
            navigate('/auth');
        } finally {
            setLoading(false);
        }
    }, [navigate, logout]);


    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); // FIX: correct dependency array

    const handleLogout = () => {
        logout(); // AuthContext clears token + user state
        navigate('/');
    };

    // Certificate feature removed for production stability

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900 flex">
                <aside className="w-64 border-r border-gray-200 p-6 flex flex-col hidden lg:flex fixed h-full">
                    <div className="flex items-center mb-10 px-2 animate-pulse">
                        <div className="h-8 bg-gray-100 rounded w-32"></div>
                    </div>
                    <div className="space-y-4 flex-1 w-full px-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-12 bg-gray-100 rounded-xl animate-pulse mt-auto mx-2"></div>
                </aside>
                <main className="flex-1 p-8 md:p-12 overflow-y-auto ml-0 lg:ml-64">
                    <header className="flex justify-between items-center mb-10">
                        <div className="space-y-3">
                            <div className="h-8 bg-gray-100 rounded w-64 animate-pulse"></div>
                            <div className="h-4 bg-gray-100 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse"></div>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="edu-card h-36 bg-white border-gray-100 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                    <div className="h-8 bg-gray-100 rounded w-48 animate-pulse mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="edu-card h-64 bg-white border-gray-100 animate-pulse rounded-2xl"></div>
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
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 p-6 flex flex-col hidden lg:flex fixed h-full">
                <Link to="/" className="flex items-center mb-10 px-2">
                    <span className="text-2xl font-black tracking-tighter text-gray-900">Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Nex</span></span>
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
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">
                            {activeTab === 'overview' ? `Welcome back, ${userData?.fullName.split(' ')[0]}!` : activeTab === 'courses' ? 'My Learning Path' : 'Profile Management'}
                        </h1>
                        <div className="flex flex-col gap-1">
                            <div className="text-gray-500">
                                {activeTab === 'overview' ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            Your current streak: <span className="text-violet-600 font-bold">{userData?.streak || 0} Days 🔥</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            {userData?.dailyLearningTime >= 30 ? (
                                                <span className="text-violet-600 flex items-center gap-1 font-medium">
                                                    <Zap size={12} /> Daily Goal Met! (+1 day added)
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
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
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-100 border border-violet-200 text-violet-600 text-sm font-bold hover:bg-violet-600/20 transition-all"
                            >
                                <ShieldCheck size={18} />
                                Admin Panel
                            </Link>
                        )}
                        <button className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors relative">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full"></span>
                            <Zap size={20} />
                        </button>
                        <img
                            src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=00FF00&color=000&rounded=true`}
                            className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer"
                            alt="Avatar"
                            onClick={() => setActiveTab('profile')}
                        />
                    </div>
                </header>

                {activeTab === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                            {/* Daily Goal Tracker */}
                            <div className="edu-card bg-violet-600/5 border-violet-200 flex flex-col items-center justify-center py-6">
                                <div className="relative w-24 h-24 mb-4">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-900/5"
                                        />
                                        <circle
                                            cx="48" cy="48" r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 * (1 - Math.min((userData?.dailyLearningTime || 0) / 30, 1))}
                                            className="text-violet-600 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-black text-gray-900">{Math.min(Math.round((userData?.dailyLearningTime || 0) / 30 * 100), 100)}%</span>
                                    </div>
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Goal</h3>
                                <p className="text-sm font-bold text-violet-600">{userData?.dailyLearningTime || 0}/30 mins</p>
                            </div>

                            <div className="edu-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total XP</h3>
                                    <p className="text-xl font-black text-gray-900">{userData?.xp?.toLocaleString() || 0}</p>
                                </div>
                            </div>
                            <div className="edu-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-teal-50 rounded-xl text-violet-400">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Completed</h3>
                                    <p className="text-xl font-black text-gray-900">{userData?.coursesCompleted || 0} Courses</p>
                                </div>
                            </div>
                            <div className="edu-card bg-white/5 border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-violet-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Learning Time</h3>
                                    <p className="text-xl font-black text-gray-900">{formatLearningTime(userData?.learningTime || 0)}</p>
                                </div>
                            </div>
                        </div>

                                                {/* --- NEW SECTION: Activity & Badges --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                            {/* Weekly Activity Heatmap */}
                            <div className="xl:col-span-2 edu-card bg-white border-gray-200 p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <BarChart2 size={18} className="text-violet-600" />
                                        Weekly Activity
                                    </h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last 7 Days</span>
                                </div>
                                <div className="flex items-end justify-between h-40 gap-2 mt-auto">
                                    {Array.from({ length: 7 }).map((_, i) => {
                                        const d = new Date();
                                        d.setDate(d.getDate() - (6 - i));
                                        const dateStr = d.toISOString().split('T')[0];
                                        const log = userData?.activityLog?.find(l => l.date === dateStr);
                                        const mins = log ? log.minutes : (i === 6 ? (userData?.dailyLearningTime || 0) : 0);
                                        const height = Math.max(10, Math.min(100, (mins / 60) * 100));
                                        const dayName = i === 6 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
                                        return (
                                            <div key={i} className="flex flex-col items-center flex-1 gap-2 group h-full justify-end">
                                                <div className="w-full bg-gray-50 rounded-t-lg flex items-end relative overflow-hidden group-hover:bg-gray-100 transition-colors" style={{ height: '100%' }}>
                                                    <div 
                                                        className="w-full bg-gradient-to-t from-violet-500 to-indigo-400 rounded-t-lg transition-all duration-1000 ease-out"
                                                        style={{ height: `${height}%` }}
                                                    ></div>
                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        {mins}m
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{dayName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Achievements / Badges */}
                            <div className="edu-card bg-white border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Medal size={18} className="text-amber-500" />
                                        Achievements
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${userData?.streak >= 3 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">3-Day Streak</h4>
                                            <p className="text-[10px] text-gray-500">Learn 3 days in a row</p>
                                        </div>
                                    </div>
                                    
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${userData?.xp >= 500 ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                                            <Trophy size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">Rising Star</h4>
                                            <p className="text-[10px] text-gray-500">Earn 500 total XP</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${userData?.coursesCompleted >= 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                            <BookOpen size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">First Steps</h4>
                                            <p className="text-[10px] text-gray-500">Complete your first course</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 text-gradient inline-block">Continue Learning</h2>
                            {userData?.enrolledCourses?.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('courses')}
                                    className="text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
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
                                        className="edu-card group cursor-pointer overflow-hidden border-gray-200 hover:border-violet-300 transition-all duration-500"
                                    >
                                        <div className="h-40 bg-white mb-4 rounded-xl relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 font-bold text-gray-900 drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                                                {course.title.split(':')[0]}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm mb-3 text-gray-700 line-clamp-1">{course.title}</h4>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mr-4 border border-white/5">
                                                <div
                                                    className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-violet-600 font-bold tabular-nums">{course.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="edu-card p-12 flex flex-col items-center justify-center text-center border-dashed border-gray-200 bg-gray-50"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 text-gray-400">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No active courses yet</h3>
                                <p className="text-gray-400 max-w-sm mb-8">You haven't enrolled in any courses yet. Start your journey by browsing our curated tech curriculum.</p>
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
                                    <div key={course.courseId} className="edu-card group cursor-pointer overflow-hidden border-gray-200 hover:border-violet-300 transition-all duration-500">
                                        <div className="h-40 bg-white mb-4 rounded-xl relative overflow-hidden">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 font-bold text-gray-900 drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-2">
                                                {course.title.split(':')[0]}
                                                {course.progress === 100 && <FileCheck size={16} className="text-violet-600" />}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm mb-3 text-gray-700 line-clamp-1">{course.title}</h4>
                                        <div className="flex justify-between items-center text-xs mb-4">
                                            <div className="w-full bg-white h-1.5 rounded-full overflow-hidden mr-4 border border-white/5">
                                                <div
                                                    className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-violet-600 font-bold tabular-nums">{course.progress}%</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/course/${course.courseId}`)}
                                            className="w-full py-2.5 rounded-lg bg-gray-100 hover:bg-violet-600 hover:text-white text-gray-900 text-xs font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                        >
                                            {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="edu-card p-12 flex flex-col items-center justify-center text-center border-dashed border-gray-200 bg-gray-50">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 text-gray-400">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No enrolled courses</h3>
                                <p className="text-gray-400 max-w-sm mb-8">Your enrolled courses will appear here. Start by exploring our curriculum.</p>
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

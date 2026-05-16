import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Clock,
    Star,
    PlayCircle,
    BookOpen,
    CheckCircle2,
    Users,
    Globe,
    Zap,
    ArrowRight,
    Loader2,
    Calendar,
    Layout,
    Code2,
    Cpu,
    Video,
    Bot,
    MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    // 1. Fetch Course Data initially
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                setCourse(res.data.data);
            } catch {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    // 2. Check Enrollment Status silently when user or course updates
    useEffect(() => {
        if (user && course) {
            const enrolled = (user.enrolledCourses || []).find(
                (c) => c.courseId === courseId
            );
            if (enrolled) setIsEnrolled(true);
        }
    }, [user, course, courseId]);

    const handleEnroll = async () => {
        try {
            if (!user) {
                toast.error('Please log in to enroll.');
                navigate('/auth');
                return;
            }

            setIsEnrolling(true);
            await api.post('/auth/enroll', {
                courseId: course._id,
                title: course.title,
                thumbnail: course.thumbnail,
            });
            
            // Re-sync global context so enrolledCourses gets populated instantly
            await refreshUser();
            
            setIsEnrolled(true);
            toast.success('Successfully enrolled! Starting your journey...');
            navigate(`/course/${course._id}`);
        } catch {
            const msg = err.response?.data?.message || 'Enrollment failed. Please try again.';
            toast.error(msg);
        } finally {
            setIsEnrolling(false);
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
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
                <button
                    onClick={() => navigate('/courses')}
                    className="px-6 py-2 bg-violet-600 text-white font-bold rounded-xl"
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    const isHtmlCss = course.title.toLowerCase().includes('html') || course.title.toLowerCase().includes('css');
    const isJs = course.title.toLowerCase().includes('javascript') || course.title.toLowerCase().includes('js');

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-violet-500/30 relative overflow-x-hidden">
            <BackgroundAnimation />
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 relative">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center gap-2 text-gray-400 hover:text-violet-600 transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Explorer</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-[10px] font-bold uppercase tracking-wider mb-6 inline-block">
                                {course.difficulty} Specialization
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-gray-500 text-xl leading-relaxed mb-8 max-w-3xl">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 mb-12">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock size={20} className="text-violet-600" />
                                    <span className="font-medium">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Star size={20} className="text-yellow-500" fill="currentColor" />
                                    <span className="font-medium">{course.rating} Rating</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users size={20} className="text-violet-500" />
                                    <span className="font-medium">2.4k Students</span>
                                </div>
                            </div>

                            {/* Curriculum Section */}
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                                    <BookOpen className="text-violet-600" />
                                    Course Curriculum
                                </h2>
                                <div className="space-y-4">
                                    {(course.lessons || []).map((lesson, idx) => {
                                        const showSectionHeader = idx === 0 || (lesson.section && lesson.section !== (course.lessons[idx - 1].section));
                                        const isHeadingType = lesson.type === 'heading';
                                        return (
                                            <React.Fragment key={idx}>
                                                {showSectionHeader && lesson.section && (
                                                    <div className="flex items-center gap-4 pt-6 pb-2 first:pt-0">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                                                            {lesson.section}
                                                        </span>
                                                    </div>
                                                )}
                                                {isHeadingType ? (
                                                    <div className="pt-8 pb-4">
                                                        <h3 className="text-xl font-black text-gray-900 border-l-4 border-violet-600 pl-4 uppercase tracking-tight">
                                                            {lesson.title}
                                                        </h3>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-200 transition-all flex items-center justify-between group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200 group-hover:bg-violet-50 group-hover:text-violet-600 group-hover:border-violet-600/30 transition-all">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors uppercase text-sm tracking-tight">{lesson.title}</h3>
                                                                <p className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                                                                    <span className="flex items-center gap-1"><Video size={12} /> Video</span>
                                                                    {lesson.duration > 0 && (
                                                                        <span className="flex items-center gap-1"><Clock size={12} /> {lesson.duration}m</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <PlayCircle className="text-violet-600" size={24} />
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Specific Details for HTML/CSS or JS */}
                            {(isHtmlCss || isJs) && (
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-violet-100 mb-16">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <Zap className="text-yellow-500" />
                                        What tools you'll master
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {isHtmlCss && (
                                            <>
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                                        <Layout size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-1">Semantic Architecture</h4>
                                                        <p className="text-sm text-gray-500">Structure web content for accessibility and SEO perfection.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-600">
                                                        <Code2 size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-1">Modern Layouts</h4>
                                                        <p className="text-sm text-gray-500">Deep dive into CSS Grid, Flexbox, and responsive workflows.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {isJs && (
                                            <>
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                                        <Cpu size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-1">Core Logic</h4>
                                                        <p className="text-sm text-gray-500">Master asynchronous patterns, closures, and the event loop.</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-600">
                                                        <Globe size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-1">DOM Manipulation</h4>
                                                        <p className="text-sm text-gray-500">Create interactive cinematic experiences with pure vanilla JS.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="mt-8 p-6 bg-indigo-600/10 border border-indigo-100 rounded-2xl flex flex-col md:flex-row items-center justify-between group cursor-pointer hover:bg-indigo-600/20 transition-all gap-4 text-left" onClick={() => navigate('/playground')}>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600/20 text-indigo-600 border border-indigo-100 uppercase tracking-wider">New Feature</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                                                <Bot className="text-indigo-600" size={24} /> AI Interactive Playground
                                            </h3>
                                            <p className="text-sm text-gray-500">Practice what you learn with a real-time AI Coach guiding you step-by-step.</p>
                                        </div>
                                        <div className="md:shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column: Sticky Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="edu-card bg-white/40 border-gray-200 p-8 rounded-3xl overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 blur-[80px] -z-10"></div>

                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-48 object-cover rounded-2xl mb-8 shadow-2xl"
                                />

                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-3xl font-black text-gray-900">FREE <span className="text-xs text-gray-400 line-through font-normal ml-2">$99.00</span></span>
                                    <div className="px-3 py-1 bg-indigo-600/10 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100">
                                        100% OFF
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <CheckCircle2 size={16} className="text-violet-600" />
                                        Full lifetime access
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <CheckCircle2 size={16} className="text-violet-600" />
                                        Certificate of completion
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <CheckCircle2 size={16} className="text-violet-600" />
                                        Hands-on projects
                                    </div>
                                </div>

                                <button
                                    onClick={isEnrolled ? () => navigate(`/course/${course._id}`) : handleEnroll}
                                    disabled={isEnrolling}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${isEnrolled
                                        ? 'bg-indigo-600 text-gray-900 shadow-indigo-500/20'
                                        : 'bg-violet-600 text-white hover:bg-violet-700 hover:text-gray-900 shadow-white/10'
                                        }`}
                                >
                                    {isEnrolling ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : isEnrolled ? (
                                        <>
                                            Continue Learning
                                            <ArrowRight size={20} />
                                        </>
                                    ) : (
                                        <>
                                            Enroll in {course.title.split(':')[0]}
                                            <PlayCircle size={20} />
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => navigate(`/course-detail/${course._id}/community`)}
                                    className="w-full py-4 mt-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg bg-gray-100 text-gray-900 hover:bg-violet-50 hover:text-violet-600 border border-gray-200/50 hover:border-violet-600/30"
                                >
                                    <MessageSquare size={20} />
                                    Course Community
                                </button>

                                <p className="text-[10px] text-center text-gray-400 mt-6 font-medium">
                                    Join 120+ students starting today. Secure your spot now.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CourseDetail;

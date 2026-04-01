import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, CheckCircle2, Trophy, Clock, BookOpen, ChevronRight, Menu, X, FileText, Zap, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizCorrect, setQuizCorrect] = useState(null);

    const handleLessonComplete = async () => {
        setIsCompleting(true);
        try {
            const res = await api.post('/auth/lesson-complete', {
                courseId,
                xpGain: 100,
            });

            setProgress(res.data.data.progress);

            const currentIndex = course.lessons.findIndex(l => l._id === activeLesson._id || l.title === activeLesson.title);

            if (currentIndex < course.lessons.length - 1) {
                setActiveLesson(course.lessons[currentIndex + 1]);
                toast.success("Lesson completed! Moving to next section.");
            } else {
                toast.success("🎉 Congratulations! You've completed the course!");
                navigate('/dashboard');
            }
        } catch {
            toast.error('Failed to save progress. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    const handlePreviousLesson = () => {
        const currentIndex = course.lessons.findIndex(l => l._id === activeLesson._id || l.title === activeLesson.title);
        if (currentIndex > 0) {
            setActiveLesson(course.lessons[currentIndex - 1]);
        }
    };

    const isFirstLesson = (() => {
        if (!course || !activeLesson) return true;
        return course.lessons[0]?.title === activeLesson.title;
    })();

    useEffect(() => {
        let timeInterval;

        const fetchCourse = async () => {
            try {
                const [courseRes, profileRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get('/auth/user')
                ]);

                const fetchedCourse = courseRes.data.data;
                const profile = profileRes.data.data;

                setCourse(fetchedCourse);

                const enrollment = (profile.enrolledCourses || []).find(
                    (c) => c.courseId === courseId
                );
                if (enrollment) setProgress(enrollment.progress);

                if (fetchedCourse.lessons?.length > 0) {
                    setActiveLesson(fetchedCourse.lessons[0]);
                }
            } catch {
                toast.error('Could not load this course. Redirecting...');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();

        timeInterval = setInterval(async () => {
            try {
                await api.post('/auth/update-time', { minutes: 1 });
            } catch { }
        }, 60000);

        return () => clearInterval(timeInterval);
    }, [courseId, navigate]);

    const handleLessonClick = (lesson) => {
        setActiveLesson(lesson);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col h-screen overflow-hidden">
            {/* Player Header */}
            <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-bold text-sm md:text-base line-clamp-1">{course?.title}</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Module: {activeLesson?.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Learning Progress</span>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                                />
                            </div>
                            <span className="text-xs font-bold text-cyan-400">{progress}%</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Player Area */}
                <main className={`flex-1 overflow-y-auto transition-all duration-500 ${sidebarOpen ? 'mr-0' : 'mr-0'}`}>
                    <div className="max-w-5xl mx-auto p-4 md:p-8">

                        {/* Dynamic Lesson Content */}
                        <div className="space-y-8">
                            {activeLesson?.videoUrl ? (
                                <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative group">
                                    <iframe
                                        className="w-full h-full"
                                        src={`${activeLesson.videoUrl.includes('youtube.com') ? activeLesson.videoUrl.replace('watch?v=', 'embed/') : activeLesson.videoUrl}?autoplay=0&rel=0`}
                                        title={activeLesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : activeLesson?.pdfUrl ? (
                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-4 shadow-2xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 px-4 pt-2">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                            <FileText size={18} />
                                            Reading Material (PDF)
                                        </div>
                                        <a
                                            href={activeLesson.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors border border-zinc-700 font-black uppercase tracking-widest"
                                        >
                                            Open Full Screen
                                        </a>
                                    </div>
                                    <iframe
                                        src={`${activeLesson.pdfUrl}#toolbar=0`}
                                        className="w-full h-[600px] rounded-2xl border-none bg-white/5"
                                        title="PDF Viewer"
                                    ></iframe>
                                </div>
                            ) : activeLesson?.content ? (
                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[400px]">
                                    <div className="max-w-3xl mx-auto prose prose-invert">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                                <Layout size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold">Lesson Notes</h3>
                                        </div>
                                        <div className="text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap font-medium text-lg">
                                            {activeLesson?.content}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-zinc-900 rounded-3xl flex flex-col items-center justify-center border border-zinc-800">
                                    <Play size={48} className="text-zinc-700 mb-4" />
                                    <p className="text-zinc-500">No content available for this lesson</p>
                                </div>
                            )}

                            {/* Supplementary Notes (If video is present but notes also exist) */}
                            {activeLesson?.videoUrl && (activeLesson?.pdfUrl || activeLesson?.content) && (
                                <div className="mt-12 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-8">
                                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Zap size={18} className="text-amber-400" />
                                        Lesson Resources & Notes
                                    </h4>
                                    <div className="space-y-6">
                                        {activeLesson?.content && (
                                            <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm">
                                                {activeLesson.content}
                                            </div>
                                        )}
                                        {activeLesson?.pdfUrl && (
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-zinc-800">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">Study Material.pdf</p>
                                                    <p className="text-xs text-zinc-500">Downloadable reference for this lesson</p>
                                                </div>
                                                <a
                                                    href={activeLesson.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold transition-all border border-zinc-700"
                                                >
                                                    View PDF
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content Info */}
                        <div className="mt-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase">
                                    {activeLesson?.type || 'video'}
                                </span>
                                <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
                                    <Clock size={14} />
                                    {activeLesson?.duration}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">{activeLesson?.title}</h2>
                            <p className="text-zinc-400 leading-relaxed max-w-3xl">
                                {course?.description}
                            </p>

                            <div className="mt-12 pt-8 border-t border-zinc-900 flex justify-between">
                                <button
                                    onClick={handlePreviousLesson}
                                    disabled={isFirstLesson}
                                    className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                    aria-label="Previous lesson"
                                >
                                    <ChevronLeft size={18} />
                                    Previous Lesson
                                </button>
                                <button
                                    onClick={handleLessonComplete}
                                    disabled={isCompleting}
                                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isCompleting ? "Updating..." : "Complete & Next"}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Sidebar Curriculum */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="w-80 md:w-96 border-l border-zinc-900 bg-zinc-950 flex flex-col h-full z-40 fixed right-0 top-16 md:relative md:top-0"
                        >
                            <div className="p-6 border-b border-zinc-900">
                                <h3 className="font-bold">Course Curriculum</h3>
                                <p className="text-xs text-zinc-500 mt-1">{course?.lessons?.length || 0} Lessons • Total Progress: {progress}%</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="space-y-1">
                                    {(course?.lessons || []).map((lesson, idx) => {
                                        const isActive = activeLesson?.title === lesson.title;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleLessonClick(lesson)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'hover:bg-zinc-900 border border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500 text-black' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                                                    <Play size={14} fill={isActive ? "currentColor" : "none"} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-medium line-clamp-1">{lesson.title}</p>
                                                    <p className="text-[10px] opacity-60 font-medium">{lesson.duration}</p>
                                                </div>
                                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CoursePlayer;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Play, CheckCircle2, ChevronRight,
    Menu, X, FileText, Zap, Layout, Clock, Lock,
    Trophy, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import YouTubePlayer from '../components/YouTubePlayer';

// ─── CircularProgress ─────────────────────────────────────────────────────────
// SVG-based circular progress ring for the header HUD.
const CircularProgress = ({ value = 0, size = 40, stroke = 3 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="url(#prog)" strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
                <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
            </defs>
        </svg>
    );
};

// ─── CoursePlayer ─────────────────────────────────────────────────────────────
const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // ── Core state ────────────────────────────────────────────────────────────
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);

    // ── Progress state (from DB) ───────────────────────────────────────────────
    const [progress, setProgress] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]); // string IDs
    const [lastLessonId, setLastLessonId] = useState(null);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    // ── Completion unlock state ───────────────────────────────────────────────
    // canComplete = true when the user has watched the video (or there is no video)
    // and they can click "Complete & Next".
    const [canComplete, setCanComplete] = useState(false);
    const videoWatchedRef = useRef(false); // stable ref so setInterval callbacks can read it

    // ── Save position debounce ────────────────────────────────────────────────
    const savePositionTimeout = useRef(null);

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const isLessonDone = useCallback(
        (lessonId) => completedLessons.includes(lessonId?.toString()),
        [completedLessons]
    );

    const getLessonIndex = useCallback(
        (lesson) => (course?.lessons || []).findIndex(l => l._id === lesson?._id),
        [course]
    );

    // ─── Switch active lesson ─────────────────────────────────────────────────
    // Called whenever the user clicks a sidebar item or Next/Previous.
    // - Resets canComplete (must re-watch or there's no video)
    // - Saves position to DB (debounced 600 ms)
    const switchLesson = useCallback((lesson) => {
        if (!lesson) return;
        setActiveLesson(lesson);
        videoWatchedRef.current = false;

        // If the lesson has no video, unlock immediately (read-only or PDF lesson)
        const hasVideo = Boolean(lesson.videoId);
        setCanComplete(!hasVideo);

        // Persist position — debounced to avoid flooding on rapid clicks
        clearTimeout(savePositionTimeout.current);
        savePositionTimeout.current = setTimeout(() => {
            api.post('/auth/save-position', { courseId, lessonId: lesson._id })
                .catch(() => {}); // fire-and-forget, non-critical
        }, 600);
    }, [courseId]);

    // ─── Initial data load ────────────────────────────────────────────────────
    useEffect(() => {
        let timeInterval;

        const fetchAll = async () => {
            try {
                // Course data and user progress fetched in parallel
                const [courseRes, progressRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/auth/progress/${courseId}`),
                ]);

                const fetchedCourse = courseRes.data.data;
                const progressData = progressRes.data.data;

                setCourse(fetchedCourse);
                setProgress(progressData.progress || 0);
                setCompletedLessons(progressData.completedLessons || []);
                setLastLessonId(progressData.lastLessonId || null);

                if (fetchedCourse.lessons?.length > 0) {
                    // Resume from lastLessonId if it exists, otherwise start at lesson 0
                    const resumeLesson = progressData.lastLessonId
                        ? fetchedCourse.lessons.find(
                            l => l._id.toString() === progressData.lastLessonId
                          ) || fetchedCourse.lessons[0]
                        : fetchedCourse.lessons[0];

                    switchLesson(resumeLesson);
                }
            } catch (err) {
                toast.error('Could not load this course. Redirecting...');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();

        // Learning time tracker — fires every 60 s
        timeInterval = setInterval(() => {
            api.post('/auth/update-time', { minutes: 1 }).catch(() => {});
        }, 60000);

        return () => {
            clearInterval(timeInterval);
            clearTimeout(savePositionTimeout.current);
        };
    }, [courseId, navigate, switchLesson]);

    // ─── Video completion unlock ───────────────────────────────────────────────
    // Simulates "video watched" after 80% of the lesson duration has elapsed.
    // Falls back to a minimum of 10 seconds for very short or 0-duration lessons.
    // Uses a ref so the setInterval callback stays fresh.
    useEffect(() => {
        if (!activeLesson?.videoId) return; // text/PDF lesson — already unlocked in switchLesson
        if (isLessonDone(activeLesson._id)) {
            setCanComplete(true); // already done — always unlocked
            return;
        }

        videoWatchedRef.current = false;
        setCanComplete(false);

        // Duration is stored in minutes; convert to seconds for the timer.
        const durationSec = activeLesson.duration
            ? Math.max(activeLesson.duration * 60 * 0.8, 10) // 80% of duration, min 10 s
            : 30; // default: 30 s if duration not set

        const timer = setTimeout(() => {
            videoWatchedRef.current = true;
            setCanComplete(true);
            toast('Great progress! You can now mark this lesson complete.', {
                icon: '▶️',
                duration: 3000,
            });
        }, durationSec * 1000);

        return () => clearTimeout(timer);
    }, [activeLesson, isLessonDone]);

    // ─── Mark complete ────────────────────────────────────────────────────────
    const handleLessonComplete = async () => {
        if (!activeLesson || isCompleting) return;
        setIsCompleting(true);

        try {
            const res = await api.post('/auth/lesson-complete', {
                courseId,
                lessonId: activeLesson._id,
            });

            const { progress: newProgress, completedLessons: newCompleted, alreadyCompleted } = res.data.data
                ? { ...res.data.data, alreadyCompleted: res.data.alreadyCompleted }
                : { progress: progress, completedLessons: completedLessons, alreadyCompleted: true };

            setProgress(newProgress ?? progress);
            setCompletedLessons(newCompleted ?? completedLessons);

            if (!alreadyCompleted) {
                toast.success('+100 XP earned! Lesson complete 🎉');
            }

            // Auto-advance to next lesson
            const currentIndex = getLessonIndex(activeLesson);
            const lessons = course.lessons;

            if (currentIndex < lessons.length - 1) {
                switchLesson(lessons[currentIndex + 1]);
            } else {
                toast.success('🏆 Course complete! You earned it.', { duration: 4000 });
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error('Failed to save progress. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    const handlePreviousLesson = () => {
        const idx = getLessonIndex(activeLesson);
        if (idx > 0) switchLesson(course.lessons[idx - 1]);
    };

    const isFirstLesson = getLessonIndex(activeLesson) === 0;
    const isLastLesson = course ? getLessonIndex(activeLesson) === course.lessons.length - 1 : false;
    const activeLessonDone = isLessonDone(activeLesson?._id);

    // ─── Loading spinner ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );

    const completedCount = completedLessons.length;
    const totalLessons = course?.lessons?.length || 0;

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col h-screen overflow-hidden">

            {/* ── Header ── */}
            <header className="h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-6 z-50 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                        aria-label="Back to dashboard"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="font-bold text-sm line-clamp-1">{course?.title}</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold line-clamp-1">
                            {activeLesson?.title}
                        </p>
                    </div>
                </div>

                {/* Progress HUD */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="relative">
                            <CircularProgress value={progress} size={42} stroke={3} />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">
                                {progress}%
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Progress</p>
                            <p className="text-xs font-bold text-cyan-400">{completedCount}/{totalLessons} lessons</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(s => !s)}
                        className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
                        aria-label="Toggle curriculum"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">

                {/* ── Main content area ── */}
                <main className={`flex-1 overflow-y-auto transition-all duration-500`}>
                    <div className="max-w-7xl mx-auto p-4 md:px-10 md:py-8 space-y-8">

                        {/* Lesson status badge */}
                        <div className="flex items-center gap-3">
                            {activeLessonDone ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                    <CheckCircle2 size={12} /> Completed
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                    <Play size={12} fill="currentColor" /> In Progress
                                </span>
                            )}
                            {activeLesson?.duration > 0 && (
                                <span className="flex items-center gap-1 text-zinc-500 text-xs">
                                    <Clock size={12} /> {activeLesson.duration} min
                                </span>
                            )}
                        </div>

                        {/* Video completion unlock hint */}
                        {activeLesson?.videoId && !canComplete && !activeLessonDone && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs font-medium"
                            >
                                <Lock size={14} className="shrink-0" />
                                Watch the video to unlock completion — or scroll down and click "I've Watched It" to unlock manually.
                            </motion.div>
                        )}

                        {/* ── Lesson content ── */}
                        <div className="space-y-6">
                            {activeLesson?.videoId ? (
                                <YouTubePlayer
                                    videoId={activeLesson.videoId}
                                    title={activeLesson.title}
                                    autoplay={false}
                                />
                            ) : activeLesson?.pdfUrl ? (
                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-4 shadow-2xl overflow-hidden">
                                    <div className="flex items-center justify-between mb-4 px-2 pt-1">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                                            <FileText size={16} /> Reading Material
                                        </div>
                                        <a
                                            href={activeLesson.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors border border-zinc-700 font-bold uppercase tracking-widest"
                                        >
                                            Open Full Screen
                                        </a>
                                    </div>
                                    <iframe
                                        src={`${activeLesson.pdfUrl}#toolbar=0`}
                                        className="w-full h-[600px] rounded-2xl border-none bg-white/5"
                                        title="PDF Viewer"
                                    />
                                </div>
                            ) : activeLesson?.content ? (
                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[300px]">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                            <Layout size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold">Lesson Notes</h3>
                                    </div>
                                    <div className="text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap font-medium text-base max-w-5xl">
                                        {activeLesson.content}
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-zinc-900 rounded-3xl flex flex-col items-center justify-center border border-zinc-800">
                                    <Play size={48} className="text-zinc-700 mb-4" />
                                    <p className="text-zinc-500 text-sm">No content available for this lesson.</p>
                                </div>
                            )}

                            {/* Supplementary notes when video + notes both exist */}
                            {activeLesson?.videoId && (activeLesson?.content || activeLesson?.pdfUrl) && (
                                <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-8">
                                    <h4 className="text-base font-bold mb-6 flex items-center gap-2">
                                        <Zap size={16} className="text-amber-400" />
                                        Lesson Resources
                                    </h4>
                                    <div className="space-y-4">
                                        {activeLesson.content && (
                                            <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm">
                                                {activeLesson.content}
                                            </div>
                                        )}
                                        {activeLesson.pdfUrl && (
                                            <a
                                                href={activeLesson.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-zinc-800 hover:border-zinc-700 transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">Study Material.pdf</p>
                                                    <p className="text-xs text-zinc-500">Open & download PDF reference</p>
                                                </div>
                                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Lesson info + navigation ── */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">{activeLesson?.title}</h2>
                            <p className="text-zinc-500 leading-relaxed max-w-5xl text-sm">{course?.description}</p>

                        <div className="mt-6 pt-6 border-t border-zinc-900 space-y-4">
                                {/* Manual unlock button — visible only when video not yet timed out */}
                                {activeLesson?.videoId && !canComplete && !activeLessonDone && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => {
                                            setCanComplete(true);
                                            videoWatchedRef.current = true;
                                        }}
                                        className="w-full px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Play size={16} />
                                        I've Watched This — Unlock Completion
                                    </motion.button>
                                )}

                                {/* Previous / Complete navigation row */}
                                <div className="flex justify-between items-center gap-4">
                                    <button
                                        onClick={handlePreviousLesson}
                                        disabled={isFirstLesson}
                                        className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                        aria-label="Previous lesson"
                                    >
                                        <ChevronLeft size={18} />
                                        Previous
                                    </button>

                                    {!activeLessonDone ? (
                                        <button
                                            onClick={handleLessonComplete}
                                            disabled={!canComplete || isCompleting}
                                            className="px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/20"
                                            aria-label="Complete lesson and go to next"
                                        >
                                            {isCompleting ? (
                                                <>Saving...</>
                                            ) : !canComplete ? (
                                                <><Lock size={15} /> Watch to Unlock</>
                                            ) : isLastLesson ? (
                                                <><Trophy size={15} /> Complete Course</>
                                            ) : (
                                                <>Complete &amp; Next <ChevronRight size={15} /></>
                                            )}
                                        </button>
                                    ) : (
                                        // Already done — just skip to next
                                        <button
                                            onClick={() => {
                                                const idx = getLessonIndex(activeLesson);
                                                if (idx < course.lessons.length - 1) {
                                                    switchLesson(course.lessons[idx + 1]);
                                                }
                                            }}
                                            disabled={isLastLesson}
                                            className="px-8 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-500/20"
                                        >
                                            <CheckCircle2 size={15} />
                                            {isLastLesson ? 'Course Complete' : 'Next Lesson'}
                                            {!isLastLesson && <ChevronRight size={15} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── Sidebar curriculum ── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: 320 }}
                            animate={{ x: 0 }}
                            exit={{ x: 320 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-80 border-l border-zinc-900 bg-zinc-950 flex flex-col h-full z-40 fixed right-0 top-16 lg:relative lg:top-0"
                        >
                            {/* Sidebar header */}
                            <div className="p-5 border-b border-zinc-900">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-sm">Course Curriculum</h3>
                                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20">
                                        {completedCount}/{totalLessons}
                                    </span>
                                </div>
                                {/* Linear progress bar */}
                                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                                    />
                                </div>
                            </div>

                            {/* Lesson list with section headers */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                                {(course?.lessons || []).map((lesson, idx) => {
                                    const isActive = activeLesson?._id === lesson._id;
                                    const isDone = isLessonDone(lesson._id);
                                    const isResume = lesson._id?.toString() === lastLessonId;

                                    // Render section header if it's the first lesson or the section changed
                                    const showSectionHeader = idx === 0 || (lesson.section && lesson.section !== (course.lessons[idx - 1].section));
                                    const isHeadingType = lesson.type === 'heading';

                                    return (
                                        <React.Fragment key={lesson._id || idx}>
                                            {showSectionHeader && lesson.section && (
                                                <div className="px-3 py-4 mt-2 flex items-center gap-2">
                                                    <div className="h-px bg-zinc-900 flex-1"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">
                                                        {lesson.section}
                                                    </span>
                                                    <div className="h-px bg-zinc-900 flex-1"></div>
                                                </div>
                                            )}

                                            {isHeadingType ? (
                                                <div className="px-3 py-6 mt-4 mb-2">
                                                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest border-l-2 border-cyan-500 pl-3">
                                                        {lesson.title}
                                                    </h4>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => switchLesson(lesson)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group text-left
                                                        ${isActive
                                                            ? 'bg-cyan-500/10 border border-cyan-500/20'
                                                            : 'hover:bg-zinc-900/60 border border-transparent'
                                                        }`}
                                                >
                                                    {/* Status icon */}
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                                                        ${isDone
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : isActive
                                                                ? 'bg-cyan-500 text-black'
                                                                : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'
                                                        }`}>
                                                        {isDone
                                                            ? <CheckCircle2 size={14} />
                                                            : isActive
                                                                ? <Play size={13} fill="currentColor" />
                                                                : <span className="text-[10px] font-black">{idx + 1}</span>
                                                        }
                                                    </div>

                                                    {/* Lesson info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-semibold line-clamp-2 leading-snug
                                                            ${isDone ? 'text-green-400/80' : isActive ? 'text-white' : 'text-zinc-400'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {lesson.duration > 0 && (
                                                                <span className="text-[10px] text-zinc-600">{lesson.duration} min</span>
                                                            )}
                                                            {isResume && !isDone && (
                                                                <span className="text-[10px] text-amber-400 font-bold">Resume</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Active pulse */}
                                                    {isActive && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                                                    )}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Sidebar footer — course completion stat */}
                            {progress >= 100 && (
                                <div className="p-4 border-t border-zinc-900 flex items-center gap-3 bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
                                    <Trophy size={20} className="text-amber-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white">Course Complete!</p>
                                        <p className="text-[10px] text-zinc-500">All lessons finished</p>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CoursePlayer;

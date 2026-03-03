import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Loader2, Video, FileText, Clock, Layout, Save, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const AdminCreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: 'Development',
        difficulty: 'Beginner',
        thumbnail: '',
        lessons: [
            { title: '', videoUrl: '', content: '', duration: '0:00' }
        ]
    });

    const handleLessonChange = (index, field, value) => {
        const newLessons = [...courseData.lessons];
        newLessons[index][field] = value;
        setCourseData({ ...courseData, lessons: newLessons });
    };

    const addLesson = () => {
        setCourseData({
            ...courseData,
            lessons: [...courseData.lessons, { title: '', videoUrl: '', content: '', duration: '0:00' }]
        });
    };

    const removeLesson = (index) => {
        if (courseData.lessons.length === 1) return;
        const newLessons = courseData.lessons.filter((_, i) => i !== index);
        setCourseData({ ...courseData, lessons: newLessons });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/courses', courseData);
            toast.success('Course created successfully!');
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <header className="mb-12">
                    <h1 className="text-4xl font-black mb-4">Create New <span className="text-gradient">Course</span></h1>
                    <p className="text-zinc-400">Add a new course to the platform with lessons and content.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="glass-card border-zinc-800 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                            <Layout size={20} />
                            Course Basics
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Course Title</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Master React in 30 Days"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Development, Design, Business"
                                    value={courseData.category}
                                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="What will students learn in this course?"
                                value={courseData.description}
                                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Difficulty</label>
                                <select
                                    value={courseData.difficulty}
                                    onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Thumbnail URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={courseData.thumbnail}
                                        onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Builder */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-violet-400 font-bold">
                                <Video size={20} />
                                Curriculum Builder
                            </div>
                            <button
                                type="button"
                                onClick={addLesson}
                                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors border border-zinc-700"
                            >
                                <Plus size={14} />
                                Add Lesson
                            </button>
                        </div>

                        <div className="space-y-4">
                            {courseData.lessons.map((lesson, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card border-zinc-800 bg-zinc-900/10 p-6 relative group"
                                >
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black border border-zinc-700">
                                        {index + 1}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-11 space-y-4">
                                            {/* Row 1: Title */}
                                            <input
                                                required
                                                placeholder="Lesson Title"
                                                value={lesson.title}
                                                onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                                className="w-full bg-black/20 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                            />

                                            {/* Row 2: Video & PDF */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                    <input
                                                        placeholder="Video URL (YouTube/MP4) - Optional"
                                                        value={lesson.videoUrl}
                                                        onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                                                        className="w-full bg-black/20 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                    <input
                                                        placeholder="PDF URL / Drive Link (Optional)"
                                                        value={lesson.pdfUrl || ''}
                                                        onChange={(e) => handleLessonChange(index, 'pdfUrl', e.target.value)}
                                                        className="w-full bg-black/20 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 3: Text Content & Duration */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                <div className="md:col-span-9 relative">
                                                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                    <input
                                                        placeholder="Reading Content / Text Notes (Optional)"
                                                        value={lesson.content}
                                                        onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                                                        className="w-full bg-black/20 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="md:col-span-3 relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                    <input
                                                        placeholder="Duration"
                                                        value={lesson.duration}
                                                        onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                                                        className="w-full bg-black/20 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeLesson(index)}
                                                className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-8 py-3 rounded-xl font-bold border border-zinc-800 hover:bg-zinc-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black px-10 py-3 rounded-xl font-black transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Create Course
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AdminCreateCourse;

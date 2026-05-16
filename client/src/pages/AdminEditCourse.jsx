import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Loader2, Video, FileText, Clock, Layout, Save, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const AdminEditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        thumbnail: '',
        lessons: []
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                setCourseData(res.data.data);
            } catch (err) {
                toast.error("Failed to load course");
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, navigate]);

    const handleLessonChange = (index, field, value) => {
        const newLessons = [...courseData.lessons];
        newLessons[index][field] = value;
        setCourseData({ ...courseData, lessons: newLessons });
    };

    const addLesson = () => {
        setCourseData({
            ...courseData,
            lessons: [...courseData.lessons, { title: '', type: 'video', videoUrl: '', content: '', pdfUrl: '', duration: 0, section: '' }]
        });
    };

    const removeLesson = (index) => {
        if (courseData.lessons.length === 1) return;
        const newLessons = courseData.lessons.filter((_, i) => i !== index);
        setCourseData({ ...courseData, lessons: newLessons });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/courses/${courseId}`, courseData);
            toast.success('Course updated successfully!');
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-violet-600" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black mb-4">Edit <span className="text-gradient">Course</span></h1>
                        <p className="text-gray-500">Modify course details and update the curriculum.</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="edu-card border-gray-200 p-8 space-y-6">
                        <div className="flex items-center gap-2 text-violet-600 font-bold mb-2">
                            <Layout size={20} />
                            Modify Course Settings
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Title</label>
                                <input
                                    required
                                    type="text"
                                    value={courseData.title}
                                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00FF00] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</label>
                                <input
                                    required
                                    type="text"
                                    value={courseData.category}
                                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00FF00] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={courseData.description}
                                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                className="w-full bg-black/40 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00FF00] transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Difficulty</label>
                                <select
                                    value={courseData.difficulty}
                                    onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00FF00] transition-colors appearance-none text-gray-900"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thumbnail URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="url"
                                        value={courseData.thumbnail}
                                        onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#00FF00] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Builder */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-violet-600 font-bold">
                                <Video size={20} />
                                Edit Curriculum ({courseData.lessons?.length || 0} Lessons)
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCourseData({
                                            ...courseData,
                                            lessons: [...courseData.lessons, { title: '', type: 'heading', section: '' }]
                                        });
                                    }}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet-600 hover:text-[#00E600] transition-colors"
                                >
                                    <Layout size={14} />
                                    Add Heading
                                </button>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-gray-100 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors border border-zinc-700"
                                >
                                    <Plus size={14} />
                                    Add New Lesson
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {courseData.lessons?.map((lesson, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="edu-card border-gray-200 bg-white/10 p-6 relative group"
                                >
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black border border-zinc-700">
                                        {index + 1}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="md:col-span-11 space-y-4">
                                            {lesson.type === 'heading' ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-600">
                                                        <Layout size={12} /> Curriculum Heading
                                                    </div>
                                                    <input
                                                        required
                                                        placeholder="Section Heading Title (e.g. Phase 1: HTML Fundamentals)"
                                                        value={lesson.title}
                                                        onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                                        className="w-full bg-violet-600/5 border border-violet-200 rounded-lg py-3 px-4 text-sm font-bold placeholder:font-normal focus:outline-none focus:border-[#00FF00] transition-colors"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Row 1: Title & Section */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <input
                                                            required
                                                            placeholder="Lesson Title"
                                                            value={lesson.title}
                                                            onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                                            className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors"
                                                        />
                                                        <input
                                                            placeholder="Section (e.g. HTML, CSS, Basics)"
                                                            value={lesson.section || ''}
                                                            onChange={(e) => handleLessonChange(index, 'section', e.target.value)}
                                                            className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors"
                                                        />
                                                    </div>

                                                    {/* Row 2: Video & PDF */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="relative">
                                                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                            <input
                                                                placeholder="Video URL (Optional)"
                                                                value={lesson.videoUrl || ''}
                                                                onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                                                                className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors"
                                                            />
                                                        </div>
                                                        <div className="relative">
                                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                            <input
                                                                placeholder="PDF URL / Drive Link (Optional)"
                                                                value={lesson.pdfUrl || ''}
                                                                onChange={(e) => handleLessonChange(index, 'pdfUrl', e.target.value)}
                                                                className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Row 3: Lesson Content & Duration */}
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                        <div className="md:col-span-9 relative">
                                                            <Layout className="absolute left-3 top-3 text-zinc-600" size={14} />
                                                            <textarea
                                                                rows={3}
                                                                placeholder="Reading Content / Text Notes (Optional)"
                                                                value={lesson.content || ''}
                                                                onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                                                                className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors resize-none"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-3 relative">
                                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                placeholder="Mins"
                                                                value={lesson.duration || 0}
                                                                onChange={(e) => handleLessonChange(index, 'duration', parseFloat(e.target.value) || 0)}
                                                                className="w-full bg-black/20 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#ADFF2F] transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
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
                            className="px-8 py-3 rounded-xl font-bold border border-gray-200 hover:bg-white transition-colors"
                        >
                            Cancel Changes
                        </button>
                        <button
                            disabled={saving}
                            type="submit"
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-500 hover:to-teal-400 text-black px-10 py-3 rounded-xl font-black transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Update Course
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AdminEditCourse;

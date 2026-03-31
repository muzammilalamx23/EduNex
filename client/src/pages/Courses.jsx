import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, ArrowRight, Search, GraduationCap, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';

const CourseCard = ({ title, instructor, lessons, rating, difficulty, thumbnail, id, index }) => {
    const navigate = useNavigate();

    const difficultyColors = {
        Beginner: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={() => navigate(`/course-detail/${id}`)}
            className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] overflow-hidden transition-all duration-400 hover:border-blue-500/20 hover:-translate-y-1"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
            {/* Thumbnail */}
            <div className="h-48 bg-[var(--color-surface-light)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent z-10"></div>
                <img
                    src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                />
                {/* Difficulty badge */}
                <div className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-bold tracking-wide ${difficultyColors[difficulty] || 'bg-white/10 text-white border-white/10'}`}>
                    {difficulty}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {title}
                </h3>
                <p className="text-[var(--color-text-dim)] text-sm mb-5">
                    Instructor: <span className="text-white font-medium">{instructor || 'Platform Admin'}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-zinc-600" />
                        {lessons?.length || 0} Lessons
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 ml-auto font-semibold">
                        <Star size={14} fill="currentColor" />
                        {rating || 4.5}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-detail/${id}`);
                    }}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-white/[0.06] bg-white/[0.02] text-white group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
                >
                    Explore Course
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data.data || []);
            } catch {
                toast.error('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesLevel = levelFilter === "All" || course.difficulty === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] text-white relative">
            <BackgroundAnimation />
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 relative">
                {/* Header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <span className="section-label">
                            <GraduationCap size={14} /> Course Catalog
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-5 text-white"
                    >
                        Curated <span className="text-gradient">Learning</span> Experience
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--color-text-muted)] text-lg max-w-xl leading-relaxed"
                    >
                        Master technical skills with our structured curriculum designed for high-growth engineering roles.
                    </motion.p>
                </div>

                {/* Filters bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 mb-12"
                >
                    {/* Search */}
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <label htmlFor="course-search" className="sr-only">Search courses</label>
                        <input
                            id="course-search"
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--color-surface)] border border-white/[0.06] rounded-xl py-3.5 pl-12 pr-6 w-full focus:outline-none focus:border-blue-500/50 transition-all text-sm text-white placeholder:text-zinc-600"
                        />
                    </div>

                    {/* Level filter tabs */}
                    <div className="flex gap-2 items-center">
                        <Filter size={16} className="text-zinc-600 mr-1" />
                        {levels.map((level) => (
                            <button
                                key={level}
                                onClick={() => setLevelFilter(level)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                                    levelFilter === level
                                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                        : 'bg-transparent border-white/[0.06] text-zinc-400 hover:border-white/10 hover:text-white'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Course grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] overflow-hidden">
                                <div className="h-48 bg-[var(--color-surface-light)] animate-pulse"></div>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="h-6 w-3/4 bg-[var(--color-surface-light)] rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-[var(--color-surface-light)] rounded-lg animate-pulse"></div>
                                    <div className="mt-auto h-12 w-full bg-[var(--color-surface-light)] rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, i) => (
                            <CourseCard
                                key={course._id}
                                {...course}
                                id={course._id}
                                index={i}
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {filteredCourses.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 rounded-3xl border border-white/[0.06] bg-[var(--color-surface)]"
                    >
                        <BookOpen className="mx-auto text-zinc-700 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-white mb-2">No courses match your criteria</h3>
                        <p className="text-[var(--color-text-dim)] text-sm mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearchTerm(""); setLevelFilter("All"); }}
                            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;

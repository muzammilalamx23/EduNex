import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';

const CourseCard = ({ title, instructor, lessons, rating, difficulty, thumbnail, id }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/course-detail/${id}`)}
            className="glass-card bg-zinc-900/40 border-zinc-800 hover:border-cyan-500/30 overflow-hidden flex flex-col group cursor-pointer"
        >
            <div className="h-48 bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 z-20 px-2 py-1 rounded-md bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                    {difficulty}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{title}</h3>
                <p className="text-zinc-400 text-sm mb-4">Instructor: <span className="text-zinc-300">{instructor || 'Platform Admin'}</span></p>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-zinc-600" />
                        {lessons?.length || 0} Lessons
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-500 ml-auto">
                        <Star size={14} fill="currentColor" />
                        {rating || 4.5}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-detail/${id}`);
                    }}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all bg-zinc-800 text-white hover:bg-cyan-500 hover:text-black group/btn"
                >
                    Explore Course
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const Courses = () => {
    // FIX: Removed duplicate top-level useNavigate — CourseCard has its own
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/courses');
                // New backend: { success: true, data: [...] }
                setCourses(res.data.data || []);
            } catch {
                toast.error('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty array is correct — fetch once on mount

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === "All" || course.difficulty === levelFilter;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-cyan-500/30 relative">
            <BackgroundAnimation />
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Curated <span className="text-gradient">Experience</span></h1>
                        <p className="text-zinc-400 text-lg">Master technical skills with our structured curriculum designed for high-growth engineering roles.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-6 w-full md:w-64 focus:outline-none focus:border-cyan-500 transition-all text-sm"
                            />
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-cyan-500 mb-4" size={48} />
                        <p className="text-zinc-500 animate-pulse">Loading curriculum...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <CourseCard
                                key={course._id}
                                {...course}
                                id={course._id}
                            />
                        ))}
                    </div>
                )}

                {filteredCourses.length === 0 && !loading && (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                        <BookOpen className="mx-auto text-zinc-700 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-zinc-500">No courses match your criteria</h3>
                        <button onClick={() => { setSearchTerm(""); setLevelFilter("All") }} className="mt-4 text-cyan-400 font-bold hover:underline">Clear all filters</button>
                    </div>
                )}
            </main>

            <Footer />
        </div >
    );
};

export default Courses;

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { BookOpen, Star, ArrowRight, Search, GraduationCap, Filter, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';

const learningPaths = [
    {
        id: "frontend",
        title: "Frontend Engineering Path",
        description: "Master the visual and interactive layers of the web.",
        orderedTitles: [
            "Frontend Foundations: HTML & CSS",
            "Modern JavaScript Essentials",
            "React.js Mastery: Zero to Hero"
        ]
    },
    {
        id: "backend-core",
        title: "Backend Core Path",
        description: "Build robust APIs and manage databases.",
        orderedTitles: [
            "Node.js Masterclass",
            "Express.js Fundamentals",
            "MongoDB & Mongoose Bootcamp",
            "PostgreSQL & Prisma ORM",
            "Secure JWT Authentication",
            "Advanced REST APIs"
        ]
    },
    {
        id: "backend-advanced",
        title: "Backend Advanced Architecture",
        description: "Scale your applications and build real-time features.",
        orderedTitles: [
            "TypeScript for Backend",
            "Next-Level NestJS",
            "GraphQL Zero to Hero",
            "WebSockets & Real-Time",
            "Redis Caching Strategies",
            "Background Jobs with BullMQ"
        ]
    },
    {
        id: "data-science",
        title: "Data Scientist Path",
        description: "Extract insights from data. Learn statistics, machine learning, and data visualization.",
        orderedTitles: [
            "Python for Data Science",
            "Statistics & Probability",
            "Data Analysis with Pandas",
            "Data Visualization with Matplotlib",
            "Machine Learning Basics"
        ]
    },
    {
        id: "devops-engineer",
        title: "DevOps Engineer Path",
        description: "Automate operations with CI/CD pipelines, containerization, and infrastructure automation.",
        orderedTitles: [
            "Docker for Backend Developers",
            "Kubernetes Orchestration",
            "Infrastructure as Code (Terraform)",
            "CI/CD Pipelines for Backend",
            "AWS Deployment & Serverless",
            "Backend Security & Rate Limiting",
            "Microservices Architecture",
            "Apache Kafka Basics",
            "System Design Basics"
        ]
    },
    {
        id: "ml-engineer",
        title: "ML Engineer Path",
        description: "Build intelligent systems at scale. Train and deploy models.",
        orderedTitles: [
            "Deep Learning with PyTorch",
            "Natural Language Processing (NLP)",
            "Computer Vision Fundamentals",
            "MLOps & Model Deployment"
        ]
    }
];

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
            className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] overflow-hidden transition-all duration-400 hover:border-blue-500/20 hover:-translate-y-1 h-full flex flex-col"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
        >
            {/* Thumbnail */}
            <div className="h-48 bg-white relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent z-10"></div>
                <img
                    src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                />
                {/* Difficulty badge */}
                <div className={`absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-bold tracking-wide ${difficultyColors[difficulty] || 'bg-white/10 text-gray-900 border-white/10'}`}>
                    {difficulty}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                    {title}
                </h3>
                <p className="text-[var(--color-text-dim)] text-sm mb-5">
                    Instructor: <span className="text-gray-900 font-medium">{instructor || 'Platform Admin'}</span>
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-zinc-600" />
                        {lessons?.length || 0} Lessons
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 ml-auto font-semibold">
                        <Star size={14} fill="currentColor" />
                        {rating || 4.9}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-detail/${id}`);
                    }}
                    className="w-full mt-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-gray-200 bg-gray-50 text-gray-900 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 group-hover:shadow-[0_4px_16px_rgba(124,58,237,0.25)]"
                >
                    Explore Course
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

import { useQuery } from '@tanstack/react-query';

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    
    // Use a large limit to fetch all courses for bundling
    const LIMIT = 100;

    // Debounce the search term
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: courses = [], isLoading: loading, isError } = useQuery({
        queryKey: ['courses', debouncedSearch, levelFilter],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: 1,
                limit: LIMIT,
            });
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (levelFilter !== 'All') params.set('difficulty', levelFilter);

            const res = await api.get(`/courses?${params.toString()}`);
            return res.data.data || [];
        }
    });

    if (isError) {
        toast.error('Failed to load courses. Please try again later.');
    }

    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
    
    const isFiltering = debouncedSearch !== '' || levelFilter !== 'All';

    // Group courses by learning path if not filtering
    const renderBundles = () => {
        const renderedCourseIds = new Set();
        
        const pathElements = learningPaths.map((path, pathIdx) => {
            // Find courses for this path in the correct order
            const pathCourses = path.orderedTitles
                .map(title => courses.find(c => c.title === title))
                .filter(Boolean); // remove undefined
            
            if (pathCourses.length === 0) return null;
            
            // Track rendered courses
            pathCourses.forEach(c => renderedCourseIds.add(c._id));

            return (
                <div key={path.id} className="mb-20">
                    <div className="flex items-start gap-4 mb-8 border-b border-gray-200 pb-4">
                        <div className="bg-violet-100 text-violet-600 p-3 rounded-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{path.title}</h2>
                            <p className="text-gray-500 mt-1">{path.description}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pathCourses.map((course, i) => (
                            <div key={course._id} className="relative">
                                {/* Number indicator */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold z-30 shadow-lg border-2 border-white">
                                    {i + 1}
                                </div>
                                <CourseCard {...course} id={course._id} index={i} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        });

        // Other courses not in bundles
        const otherCourses = courses.filter(c => !renderedCourseIds.has(c._id));
        if (otherCourses.length > 0) {
            pathElements.push(
                <div key="other" className="mb-20">
                    <div className="flex items-start gap-4 mb-8 border-b border-gray-200 pb-4">
                        <div className="bg-gray-100 text-gray-600 p-3 rounded-2xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Additional Explorations</h2>
                            <p className="text-gray-500 mt-1">More courses to expand your knowledge.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherCourses.map((course, i) => (
                            <CourseCard key={course._id} {...course} id={course._id} index={i} />
                        ))}
                    </div>
                </div>
            );
        }

        return pathElements;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 relative">
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
                        className="text-4xl md:text-6xl font-bold mb-5 text-gray-900"
                    >
                        Curated <span className="text-gradient">Learning</span> Experience
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--color-text-muted)] text-lg max-w-xl leading-relaxed"
                    >
                        Master technical skills with our structured curriculum designed for high-growth engineering roles. Follow the recommended paths from phase 1 to 4.
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
                            className="bg-[var(--color-surface)] border border-white/[0.06] rounded-xl py-3.5 pl-12 pr-6 w-full focus:outline-none focus:border-blue-500/50 transition-all text-sm text-gray-900 placeholder:text-zinc-600"
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
                                        ? 'bg-violet-100 border-violet-300 text-violet-600'
                                        : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Course Grid / Bundles */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] overflow-hidden">
                                <div className="h-48 bg-white animate-pulse"></div>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="h-6 w-3/4 bg-white rounded-lg animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-white rounded-lg animate-pulse"></div>
                                    <div className="mt-auto h-12 w-full bg-white rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 rounded-3xl border border-white/[0.06] bg-[var(--color-surface)]"
                    >
                        <BookOpen className="mx-auto text-zinc-700 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses match your criteria</h3>
                        <p className="text-[var(--color-text-dim)] text-sm mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearchTerm(''); setLevelFilter('All'); }}
                            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                ) : isFiltering ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, i) => (
                            <CourseCard
                                key={course._id}
                                {...course}
                                id={course._id}
                                index={i}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        {renderBundles()}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;

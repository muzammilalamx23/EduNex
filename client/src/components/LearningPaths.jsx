import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Code, BookOpen, ArrowRight, Layers, Database, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const paths = [
    {
        title: 'Frontend Engineering',
        count: '14 Courses',
        description: 'React, Next.js, TypeScript & modern UI frameworks',
        icon: <MonitorPlay size={24} />,
        color: 'violet',
        tag: 'Most Popular',
    },
    {
        title: 'Backend Architecture',
        count: '12 Courses',
        description: 'Node.js, Express, MongoDB & system design',
        icon: <Code size={24} />,
        color: 'indigo',
        tag: 'Trending',
    },
    {
        title: 'Full Stack Mastery',
        count: '8 Courses',
        description: 'End-to-end projects with deployment & DevOps',
        icon: <Layers size={24} />,
        color: 'purple',
        tag: '',
    },
    {
        title: 'Data Science & AI',
        count: '10 Courses',
        description: 'Python, ML models, and AI integrations',
        icon: <Brain size={24} />,
        color: 'violet',
        tag: 'New',
    },
];

const colorMap = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', progress: 'from-violet-500 to-violet-400', tag: 'bg-violet-100 text-violet-700' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', progress: 'from-indigo-500 to-indigo-400', tag: 'bg-indigo-100 text-indigo-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', progress: 'from-purple-500 to-purple-400', tag: 'bg-purple-100 text-purple-700' },
};

const LearningPaths = () => {
    return (
        <section id="courses" className="py-28 px-6 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-100 to-transparent" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl"
                    >
                        <span className="section-label mb-5 inline-flex">
                            <BookOpen size={14} /> Learning Paths
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Unlock new{' '}
                            <span className="text-gradient">possibilities</span>
                        </h2>
                        <p className="text-gray-500 text-lg mt-4">
                            Dive into lessons, hands‑on courses designed by top mentors to push creativity
                            and give your career the direction it deserves.
                        </p>
                    </motion.div>
                    <Link
                        to="/courses"
                        className="text-sm font-bold text-violet-600 flex items-center gap-2 hover:text-violet-700 transition-colors group shrink-0"
                    >
                        View All <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {paths.map((p, i) => {
                        const c = colorMap[p.color];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="edu-card group cursor-pointer relative"
                            >
                                {p.tag && (
                                    <span className={`absolute top-5 right-5 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tag}`}>
                                        {p.tag}
                                    </span>
                                )}
                                <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                                    {p.icon}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1.5">{p.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.description}</p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-5">
                                    <BookOpen size={12} className={c.text} />
                                    {p.count}
                                </div>

                                {/* Progress bar animation on hover */}
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${c.progress} w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LearningPaths;

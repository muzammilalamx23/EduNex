import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Code, BookOpen, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningPaths = () => {
    const paths = [
        {
            title: "Frontend Engineering",
            count: "14 Courses",
            description: "React, Next.js, TypeScript & modern UI frameworks",
            icon: <MonitorPlay className="text-blue-400" size={28} />,
            gradient: "from-blue-500/10 to-transparent",
        },
        {
            title: "Backend Architecture",
            count: "12 Courses",
            description: "Node.js, Express, MongoDB & system design",
            icon: <Code className="text-cyan-400" size={28} />,
            gradient: "from-cyan-500/10 to-transparent",
        },
        {
            title: "Full Stack Mastery",
            count: "8 Courses",
            description: "End-to-end projects with deployment & DevOps",
            icon: <Layers className="text-amber-400" size={28} />,
            gradient: "from-amber-500/10 to-transparent",
        },
    ];

    return (
        <section id="courses" className="py-32 px-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(16,185,129,0.04)_0%,transparent_50%)] pointer-events-none"></div>
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-4"
                        >
                            <span className="section-label">
                                <BookOpen size={14} /> Learning Paths
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold mb-4 text-white"
                        >
                            Ascend Your <span className="text-gradient">Career Path</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-[var(--color-text-muted)] text-lg"
                        >
                            Curated curriculum designed by industry experts to take you from junior to senior in months, not years.
                        </motion.p>
                    </div>
                    <Link to="/courses" className="text-sm font-bold text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors uppercase tracking-wider group">
                        View All Paths <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {paths.map((path, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            key={i}
                            className="glow-card group cursor-pointer relative overflow-hidden"
                        >
                            {/* Background gradient blob */}
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${path.gradient} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 -z-10`}></div>

                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {path.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-white">{path.title}</h3>
                            <p className="text-[var(--color-text-dim)] text-sm mb-4">{path.description}</p>
                            <p className="text-[var(--color-text-muted)] mb-6 flex items-center gap-2 text-sm font-semibold">
                                <BookOpen size={14} className="text-blue-400" />{path.count}
                            </p>

                            {/* Progress bar that fills on hover */}
                            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 w-0 group-hover:w-full transition-all duration-700 ease-out rounded-full"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearningPaths;

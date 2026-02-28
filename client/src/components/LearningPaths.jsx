import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, Code, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningPaths = () => {
    const paths = [
        { title: "Frontend Engineering", count: "14 Courses", icon: <MonitorPlay className="text-cyan-400" size={32} /> },
        { title: "Backend Architecture", count: "12 Courses", icon: <Code className="text-violet-400" size={32} /> },
    ];

    return (
        <section id="courses" className="py-32 px-6 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none"></div>
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold mb-4 text-white">Ascend Your <span className="text-gradient">Career Path</span></h2>
                        <p className="text-white text-lg">Curated curriculum designed by industry experts to take you from junior to senior in months, not years.</p>
                    </div>
                    <Link to="/courses" className="text-sm font-semibold text-cyan-400 flex items-center gap-2 hover:text-cyan-300 transition-colors uppercase tracking-wider">
                        View All Paths <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {paths.map((path, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            key={i} className="glass-card group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-zinc-800 rounded-full blur-3xl group-hover:bg-violet-900/40 transition-colors duration-500 -z-10"></div>
                            <div className="mb-6">{path.icon}</div>
                            <h3 className="text-2xl font-bold mb-2 text-white">{path.title}</h3>
                            <p className="text-white mb-6 flex items-center gap-2"><BookOpen size={14} />{path.count}</p>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearningPaths;

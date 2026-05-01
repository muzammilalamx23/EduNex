import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, BookOpen, Award, Zap } from 'lucide-react';

/* ─── Animated counter ─── */
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = '' }) => {
    const ref = useRef(null);
    useEffect(() => {
        let start = null;
        let frame;
        const tick = (ts) => {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / (duration * 1000), 1);
            const ease = prog * (2 - prog);
            if (ref.current) ref.current.textContent = Math.floor(from + ease * (to - from)) + suffix;
            if (prog < 1) frame = requestAnimationFrame(tick);
        };
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) frame = requestAnimationFrame(tick); }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => { obs.disconnect(); cancelAnimationFrame(frame); };
    }, [from, to, duration, suffix]);
    return <span ref={ref}>{from}{suffix}</span>;
};

const stats = [
    { icon: <BookOpen size={22} />, value: 8500, suffix: '+', label: 'Courses Available', color: 'violet' },
    { icon: <Users size={22} />, value: 500, suffix: 'K+', label: 'Active Learners', color: 'indigo' },
    { icon: <Award size={22} />, value: 1200, suffix: '+', label: 'Expert Instructors', color: 'purple' },
    { icon: <Star size={22} />, value: 4, suffix: '.9★', label: 'Average Rating', color: 'amber' },
];

const colorMap = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-500',  border: 'border-amber-100'  },
};

const avatarRows = [
    [1, 2, 3, 4, 5].map(i => `https://i.pravatar.cc/80?img=${i * 7}`),
];

const Metrics = () => {
    return (
        <section className="py-28 px-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-100 to-transparent" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left Column ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-label mb-5 inline-flex">
                            <TrendingUp size={14} /> Platform Metrics
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 mt-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Learn, grow &amp; excel with{' '}
                            <span className="text-gradient">AI-powered</span>{' '}
                            courses
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-10">
                            Join a global community of 500K+ learners and 1,200+ expert instructors.
                            Discover courses across technology, design, business, and more — crafted
                            to help you build real‑world skills.
                        </p>

                        {/* Social proof */}
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2.5">
                                {[1,2,3,4,5].map(i => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/80?img=${i * 7}`}
                                        alt=""
                                        width={40} height={40}
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="flex gap-0.5 text-amber-400 mb-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Growing global community improving skills every day
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right Column — stat cards ── */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((s, i) => {
                            const c = colorMap[s.color];
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`stat-card ${i % 2 !== 0 ? 'mt-6' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} mb-4 mx-auto`}>
                                        {s.icon}
                                    </div>
                                    <div className={`text-4xl font-black ${c.text} mb-1`}>
                                        <AnimatedCounter to={s.value} suffix={s.suffix} />
                                    </div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        {s.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Metrics;

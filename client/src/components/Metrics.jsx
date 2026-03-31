import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

const AnimatedCounter = ({ from, to, duration = 2, suffix = "" }) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        let startTimestamp = null;
        let frameId;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            const easeOut = progress * (2 - progress);
            const val = Math.floor(from + easeOut * (to - from));

            if (nodeRef.current) {
                nodeRef.current.textContent = val + suffix;
            }

            if (progress < 1) {
                frameId = window.requestAnimationFrame(step);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                frameId = window.requestAnimationFrame(step);
            }
        }, { threshold: 0.1 });

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => {
            observer.disconnect();
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, [from, to, duration, suffix]);

    return <span ref={nodeRef}>{from}{suffix}</span>;
};

const stats = [
    { value: 99, suffix: "%", label: "Completion Rate", color: "blue" },
    { value: 0, from: 100, suffix: "ms", label: "Response Time", color: "cyan" },
    { value: 500, suffix: "+", label: "Hiring Partners", color: "amber" },
    { value: 100, suffix: "k+", label: "Active Learners", color: "blue" },
];

const colorMap = {
    blue: { text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", hoverBorder: "hover:border-blue-500/40" },
    cyan: { text: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5", hoverBorder: "hover:border-cyan-500/40" },
    amber: { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", hoverBorder: "hover:border-amber-500/40" },
};

const Metrics = () => {
    return (
        <section className="py-28 relative overflow-hidden">
            {/* Light background contrast break (Sheryians pattern) */}
            <div className="absolute inset-0 bg-[var(--color-surface)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-label mb-6 inline-flex">
                            <TrendingUp size={14} /> Platform Metrics
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight mt-6">
                            Engineered for <br />
                            <span className="text-gradient">Maximum Output</span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg mb-10 leading-relaxed">
                            Don't just watch videos. Code in the browser, complete real-world projects, and get your code reviewed by AI instantly.
                        </p>

                        {/* Social proof row */}
                        <div className="flex gap-5 items-center">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i * 8}`} loading="lazy" width="44" height="44"
                                        className="w-11 h-11 rounded-full border-2 border-[var(--color-surface)] z-10 block object-cover" alt="User" />
                                ))}
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="text-amber-400 flex gap-0.5 text-sm">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={14} />)}
                                </div>
                                <div className="text-white text-sm font-semibold mt-1">Joined by 100,000+ developers</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right column — stat cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, i) => {
                            const c = colorMap[stat.color];
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`rounded-2xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-400 cursor-default border ${c.border} ${c.bg} ${c.hoverBorder} ${i === 1 ? 'mt-6' : i === 3 ? 'mt-6' : ''}`}
                                    style={{ boxShadow: '0 0 30px rgba(0,0,0,0.2)' }}
                                >
                                    <div className={`text-5xl md:text-6xl font-black ${c.text} mb-3 tracking-tighter group-hover:scale-105 transition-transform`}>
                                        <AnimatedCounter from={stat.from || 0} to={stat.value} duration={2.5} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</div>
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

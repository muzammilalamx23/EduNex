import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

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

const Metrics = () => {
    return (
        <section className="py-24 border-y border-zinc-800 bg-[#0c0c0e] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl font-bold mb-6 text-white">Engineered for <br /> <span className="text-gradient">Maximum Output</span></h2>
                    <p className="text-white text-lg mb-8 leading-relaxed">Don't just watch videos. Code in the browser, complete real-world projects, and get your code reviewed by AI instantly.</p>
                    <div className="flex gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i * 8}`} loading="lazy" width="48" height="48" className="w-12 h-12 rounded-full border-2 border-zinc-900 z-10 block" alt="User" />
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex text-yellow-400 text-sm"><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /></div>
                            <div className="text-white text-sm font-medium mt-1">Joined by 100,000+ developers</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 border-zinc-800 hover:border-cyan-500/30 group transition-all duration-300">
                        <div className="text-6xl md:text-7xl font-black text-gradient mb-2 tracking-tighter group-hover:scale-105 transition-transform">
                            <AnimatedCounter from={0} to={99} duration={2.5} suffix="%" />
                        </div>
                        <div className="text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors mt-2">Completion Rate</div>
                    </div>
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 border-zinc-800 hover:border-violet-500/30 mt-8 group transition-all duration-300">
                        <div className="text-6xl md:text-7xl font-black text-gradient mb-2 tracking-tighter group-hover:scale-105 transition-transform">
                            <AnimatedCounter from={100} to={0} duration={2} suffix="ms" />
                        </div>
                        <div className="text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-widest group-hover:text-violet-400 transition-colors mt-2">Latency Editing</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics;

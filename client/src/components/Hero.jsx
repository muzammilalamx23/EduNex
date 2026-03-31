import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fadeUp, staggerContainer } from '../utils/animations';

const LightPillar = lazy(() => import('./LightPillar'));

const TypewriterEffect = ({ words }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [blink, setBlink] = useState(true);
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    useEffect(() => {
        if (index === words.length) {
            setIndex(0);
            return;
        }

        if (subIndex === words[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 2000);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => prev + 1);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <>
            <span className="text-gradient">{(words[index] || "").substring(0, subIndex)}</span>
            <span className={`inline-block w-[3px] h-[0.85em] bg-blue-400 align-middle ml-1 rounded-full transition-opacity duration-200 ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
        </>
    );
};

const Hero = () => {
    const { user } = useAuth();

    return (
        <section className="relative min-h-screen pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-[var(--color-bg-dark)]">
                <Suspense fallback={null}>
                    <LightPillar
                        topColor="#3B82F6"
                        bottomColor="#06B6D4"
                        intensity={0.4}
                        rotationSpeed={0.08}
                        pillarWidth={4.0}
                        pillarHeight={0.2}
                        mixBlendMode="plus-lighter"
                    />
                </Suspense>
                <div className="absolute inset-0 bg-[var(--color-bg-dark)]/50 backdrop-blur-[2px]"></div>
                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)]"></div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto z-10"
            >
                {/* Badge */}
                <motion.div variants={fadeUp} className="section-label mb-8">
                    <Sparkles size={14} className="text-blue-400" /> AI-Powered Learning Platform
                </motion.div>

                {/* Main headline */}
                <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] text-white min-h-[150px] sm:min-h-[120px] md:min-h-[200px]">
                    Master Tech Skills <br />
                    <TypewriterEffect words={["at Light Speed.", "for Production.", "with AI Tutors.", "in the Browser."]} />
                </motion.h1>

                {/* Subtitle */}
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto font-normal leading-relaxed mt-4">
                    The most advanced platform for developers and designers. Learn through interactive environments, real-time feedback, and massive communities.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="btn btn-outline w-full sm:w-auto px-8 py-4 text-base flex items-center gap-2 group">
                            <ShieldCheck size={18} className="text-blue-400" />
                            Admin Dashboard
                        </Link>
                    )}
                    <Link to="/courses" className="btn btn-primary w-full sm:w-auto px-10 py-4 text-base flex items-center gap-2 group text-white">
                        Explore Courses
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="#" className="btn btn-outline w-full sm:w-auto px-8 py-4 text-base flex items-center gap-2 group">
                        <Play size={18} className="text-blue-400 group-hover:scale-110 transition-transform" /> Watch Demo
                    </a>
                </motion.div>
            </motion.div>

            {/* Floating UI Mockup — Code Editor */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="mt-20 w-full max-w-5xl mx-auto relative z-10"
            >
                <div className="w-full aspect-[16/9] rounded-2xl border border-white/[0.06] bg-[var(--color-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    {/* Browser chrome */}
                    <div className="h-10 border-b border-white/[0.06] flex items-center px-4 gap-2 bg-[var(--color-bg-dark)]/80">
                        <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-500/60"></div>
                        <div className="flex-1 mx-8">
                            <div className="bg-[var(--color-surface)] rounded-lg px-4 py-1.5 text-xs text-zinc-500 text-center border border-white/[0.06]">
                                edunex.dev/playground
                            </div>
                        </div>
                    </div>
                    {/* Code content */}
                    <div className="p-4 md:p-8 grid grid-cols-3 gap-6 h-[calc(100%-2.5rem)]">
                        <div className="col-span-2 bg-[var(--color-bg-dark)] rounded-xl border border-white/[0.06] p-6 font-mono text-sm overflow-hidden text-left relative flex flex-col justify-center">
                            <div className="text-zinc-600 mb-4">// AI-Powered Learning Engine</div>
                            <div><span className="text-blue-400">const</span><span className="text-white"> engine = </span><span className="text-cyan-400">new</span><span className="text-white"> EduNex();</span></div>
                            <div className="mt-2"><span className="text-blue-400">await</span><span className="text-white"> engine.</span><span className="text-cyan-400">initialize</span><span className="text-white">({'{'}</span></div>
                            <div className="text-white ml-6 mt-1">mode: <span className="text-amber-400">'interactive'</span>,</div>
                            <div className="text-white ml-6 mt-1">ai: <span className="text-blue-400">true</span>,</div>
                            <div className="text-white ml-6 mt-1">performance: <span className="text-amber-400">'optimum'</span></div>
                            <div className="text-white mt-1">{'}'});</div>
                            <div className="absolute bottom-6 right-6 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="col-span-1 flex flex-col gap-6">
                            <div className="flex-1 bg-[var(--color-bg-dark)] rounded-xl border border-white/[0.06] flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                                    <Zap size={28} className="text-blue-400" />
                                </div>
                                <div className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">System Active</div>
                            </div>
                            <div className="h-24 bg-[var(--color-bg-dark)] rounded-xl border border-white/[0.06] p-5 flex flex-col justify-center">
                                <div className="flex justify-between text-xs text-zinc-400 mb-3 font-semibold uppercase tracking-wide">
                                    <span>Progress</span>
                                    <span className="text-blue-400">75%</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--color-surface)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "75%" }}
                                        transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Glow underneath the mockup */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
            </motion.div>
        </section>
    );
};

export default Hero;

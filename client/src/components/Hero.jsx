import React, { useState, useEffect, Suspense, lazy } from 'react'; // useState/useEffect still used by TypewriterEffect above
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Infinity, ShieldCheck } from 'lucide-react';
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
            <span className={`inline-block w-[3px] h-[0.9em] bg-cyan-400 align-middle ml-1 ${blink ? 'opacity-100' : 'opacity-0'} shadow-[0_0_8px_#06b6d4]`}></span>
        </>
    );
};

const Hero = () => {
    const { user } = useAuth(); // reads from shared context — no extra API call

    return (
        <section className="relative min-h-screen pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-[#09090b]">
                <Suspense fallback={null}>
                    <LightPillar
                        topColor="#06b6d4"
                        bottomColor="#8b5cf6"
                        intensity={0.6}
                        rotationSpeed={0.1}
                        pillarWidth={4.0}
                        pillarHeight={0.2}
                        mixBlendMode="plus-lighter"
                    />
                </Suspense>
                <div className="absolute inset-0 bg-[#09090b]/40 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto z-10"
            >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-white text-xs font-semibold uppercase tracking-wider mb-8">
                    <Zap size={14} className="text-violet-400" /> Introducing AI-Powered Learning
                </motion.div>

                <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white min-h-[150px] sm:min-h-[120px] md:min-h-[180px]">
                    Master Tech Skills <br />
                    <TypewriterEffect words={["at Light Speed.", "for Production.", "in the Browser.", "with AI Tutors."]} />
                </motion.h1>

                <motion.p variants={fadeUp} className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto font-light leading-relaxed mt-4">
                    The most advanced platform for developers and designers. Learn through interactive environments, real-time feedback, and massive communities.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="btn bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500/20 w-full sm:w-auto px-8 py-4 text-base flex items-center gap-2 group text-cyan-400 font-bold shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                            <ShieldCheck size={18} />
                            Admin Dashboard
                        </Link>
                    )}
                    <Link to="/courses" className="btn btn-primary w-full sm:w-auto px-8 py-4 text-base flex items-center gap-2 group text-white">
                        Explore Courses
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="#" className="btn btn-outline w-full sm:w-auto px-8 py-4 text-base flex items-center gap-2 group text-white">
                        <Play size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" /> View Demo
                    </a>
                </motion.div>
            </motion.div>

            {/* Floating UI Mockup */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="mt-20 w-full max-w-5xl mx-auto relative z-10 perspective-1000"
            >
                <div className="w-full aspect-[16/9] rounded-2xl border border-zinc-800 bg-[#0c0c0e] shadow-[0_0_100px_rgba(139,92,246,0.15)] overflow-hidden relative">
                    <div className="h-8 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="p-1 md:p-6 grid grid-cols-3 gap-6 h-[calc(100%-2rem)]">
                        <div className="col-span-2 bg-[#1e1e1e] rounded-xl border border-zinc-800 p-4 font-mono text-sm overflow-hidden text-left relative">
                            <div className="text-white mb-2">// WebGL Render Engine Init</div>
                            <div className="text-purple-400">const<span className="text-white"> engine = </span><span className="text-cyan-400">new</span><span className="text-white"> WebApp();</span></div>
                            <div className="text-purple-400 mt-2">await<span className="text-white"> engine.</span><span className="text-blue-400">initialize</span><span className="text-white">({'{'}</span></div>
                            <div className="text-white ml-4">quality: <span className="text-orange-400">'ultra'</span>,</div>
                            <div className="text-white ml-4">particles: <span className="text-green-400">true</span></div>
                            <div className="text-white">{'}'});</div>
                            <div className="absolute bottom-4 right-4 animate-pulse w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                        </div>
                        <div className="col-span-1 flex flex-col gap-4">
                            <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent"></div>
                                <Infinity size={40} className="text-violet-400 mb-2" />
                                <div className="text-xs font-semibold text-white">Live Preview Running</div>
                            </div>
                            <div className="h-24 bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 w-[75%] shadow-[0_0_10px_#06b6d4]"></div>
                                </div>
                                <div className="text-xs text-white mt-2">Compilation: 75%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;

import { motion } from 'framer-motion';
import React from 'react';
import { ArrowRight, Star, Users, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const avatars = [1, 2, 3, 4].map(i => `https://i.pravatar.cc/80?img=${i * 9}`);

const HighConversionHero = () => {
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };
    const item = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-24 pb-16 px-6">

            {/* ── Decorative Blobs ─────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Main purple blob top-left */}
                <div
                    className="absolute -top-40 -left-40 w-[600px] h-[600px] animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, rgba(124,58,237,0.08) 60%, transparent 80%)',
                    }}
                />
                {/* Soft blue blob bottom-right */}
                <div
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] animate-blob"
                    style={{
                        animationDelay: '4s',
                        background: 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, rgba(139,92,246,0.06) 60%, transparent 80%)',
                    }}
                />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237C3AED' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center"
            >
                {/* Badge */}
                <motion.div variants={item} className="mb-7">
                    <span className="section-label">
                        ✦ &nbsp;AI-Powered Learning Platform
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={item}
                    className="text-[clamp(2.6rem,7vw,5rem)] font-black leading-[1.08] tracking-tight text-gray-900 mb-6 max-w-[18ch]"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Empowering learners{' '}
                    <span className="relative inline-block">
                        <span className="text-gradient">to shape</span>
                    </span>{' '}
                    the future
                    <span className="inline-flex ml-3 align-middle gap-1 text-2xl leading-none">🎓💡</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    variants={item}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-normal"
                >
                    We're redefining education with technology, creativity, and community —
                    helping learners around the world reach their full potential.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mb-14">
                    <Link
                        to="/courses"
                        className="btn btn-primary px-8 py-4 text-base rounded-2xl flex items-center gap-2 group shadow-[0_8px_32px_rgba(124,58,237,0.3)]"
                    >
                        Start Learning Now
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        to="/auth"
                        className="btn btn-outline px-8 py-4 text-base rounded-2xl flex items-center gap-2 font-semibold"
                    >
                        Explore Courses
                    </Link>
                </motion.div>

                {/* Social proof row */}
                <motion.div
                    variants={item}
                    className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
                >
                    {/* Avatars + Stars */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2.5">
                            {avatars.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt="Student"
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="flex gap-0.5 text-amber-400 mb-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                            </div>
                            <p className="text-xs font-semibold text-gray-600">50k+ happy learners</p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-gray-200 hidden sm:block" />

                    {/* Quick stats */}
                    {[
                        { icon: <BookOpen size={15} />, val: '450+', label: 'Courses' },
                        { icon: <Users size={15} />, val: '1,200+', label: 'Instructors' },
                        { icon: <Award size={15} />, val: '98%', label: 'Success Rate' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">
                                {s.icon}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-gray-900 leading-none">{s.val}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
        </section>
    );
};

export default HighConversionHero;

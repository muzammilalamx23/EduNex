import React from 'react';
import { m } from 'framer-motion';
import { Diamond, ArrowRight, MousePointer2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HighConversionHero = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { ease: [0.25, 1, 0.5, 1], duration: 0.8 }
        }
    };

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 15 }
        }
    };

    return (
        <header className="relative w-full min-h-screen flex flex-col items-center px-6 pt-44 pb-24 overflow-hidden bg-[#0D0D0D]">
            {/* Background Radial Gradient */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at 50% 30%, #2B1A0F 0%, #150E0A 40%, #0D0D0D 85%)',
                        opacity: 1
                    }}
                />
                
                {/* Subtle Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

                {/* Animated Glow Elements */}
                <m.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.25, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#FF8C37]/20 blur-[130px] rounded-full"
                />
                <m.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#22C55E]/10 blur-[130px] rounded-full"
                />
            </div>

            <m.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center w-full"
            >
                {/* Badge component */}
                <m.div 
                    variants={badgeVariants}
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 backdrop-blur-xl mb-10 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-white/10"
                >
                    <Diamond size={16} className="text-[#22C55E] fill-[#22C55E]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#22C55E]">New Era of Learning</span>
                    <Sparkles size={16} className="text-[#FF8C37]" />
                </m.div>

                {/* Main Heading */}
                <m.h1 
                    variants={itemVariants}
                    className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tight leading-[1.1] text-white mb-8 max-w-[14ch]"
                >
                    Build Skills that <span className="text-[#FF8C37] relative">
                        Drive Growth
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <m.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                d="M3 9C118.833 4.33333 351.4 -3.8 355 9" 
                                stroke="#FF8C37" 
                                strokeWidth="5" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                </m.h1>

                {/* Subtext */}
                <m.p 
                    variants={itemVariants} 
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed"
                >
                    Unlock your full potential with interactive lessons, industry-standard projects, and an AI-powered curriculum designed to bridge the skill gap.
                </m.p>

                {/* CTA Group */}
                <m.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
                >
                    <Link
                        to="/courses"
                        className="group relative inline-flex items-center justify-center px-10 py-5 rounded-[12px] bg-[#22C55E] text-[#0D0D0D] font-bold text-lg border border-black/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] w-full sm:w-auto overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Start Learning Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Internal Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>

                    <button
                        className="group inline-flex items-center justify-center px-10 py-5 rounded-[12px] bg-[#1A1A1A]/60 border border-white/10 text-white font-bold text-lg backdrop-blur-md transition-all duration-300 hover:bg-[#1A1A1A]/80 hover:border-white/20 hover:scale-[1.03] w-full sm:w-auto"
                    >
                        <span className="flex items-center gap-2">
                            <MousePointer2 size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                            Book a Demo
                        </span>
                    </button>
                </m.div>

                {/* Social Proof / Stats */}
                <m.div 
                    variants={itemVariants}
                    className="mt-20 pt-10 border-t border-white/5 w-full flex flex-wrap justify-center gap-x-12 gap-y-6"
                >
                    {[
                        { label: 'Active Students', value: '50k+' },
                        { label: 'Courses', value: '450+' },
                        { label: 'Success Rate', value: '98%' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center sm:items-start">
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </m.div>
            </m.div>

            {/* Ambient Background Blur for Footer connection */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent z-20" />
        </header>
    );
};

export default HighConversionHero;

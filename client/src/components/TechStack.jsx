import React from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
    const techData = [
        { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg", filter: "invert(1)" },
        { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
        { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", filter: "invert(1)" },
        { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Tailwind", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
        { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    ];

    // Double the data for seamless infinite loop
    const doubledTech = [...techData, ...techData];

    return (
        <div className="py-20 bg-[#09090b] relative overflow-hidden border-y border-zinc-900">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-32 bg-violet-500/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]"
                >
                    Master the Tech Stack
                </motion.h2>
            </div>

            {/* Marquee Container */}
            <div className="flex overflow-hidden relative group">
                {/* Overlay gradients for fade effect */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-20"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-20"></div>

                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex items-center gap-12 md:gap-24 whitespace-nowrap px-12"
                >
                    {doubledTech.map((tech, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 group/item cursor-pointer"
                        >
                            <div className="relative">
                                {/* Icon Glow */}
                                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                                <img
                                    src={tech.logo}
                                    alt={tech.name}
                                    className="h-10 md:h-12 w-auto grayscale transition-all duration-500 group-hover/item:grayscale-0 group-hover/item:scale-110 relative z-10"
                                    style={{ filter: tech.filter }}
                                />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-zinc-700 tracking-tighter transition-colors duration-500 group-hover/item:text-zinc-200">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TechStack;

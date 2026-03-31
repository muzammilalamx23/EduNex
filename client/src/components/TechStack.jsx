import React from 'react';
import { motion } from 'framer-motion';
import { Radar, OrbitIcon } from './ui/radar-effect';
import { Code } from 'lucide-react';

const TechStack = () => {
    return (
        <div className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--color-surface)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_50%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-6"
                    >
                        <span className="section-label">
                            <Code size={14} /> Technologies
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Master the <span className="text-gradient">Tech Stack</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-sm md:text-base text-[var(--color-text-muted)] max-w-xl mx-auto"
                    >
                        Built with modern, production-ready technologies to ensure maximum performance,
                        scalability, and a world-class developer experience.
                    </motion.p>
                </div>

                <div className="flex w-full items-center justify-center my-10">
                    <Radar>
                        <OrbitIcon angle={45} radius={110} text="React" img="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" />
                        <OrbitIcon angle={225} radius={110} text="Node.js" img="https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png" />
                        <OrbitIcon angle={315} radius={165} text="TypeScript" img="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" />
                        <OrbitIcon angle={135} radius={165} text="MongoDB" img="https://raw.githubusercontent.com/github/explore/main/topics/mongodb/mongodb.png" />
                        <OrbitIcon angle={90} radius={220} text="Python" img="https://raw.githubusercontent.com/github/explore/main/topics/python/python.png" />
                        <OrbitIcon angle={270} radius={220} text="JavaScript" img="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" />
                        <OrbitIcon angle={180} radius={275} text="Docker" img="https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png" />
                        <OrbitIcon angle={0} radius={275} text="Tailwind" img="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" />
                    </Radar>
                </div>
            </div>
        </div>
    );
};

export default TechStack;

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, ShieldCheck, Workflow, Sparkles, Rocket, Code, Layers } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Features = () => {
    return (
        <section id="features" className="py-32 px-6 relative">
            {/* Background accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-6"
                    >
                        <span className="section-label">
                            <Sparkles size={14} /> Core Capabilities
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-5"
                    >
                        Everything You Need to <br />
                        <span className="text-gradient">Build Real Products</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto"
                    >
                        Write scalable, production-level code directly in your browser with AI assistance.
                    </motion.p>
                </div>

                {/* Bento grid */}
                <div className="grid md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[620px]">
                    {/* Big card - Cloud IDE */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glow-card md:col-span-2 md:row-span-2 flex flex-col relative overflow-hidden group"
                    >
                        <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
                            style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)' }} />
                        <Terminal size={36} className="text-blue-400 mb-6 relative z-10" />
                        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Cloud IDE Built-In</h3>
                        <p className="text-[var(--color-text-muted)] mb-8 relative z-10 leading-relaxed">
                            Launch a full-stack development environment instantly. Pre-configured with Docker, Node, and Python.
                        </p>

                        {/* Terminal mockup */}
                        <div className="mt-auto bg-[var(--color-bg-dark)] border border-white/[0.06] rounded-xl p-5 font-mono text-sm relative z-10 shadow-lg">
                            <span className="text-blue-400">$</span><span className="text-white"> edunex start cluster</span><br />
                            <span className="text-zinc-600 block mt-1.5">Initializing containers...</span>
                            <span className="text-blue-400 block mt-1.5">✓ Instance ready at port 3000</span>
                            <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                    </motion.div>

                    {/* AI Tutor card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glow-card md:col-span-1 md:row-span-1 flex flex-col justify-center items-center text-center group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/15 transition-all duration-300">
                            <Cpu size={28} className="text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">AI Tutor</h4>
                        <p className="text-xs text-[var(--color-text-dim)]">Instant code review</p>
                    </motion.div>

                    {/* Verified Certs card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="glow-card md:col-span-1 md:row-span-1 flex flex-col justify-center items-center text-center group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/15 transition-all duration-300">
                            <ShieldCheck size={28} className="text-cyan-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Verified Certs</h4>
                        <p className="text-xs text-[var(--color-text-dim)]">500+ hiring partners</p>
                    </motion.div>

                    {/* Real-World Architectures card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="glow-card md:col-span-2 md:row-span-1 flex flex-row items-center gap-8 relative overflow-hidden group"
                    >
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
                            style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08), transparent)' }} />
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Workflow size={28} className="text-amber-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2">Real-World Architectures</h3>
                            <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
                                Deploy microservices, handle scaling, and manage CI/CD pipelines natively in your learning environment.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Features;

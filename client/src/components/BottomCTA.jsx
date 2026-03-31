import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomCTA = () => {
    return (
        <section className="py-32 px-6 relative overflow-hidden flex justify-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center relative z-10 w-full"
            >
                {/* Outer glow border */}
                <div className="rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/20 via-transparent to-transparent">
                    <div className="rounded-3xl bg-[var(--color-surface)] p-12 md:p-20 flex flex-col items-center shadow-[0_0_80px_rgba(16,185,129,0.06)]">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8">
                            <Rocket size={36} className="text-blue-400" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Ready to Build <br />
                            <span className="text-gradient">Your Future?</span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                            Join thousands of developers shipping production code faster. Stop watching tutorials and start building real software today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/auth" className="btn btn-primary px-10 py-4 text-lg w-full sm:w-auto flex items-center justify-center gap-2 group">
                                Create Free Account
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/courses" className="btn btn-outline px-8 py-4 text-lg w-full sm:w-auto">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default BottomCTA;

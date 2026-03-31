import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            q: "Do I need prior coding experience?",
            a: "No! We have specialized tracks that take you from absolute beginner to production-ready developer. You can start with our 'Foundations' path."
        },
        {
            q: "What makes EduNex different from video courses?",
            a: "We don't just show you code; you write it. Our platform features an integrated Cloud IDE. You'll complete real-world projects, fix compiled errors, and get instant feedback from our AI tutor."
        },
        {
            q: "Are the certificates verified?",
            a: "Yes. Our 'Pro Developer' certificates are cryptographically verified and recognized by over 500+ tech hiring partners globally."
        },
        {
            q: "Can I pause my subscription?",
            a: "Absolutely. We understand life gets busy. You can pause your Pro subscription for up to 3 months without losing any of your saved progress or cloud instances."
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-32 px-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.04)_0%,transparent_50%)] pointer-events-none"></div>
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center mb-6"
                    >
                        <span className="section-label">
                            <HelpCircle size={14} /> FAQ
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-5"
                    >
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--color-text-muted)] text-lg"
                    >
                        Everything you need to know about the product and billing.
                    </motion.p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-2xl cursor-pointer transition-all duration-300 border p-6 
                                ${openIndex === i
                                    ? 'border-blue-500/30 bg-blue-500/[0.03]'
                                    : 'border-white/[0.06] bg-[var(--color-surface)] hover:border-white/10'
                                }`}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-bold text-white pr-8">{faq.q}</h4>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 transition-all duration-300 ${
                                    openIndex === i
                                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-400 rotate-180'
                                        : 'border-white/10 text-zinc-500'
                                }`}>
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        className="overflow-hidden text-[var(--color-text-muted)] leading-relaxed text-[0.95rem]"
                                    >
                                        {faq.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;

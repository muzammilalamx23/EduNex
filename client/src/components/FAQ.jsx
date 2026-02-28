import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <section className="py-32 px-6 bg-[#0c0c0e] border-y border-zinc-800 relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none"></div>
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
                    <p className="text-white text-lg">Everything you need to know about the product and billing.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`glass-card cursor-pointer transition-all duration-300 ${openIndex === i ? 'border-violet-500/30 bg-zinc-900/60' : 'hover:border-zinc-700'}`}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-bold text-white pr-8">{faq.q}</h4>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${openIndex === i ? 'border-violet-400 text-violet-400' : 'border-zinc-700 text-zinc-500'}`}>
                                    <span className={`transform transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
                                </div>
                            </div>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        className="overflow-hidden text-zinc-300 leading-relaxed text-sm"
                                    >
                                        {faq.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;

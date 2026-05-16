import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
        <section className="py-28 px-6 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-100 to-transparent" />
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
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg"
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
                                    ? 'border-violet-200 bg-violet-50/50'
                                    : 'border-gray-100 bg-white shadow-sm hover:border-violet-100'
                                }`}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-base font-bold text-gray-900 pr-8">{faq.q}</h4>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 transition-all duration-300 ${
                                    openIndex === i
                                        ? 'border-violet-300 bg-violet-100 text-violet-600 rotate-180'
                                        : 'border-gray-200 text-gray-400'
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
                                        className="overflow-hidden text-gray-500 leading-relaxed text-[0.95rem]"
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

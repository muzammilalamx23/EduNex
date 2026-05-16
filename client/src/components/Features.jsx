import React from 'react';
import { Terminal, Cpu, ShieldCheck, Workflow, Sparkles, Zap, Globe, Lock } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const features = [
    {
        icon: <Terminal size={24} />,
        title: 'Interactive Learning',
        desc: 'Code directly in the browser with our built-in AI-assisted IDE.',
        color: 'violet',
    },
    {
        icon: <Cpu size={24} />,
        title: 'AI Tutor',
        desc: 'Get instant code review, hints, and personalized feedback.',
        color: 'indigo',
    },
    {
        icon: <ShieldCheck size={24} />,
        title: 'Verified Certificates',
        desc: 'Earn industry-recognized credentials trusted by 500+ companies.',
        color: 'purple',
    },
    {
        icon: <Workflow size={24} />,
        title: 'Flexible Anytime Access',
        desc: 'Learn at your own pace with lifetime access to all content.',
        color: 'violet',
    },
    {
        icon: <Globe size={24} />,
        title: 'Global Community',
        desc: 'Connect with 100k+ learners and mentors from around the world.',
        color: 'indigo',
    },
    {
        icon: <Zap size={24} />,
        title: 'Certificates That Matter',
        desc: 'They reflect the skills employers actually need right now.',
        color: 'purple',
    },
];

const colorMap = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
};

const Features = () => {
    return (
        <section id="features" className="py-28 px-6 bg-gray-50 relative overflow-hidden">
            {/* Decorative top border line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    {/* Left: Image / Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg aspect-[4/3] flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-indigo-50" />
                        {/* Mock UI card */}
                        <div className="relative z-10 p-8 w-full">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                                        <Terminal size={18} className="text-violet-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Cloud IDE</div>
                                        <div className="text-xs text-gray-400">Instance running</div>
                                    </div>
                                    <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs leading-relaxed">
                                    <span className="text-violet-400">$</span> <span className="text-gray-900">edunex start cluster</span>
                                    <br />
                                    <span className="text-gray-500">Initializing containers...</span>
                                    <br />
                                    <span className="text-emerald-400">✓ Ready at localhost:3000</span>
                                    <div className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse" />
                                </div>
                            </div>

                            {/* Mini stat badges */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Courses', val: '450+' },
                                    { label: 'Learners', val: '100k+' },
                                    { label: 'Rating', val: '4.9★' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
                                        <div className="text-sm font-black text-violet-600">{s.val}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="section-label mb-5 inline-flex">
                            <Sparkles size={14} /> Why Choose Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5 mt-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Redefining{' '}
                            <span className="text-gradient">online learning</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Our platform combines expert-led instruction with smart tools to make
                            every learner faster, more confident, and industry-ready.
                        </p>
                    </motion.div>
                </div>

                {/* Feature cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => {
                        const c = colorMap[f.color];
                        return (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="edu-card group"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;

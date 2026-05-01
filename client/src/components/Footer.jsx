import React from 'react';
import { ArrowRight, Github, Twitter, Linkedin, GraduationCap, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-20 pb-10 px-6 relative overflow-hidden">
            {/* Purple glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">

                    {/* Brand */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg">
                                <GraduationCap size={18} className="text-gray-900" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                                Edu<span className="text-violet-600">Nex</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
                            Accelerating the careers of tomorrow's technological architects through AI-powered, community-driven learning.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3">
                            {[
                                { icon: <Github size={16} />, href: '#' },
                                { icon: <Twitter size={16} />, href: '#' },
                                { icon: <Linkedin size={16} />, href: '#' },
                            ].map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all duration-300"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            {['Courses', 'Playground', 'AI Tutor', 'Certifications', 'Roadmap'].map(l => (
                                <li key={l}><Link to={l === 'Courses' ? '/courses' : l === 'Roadmap' ? '/roadmap' : '#'} className="hover:text-violet-600 transition-colors">{l}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            {['About', 'Careers', 'Blog', 'Privacy', 'Terms'].map(l => (
                                <li key={l}><a href="#" className="hover:text-violet-600 transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-3 text-sm">Stay Updated</h4>
                        <p className="text-xs text-gray-500 mb-4">Get the latest courses and updates directly in your inbox.</p>
                        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 focus-within:border-violet-500 transition-colors">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-transparent px-3 py-2.5 w-full text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
                            />
                            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 transition-colors flex-shrink-0">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} EduNex. All rights reserved.</p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        {['Terms', 'Privacy', 'Cookies'].map(l => (
                            <a key={l} href="#" className="hover:text-gray-900 transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

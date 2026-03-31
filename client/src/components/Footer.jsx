import React from 'react';
import { ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-bg-dark)] pt-24 pb-10 px-6 border-t border-white/[0.04] relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center mb-6">
                            <span className="text-2xl font-bold tracking-tight text-white font-display">
                                Edu<span className="text-gradient">Nex</span>
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mb-8">
                            Accelerating the careers of tomorrow's technological architects through AI-powered learning.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3">
                            {[
                                { icon: <Github size={18} />, href: "#" },
                                { icon: <Twitter size={18} />, href: "#" },
                                { icon: <Linkedin size={18} />, href: "#" },
                            ].map((social, i) => (
                                <a key={i} href={social.href}
                                    className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links columns */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                            <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Courses</Link></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Playgrounds</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">AI Tutor</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Certifications</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                            <h4 className="text-white font-semibold mb-2 text-sm">Stay Updated</h4>
                            <p className="text-xs text-[var(--color-text-dim)] mb-4">Get the latest releases instantly.</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="bg-[var(--color-bg-dark)] border border-white/[0.08] rounded-l-xl px-3 py-2.5 w-full text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
                                />
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-r-xl transition-colors flex-shrink-0">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[var(--color-text-dim)]">
                        © {new Date().getFullYear()} EduNex. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-[var(--color-text-dim)]">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

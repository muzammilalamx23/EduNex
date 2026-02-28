import React from 'react';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black pt-20 pb-10 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <a href="#" className="flex items-center mb-6">
                        <span className="text-3xl font-black tracking-tighter text-white drop-shadow-md">Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Nex</span></span>
                    </a>
                    <p className="text-sm text-white leading-relaxed max-w-xs">
                        Accelerating the careers of tomorrow's technological architects.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-5">Ecosystem</h4>
                    <ul className="space-y-3 text-sm text-white">
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Playgrounds</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Open Source</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-5">Organization</h4>
                    <ul className="space-y-3 text-sm text-white">
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Company</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Changelog</a></li>
                        <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                    </ul>
                </div>

                <div>
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <h4 className="text-white font-medium mb-2 text-sm">Subscribe to Updates</h4>
                        <p className="text-xs text-white mb-4">Get the latest releases instantly.</p>
                        <div className="flex">
                            <input type="email" placeholder="Email" className="bg-black border border-zinc-800 rounded-l-lg px-3 py-2 w-full text-sm text-white focus:outline-none focus:border-cyan-500" />
                            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-r-lg transition-colors"><ArrowRight size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

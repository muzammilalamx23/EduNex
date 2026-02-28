import React from 'react';
import { Terminal, Cpu, ShieldCheck, Workflow } from 'lucide-react';

const Features = () => {
    return (
        <section id="features" className="py-32 px-6 bg-[#09090b]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Core <span className="text-gradient">Capabilities</span></h2>
                    <p className="text-white text-lg max-w-2xl mx-auto">Everything you need to write scaleable, production-level code. Directly in your browser.</p>
                </div>

                <div className="grid md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    {/* Big card - left */}
                    <div className="glass-card md:col-span-2 md:row-span-2 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                        <Terminal size={32} className="text-cyan-400 mb-6 relative z-10" />
                        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Cloud IDE Built-In</h3>
                        <p className="text-white mb-8 relative z-10">Launch a full-stack development environment instantly. Pre-configured with Docker, Node, and Python.</p>

                        <div className="mt-auto bg-[#000] border border-zinc-800 rounded-lg p-4 font-mono text-sm text-green-400 relative z-10 shadow-lg">
                            $ synth start cluster<br />
                            <span className="text-zinc-500">Initializing containers...</span><br />
                            <span className="text-cyan-400">Success: Instance ready at port 3000</span>
                        </div>
                    </div>

                    {/* Top right - small 1 */}
                    <div className="glass-card md:col-span-1 md:row-span-1 flex flex-col justify-center items-center text-center group cursor-pointer hover:border-violet-500/50">
                        <Cpu size={32} className="text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white">AI Tutor</h4>
                    </div>

                    {/* Top far right - small 2 */}
                    <div className="glass-card md:col-span-1 md:row-span-1 flex flex-col justify-center items-center text-center group cursor-pointer hover:border-emerald-500/50">
                        <ShieldCheck size={32} className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-bold text-white">Verified Certs</h4>
                    </div>

                    {/* Bottom right - wide */}
                    <div className="glass-card md:col-span-2 md:row-span-1 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20"></div>
                        <Workflow size={32} className="text-purple-400 mb-4 relative z-10" />
                        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Real-World Architectures</h3>
                        <p className="text-sm text-white relative z-10 max-w-sm">Learn to deploy microservices, handle scaling, and manage CI/CD pipelines natively.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;

import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomCTA = () => {
    return (
        <section className="py-32 px-6 relative overflow-hidden flex justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10 glass-card bg-black/40 border-cyan-500/20 p-12 md:p-20 flex flex-col items-center w-full">
                <Zap size={48} className="text-cyan-400 mb-8" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Compile <br /> Your Future?</h2>
                <p className="text-white text-lg mb-10 max-w-xl mx-auto">
                    Join thousands of developers shipping production code faster. Stop watching tutorials and start building real software today.
                </p>
                <Link to="/auth" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto" style={{ boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}>
                    Create Free Account
                </Link>
            </div>
        </section>
    );
};

export default BottomCTA;

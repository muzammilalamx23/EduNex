import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Top-left blue glow */}
            <motion.div
                animate={{
                    x: [0, 80, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[200px]"
                style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)' }}
            />
            {/* Right-center teal glow */}
            <motion.div
                animate={{
                    x: [0, -60, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[30%] -right-[10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[200px]"
                style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)' }}
            />
            {/* Bottom green glow */}
            <motion.div
                animate={{
                    x: [0, 40, -40, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[250px]"
                style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)' }}
            />
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
        </div>
    );
};

export default BackgroundAnimation;

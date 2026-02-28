import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-violet-600/10 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-cyan-600/10 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full bg-purple-600/10 blur-[150px]"
            />
        </div>
    );
};

export default BackgroundAnimation;

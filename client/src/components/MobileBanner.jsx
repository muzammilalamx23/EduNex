import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Monitor, X } from 'lucide-react';

export default function MobileBanner() {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        const isMobile = window.innerWidth <= 768;
        const dismissed = sessionStorage.getItem('edunex_mobile_dismissed');
        return isMobile && !dismissed;
    });

    useEffect(() => {
        // State initialized lazily above to prevent cascading renders
    }, []);

    const dismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('edunex_mobile_dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                >
                    <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg shrink-0">
                                <Monitor size={20} className="text-white" />
                            </div>
                            <p className="text-sm font-medium leading-tight">
                                For the best coding and learning experience, we recommend using EduNex on a laptop or desktop device.
                            </p>
                        </div>
                        <button
                            onClick={dismiss}
                            className="p-1 hover:bg-white/20 rounded-md transition-colors shrink-0"
                            aria-label="Dismiss banner"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

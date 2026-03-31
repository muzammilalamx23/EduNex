import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, BookOpen, Zap, MonitorPlay, User, LogOut, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const baseLinks = [
        { name: 'Platform', icon: <MonitorPlay size={20} />, href: '/#platform' },
        { name: 'Courses', icon: <BookOpen size={20} />, href: '/courses' },
        { name: 'Features', icon: <Zap size={20} />, href: '/#features' },
    ];

    const links = user?.role === 'admin'
        ? [...baseLinks, { name: 'Admin', icon: <User size={20} />, href: '/admin' }]
        : baseLinks;

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/');
    };

    return (
        <>
            {/* ── Mobile Navbar ────────────────────────────────── */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-[#030712]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                    <span className="text-2xl font-bold tracking-tight text-white font-display">
                        Edu<span className="text-gradient">Nex</span>
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="text-white p-1"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── Mobile Drawer ───────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden fixed top-[65px] left-0 right-0 z-40 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-6 flex flex-col gap-2"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-blue-400 font-medium py-3 transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-white/5 pt-4 flex flex-col gap-3 mt-2">
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                                        className="text-white font-medium py-3 hover:text-blue-400 transition-colors">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-[var(--color-text-muted)] font-medium py-3 hover:text-red-400 transition-colors"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/auth" onClick={() => setMobileOpen(false)}
                                    className="btn btn-primary text-center py-3 rounded-xl font-bold text-white">
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Desktop Dock Navbar ───────────────────────────── */}
            <motion.nav
                initial={{ y: -100, opacity: 0, x: '-50%' }}
                animate={{ y: 0, opacity: 1, x: '-50%' }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="hidden md:flex fixed top-6 left-1/2 z-50 items-center p-2 rounded-2xl backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{
                    background: 'rgba(3, 7, 18, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                }}
            >
                <Link to="/" className="mr-8 ml-4 flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
                    <span className="text-2xl font-bold tracking-tight text-white transition-all duration-300 group-hover:opacity-80 font-display">
                        Edu<span className="text-gradient">Nex</span>
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    {links.map((link, i) => {
                        const isHovered = hoveredIndex === i;
                        const isNeighbor = hoveredIndex === i - 1 || hoveredIndex === i + 1;
                        const isActive = location.pathname === link.href || (location.pathname + location.hash) === link.href;

                        return (
                            <Link
                                to={link.href}
                                key={link.name}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onFocus={() => setHoveredIndex(i)}
                                onBlur={() => setHoveredIndex(null)}
                                className={`relative flex flex-col items-center justify-center transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl ${isActive ? 'text-blue-400' : 'text-zinc-400 hover:text-white'}`}
                            >
                                <motion.div
                                    animate={{
                                        scale: isHovered ? 1.25 : isNeighbor ? 1.1 : 1,
                                        y: isHovered ? 8 : isNeighbor ? 4 : 0,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    className={`p-3 rounded-xl relative z-10 transition-colors ${
                                        isHovered ? 'bg-blue-500/10 text-blue-400' 
                                        : isActive ? 'bg-blue-500/5 text-blue-400'
                                        : 'hover:bg-white/5'
                                    }`}
                                >
                                    {link.icon}
                                    {isActive && (
                                        <div className="absolute -bottom-1.5 left-1/2 w-1 h-1 bg-blue-500 rounded-full -translate-x-1/2" />
                                    )}
                                </motion.div>

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                            className="absolute -bottom-12 px-3 py-1.5 bg-[var(--color-surface)] text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-lg border border-white/10 pointer-events-none z-50"
                                        >
                                            {link.name}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-surface)] border-t border-l border-white/10 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                <div className="w-px h-10 bg-white/8 mx-5" />

                <div className="flex items-center gap-3 pr-3">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="px-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                            <Link to="/dashboard" className="px-3 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 p-2 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20 hover:bg-red-500/10"
                                aria-label="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="px-4 text-sm font-medium text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus:ring-2 focus-visible:ring-blue-500 rounded-md">
                                Sign In
                            </Link>
                            <Link to="/auth" className="btn btn-primary px-5 py-2 text-sm flex items-center gap-2">
                                Start Free <ArrowRight size={14} />
                            </Link>
                        </>
                    )}
                </div>
            </motion.nav>
        </>
    );
};

export default Navbar;

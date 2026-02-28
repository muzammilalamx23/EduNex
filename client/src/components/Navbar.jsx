import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, BookOpen, Zap, MonitorPlay, User, LogOut, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);   // FIX: mobile menu state
    const { user, logout } = useAuth();                     // FIX: use context, no duplicate fetch
    const navigate = useNavigate();

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
            {/* ── Mobile Navbar ─────────────────────────────────────────── */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-lg border-b border-zinc-800 py-4 px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                    <span className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
                        Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Nex</span>
                    </span>
                </Link>
                {/* FIX: mobile menu button now toggles the drawer */}
                <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="text-white p-1"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── Mobile Dropdown Drawer ────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden fixed top-[65px] left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800 px-6 py-6 flex flex-col gap-4"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 text-zinc-300 hover:text-cyan-400 font-medium py-2 transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                                        className="text-white font-semibold py-2 hover:text-cyan-400 transition-colors">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-red-400 font-semibold py-2 hover:text-red-300 transition-colors"
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

            {/* ── Desktop Dock Navbar ───────────────────────────────────── */}
            <motion.nav
                initial={{ y: -100, opacity: 0, x: '-50%' }}
                animate={{ y: 0, opacity: 1, x: '-50%' }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="hidden md:flex fixed top-6 left-1/2 z-50 items-center p-3 rounded-3xl bg-zinc-900/70 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
                <Link to="/" className="mr-8 ml-2 flex items-center group">
                    <span className="text-3xl font-black tracking-tighter text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105">
                        Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Nex</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {links.map((link, i) => {
                        const isHovered = hoveredIndex === i;
                        const isNeighbor = hoveredIndex === i - 1 || hoveredIndex === i + 1;

                        return (
                            <Link
                                to={link.href}
                                key={link.name}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors group"
                            >
                                <motion.div
                                    animate={{
                                        scale: isHovered ? 1.5 : isNeighbor ? 1.15 : 1,
                                        y: isHovered ? 12 : isNeighbor ? 6 : 0,
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    className={`p-3.5 rounded-2xl relative z-10 transition-colors ${isHovered ? 'bg-zinc-800 text-cyan-400' : 'hover:bg-zinc-800/50'}`}
                                >
                                    {link.icon}
                                </motion.div>

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                            className="absolute -bottom-14 px-3 py-1.5 bg-zinc-800 text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-xl border border-zinc-700 pointer-events-none"
                                        >
                                            {link.name}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 border-t border-l border-zinc-700 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                <div className="w-px h-10 bg-white/10 mx-6" />

                <div className="flex items-center gap-3 pr-2">
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="px-3 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                            <Link to="/dashboard" className="px-3 text-sm font-medium text-white hover:text-cyan-300 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="px-3 text-sm font-medium text-white hover:text-cyan-300 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/auth" className="bg-gradient-to-r from-cyan-400 to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all">
                                Start Free
                            </Link>
                        </>
                    )}
                </div>
            </motion.nav>
        </>
    );
};

export default Navbar;

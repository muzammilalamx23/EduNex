import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, motion  } from 'framer-motion';
import { Menu, BookOpen, Map, User, LogOut, X, ArrowRight, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const baseLinks = [
        { name: 'Home',    href: '/' },
        { name: 'About',   href: '/#about' },
        { name: 'Courses', href: '/courses' },
        { name: 'Roadmap', href: '/roadmap' },
    ];

    const links = user?.role === 'admin'
        ? [...baseLinks, { name: 'Admin', href: '/admin' }]
        : baseLinks;

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/');
    };

    const isActive = (href) =>
        location.pathname === href || (href !== '/' && location.pathname.startsWith(href));

    return (
        <>
            {/* ── Desktop Navbar ─── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`hidden md:flex fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm'
                        : 'bg-white/80 backdrop-blur-md border-b border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-8 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-md">
                            <GraduationCap size={16} className="text-gray-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                            Edu<span className="text-violet-600">Nex</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive(link.href)
                                        ? 'text-violet-600 bg-violet-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-violet-600 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <NotificationBell />
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-semibold text-gray-700 hover:text-violet-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={15} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/auth"
                                    className="text-sm font-semibold text-gray-600 hover:text-violet-600 transition-colors px-3 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/auth"
                                    className="btn btn-primary text-sm px-5 py-2.5 rounded-xl flex items-center gap-1.5 group"
                                >
                                    Sign Up <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* ── Mobile Navbar ─── */}
            <div className="md:hidden fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center">
                            <GraduationCap size={14} className="text-gray-900" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            Edu<span className="text-violet-600">Nex</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {user && <NotificationBell />}
                        <button
                            onClick={() => setMobileOpen((p) => !p)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Drawer ─── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="md:hidden fixed top-[65px] left-0 right-0 z-[90] bg-white border-b border-gray-100 shadow-lg px-5 py-6 flex flex-col gap-1"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive(link.href)
                                        ? 'text-violet-600 bg-violet-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 pt-4 mt-3 flex flex-col gap-2">
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50">Dashboard</Link>
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium px-4 py-3 rounded-xl hover:bg-red-50 text-sm">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm text-center text-gray-600 font-medium py-3 px-4 rounded-xl hover:bg-gray-50">Sign In</Link>
                                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn btn-primary text-center py-3.5 rounded-xl font-bold text-sm">
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

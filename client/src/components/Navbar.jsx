import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, BookOpen, Zap, MonitorPlay, User, LogOut, X, ArrowRight, Map } from 'lucide-react';
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
        { name: 'Roadmap', icon: <Map size={20} />, href: '/roadmap' },
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
            <m.div className="md:hidden fixed top-0 w-full z-[100] bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                    <span className="text-2xl font-bold tracking-tight text-white font-display">
                        Edu<span className="text-[#FF8C37]">Nex</span>
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="text-white p-1"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </m.div>

            {/* ── Mobile Drawer ───────────────────────────────── */}
            <AnimatePresence mode="wait">
                {mobileOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed top-[65px] left-0 right-0 z-[90] bg-[#0D0D0D]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-8 flex flex-col gap-2 shadow-2xl"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 text-zinc-400 hover:text-white font-medium py-3 transition-colors px-4 rounded-xl hover:bg-white/5"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 pt-4 flex flex-col gap-3 mt-2">
                            {user ? (
                                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium py-3 px-4 rounded-xl hover:bg-red-500/5">
                                    <LogOut size={18} /> Logout
                                </button>
                            ) : (
                                <Link to="/auth" onClick={() => setMobileOpen(false)} className="bg-[#22C55E] text-[#0D0D0D] text-center py-4 rounded-xl font-extrabold text-sm shadow-[0_10px_20px_rgba(34,197,94,0.2)]">
                                    Join EduNex Free
                                </Link>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* ── Desktop Permanent Static Dock ─────────────────── */}
            <div className="hidden md:flex fixed top-8 left-0 w-full z-[100] justify-center pointer-events-none px-6">
                <m.nav
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex items-center p-2 rounded-2xl backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto bg-[#0D0D0D]/80"
                >
                    <Link to="/" className="mr-8 ml-4 flex items-center group">
                        <span className="text-xl font-black tracking-tighter text-white font-display flex items-center gap-1.5 translate-y-[-1px]">
                            Edu<span className="text-[#FF8C37]">Nex</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                        {links.map((link, i) => {
                            const isHovered = hoveredIndex === i;
                            const isActive = location.pathname === link.href || (location.pathname + location.hash) === link.href;

                            return (
                                <Link
                                    to={link.href}
                                    key={link.name}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className={`relative flex items-center justify-center transition-all duration-300 px-3.5 py-2.5 rounded-xl group ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#22C55E]/10 text-white' : isHovered ? 'bg-white/10' : ''}`}>
                                        {React.cloneElement(link.icon, { size: 18 })}
                                    </div>
                                    <span className={`text-[13px] ml-2 font-bold transition-opacity tracking-tight ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {link.name}
                                    </span>
                                    
                                    {isActive && (
                                        <m.div 
                                            layoutId="nav-pill-active"
                                            className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-[#22C55E] rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="w-[1px] h-8 bg-white/10 mx-6 opacity-50" />

                    <div className="flex items-center gap-3.5 pr-2.5">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="text-[13px] font-bold text-zinc-300 hover:text-white transition-colors tracking-tight">
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="p-2.5 rounded-xl bg-red-500/5 text-red-400/80 hover:bg-red-500/10 hover:text-red-500 transition-all border border-red-500/10"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/auth" className="px-3 text-[13px] font-bold text-zinc-400 hover:text-white transition-colors tracking-tight">
                                    Sign In
                                </Link>
                                <Link to="/auth" className="bg-[#22C55E] text-[#0D0D0D] px-6 py-2.5 rounded-[12px] font-black text-sm flex items-center gap-2 group shadow-[0_10px_20px_rgba(34,197,94,0.15)] hover:scale-[1.03] transition-transform">
                                    Start Free <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>
                </m.nav>
            </div>
        </>
    );
};

export default Navbar;  

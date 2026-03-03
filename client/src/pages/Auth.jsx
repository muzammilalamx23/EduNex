import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import BackgroundAnimation from '../components/BackgroundAnimation';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

    const navigate = useNavigate();
    const { user, login } = useAuth();

    // If already logged in, redirect immediately
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!isLogin && formData.fullName.trim().length < 2) {
            toast.error('Full name must be at least 2 characters.');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, formData);

            // New backend returns: { success: true, data: { token } }
            const token = response.data?.data?.token;
            if (token) {
                login(token); // AuthContext handles localStorage + user fetch
                toast.success(isLogin ? 'Welcome back!' : 'Account created! Welcome to EduNex 🚀');
                navigate('/dashboard');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white p-6 relative">
            <BackgroundAnimation />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card relative z-10 p-8 md:p-10 border-white/10"
            >
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="flex items-center mb-6">
                        <span className="text-3xl font-black tracking-tighter text-white">
                            Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Nex</span>
                        </span>
                    </Link>
                    <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-zinc-400 text-sm mt-2 text-center">
                        {isLogin ? 'Enter your credentials to access your dashboard' : 'Join thousands of developers mastering tech skills'}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    id="fullName"
                                    type="text"
                                    name="fullName"
                                    required
                                    autoComplete="name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Get Started'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-zinc-500 text-sm">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={() => setIsLogin((p) => !p)}
                            className="text-cyan-400 font-semibold ml-1.5 hover:text-cyan-300 transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// ─── Auth Context ─────────────────────────────────────────────────────────────
// Provides: user, loading, login, logout, refreshUser
// Consumed by: Navbar, Hero, Dashboard, and any component needing auth state.
// This eliminates the duplicate api.get('/api/auth/user') calls that were
// previously scattered across Navbar, Hero, and Dashboard.

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true on initial load

    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get('/api/auth/user');
            if (res.data.success) {
                setUser(res.data.data);
            }
        } catch (error) {
            // If the user isn't logged in (401), we set user to null silently
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on first mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (userData) => {
        // Successful logins (api.post('/auth/login')) will now just
        // trigger a fetch since the cookie is issued by the server.
        fetchUser();
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            window.location.href = '/auth'; // Hard redirect on logout for state reset
        }
    };

    // Exposed as `refreshUser` so Dashboard can trigger a re-fetch after
    // profile updates or lesson completion without prop drilling.
    const refreshUser = fetchUser;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Props:
 *   children     - The page/component to render when access is granted
 *   requireAdmin - If true, also checks that user.role === 'admin'
 *
 * Behavior:
 *   - While auth state is loading: shows a spinner (prevents flash-of-redirect)
 *   - If no user: redirects to /auth
 *   - If requireAdmin and user is not admin: redirects to /dashboard
 *   - Otherwise: renders children
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    // Show spinner while the initial auth check is in progress.
    // Without this, the page would flash-redirect to /auth momentarily.
    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;

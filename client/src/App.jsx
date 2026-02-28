import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Code splitting: each page is a separate JS chunk, loaded on demand.
// This dramatically reduces the initial bundle size.
const LandingPage = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCreateCourse = lazy(() => import('./pages/AdminCreateCourse'));
const AdminEditCourse = lazy(() => import('./pages/AdminEditCourse'));


// ─── Full-screen page loading fallback ────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
    <Loader2 className="animate-spin text-cyan-500" size={40} />
  </div>
);

export default function App() {
  return (
    // AuthProvider wraps everything — single user fetch on app load
    <AuthProvider>
      <Router>
        {/* Global toast notification system — replaces all alert() calls */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#06b6d4', secondary: '#18181b' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#18181b' } },
            duration: 4000,
          }}
        />

        {/* Suspense handles lazy loading transitions */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-detail/:courseId" element={<CourseDetail />} />

            {/* Protected: any logged-in user */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } />

            {/* Protected: admin only */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-course" element={
              <ProtectedRoute requireAdmin>
                <AdminCreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit-course/:courseId" element={
              <ProtectedRoute requireAdmin>
                <AdminEditCourse />
              </ProtectedRoute>
            } />
          </Routes>

        </Suspense>
      </Router>
    </AuthProvider>
  );
}

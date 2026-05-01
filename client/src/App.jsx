import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LazyMotion, domAnimation } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LandingPage = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCreateCourse = lazy(() => import('./pages/AdminCreateCourse'));
const AdminEditCourse = lazy(() => import('./pages/AdminEditCourse'));
const Playground = lazy(() => import('./pages/Playground'));
const RoadmapPage = lazy(() => import('./pages/Roadmap'));
const Community = lazy(() => import('./pages/Community'));

const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Loader2 className="animate-spin text-violet-600" size={40} />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <LazyMotion features={domAnimation} strict>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                fontSize: '14px',
                fontFamily: "'Inter', system-ui, sans-serif",
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: { iconTheme: { primary: '#7C3AED', secondary: '#ffffff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
              duration: 4000,
            }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course-detail/:courseId" element={<CourseDetail />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/course-detail/:courseId/community" element={<Community />} />

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
      </LazyMotion>
    </AuthProvider>
  );
}

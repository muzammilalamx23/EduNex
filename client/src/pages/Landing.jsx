import React, { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import HighConversionHero from '../components/HighConversionHero';

// Lazy load below-the-fold components
const Features     = lazy(() => import('../components/Features'));
const LearningPaths = lazy(() => import('../components/LearningPaths'));
const Metrics      = lazy(() => import('../components/Metrics'));
const FAQ          = lazy(() => import('../components/FAQ'));
const Footer       = lazy(() => import('../components/Footer'));

const FallbackLoader = () => (
    <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <Navbar />
            <main className="flex-1">
                <HighConversionHero />
                <Suspense fallback={<FallbackLoader />}>
                    <Features />
                    <LearningPaths />
                    <Metrics />
                    <FAQ />
                </Suspense>
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </div>
    );
};

export default LandingPage;

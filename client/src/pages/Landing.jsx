import React, { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import HighConversionHero from '../components/HighConversionHero';
import BackgroundAnimation from '../components/BackgroundAnimation';

// Lazy load below-the-fold components
const Features     = lazy(() => import('../components/Features'));
const LearningPaths = lazy(() => import('../components/LearningPaths'));
const Metrics      = lazy(() => import('../components/Metrics'));
const FAQ          = lazy(() => import('../components/FAQ'));
const TechStack    = lazy(() => import('../components/TechStack'));
const Footer       = lazy(() => import('../components/Footer'));

const FallbackLoader = () => (
    <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00FF00] border-t-transparent animate-spin"></div>
    </div>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-dark)] text-white selection:bg-[#00FF00]/25 relative">
            <BackgroundAnimation />
            <Navbar />
            <HighConversionHero />

            <Suspense fallback={<FallbackLoader />}>
                <Features />
                <LearningPaths />
                <Metrics />
                <TechStack />
                <FAQ />
                <Footer />
            </Suspense>
        </div>
    );
};

export default LandingPage;

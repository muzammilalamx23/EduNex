import React, { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackgroundAnimation from '../components/BackgroundAnimation';

const RoadmapSection = lazy(() => import('../components/RoadmapSection'));

const FallbackLoader = () => (
    <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin"></div>
    </div>
);

const RoadmapPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-violet-600/25 relative">
            <BackgroundAnimation />
            <Navbar />

            {/* Top padding to clear the fixed navbar */}
            <div className="pt-28">
                <Suspense fallback={<FallbackLoader />}>
                    <RoadmapSection />
                    <Footer />
                </Suspense>
            </div>
        </div>
    );
};

export default RoadmapPage;

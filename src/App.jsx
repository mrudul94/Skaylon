import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GrainOverlay from './components/GrainOverlay';
import WhatsAppFloat from './components/WhatsAppFloat';
import NarrativeJourneyPage from './pages/NarrativeJourneyPage';
import CaseStudyPage from './pages/CaseStudyPage';
import ServicePage from './pages/ServicePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import GoogleAnalytics from './components/GoogleAnalytics';

// ScrollToTop helper to reset window scroll position on routing change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to home with a hash anchor (e.g. /#commitment), scroll to that element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Default fallback to scroll to top
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <GoogleAnalytics />
      <div className="relative min-h-screen bg-[#121415] text-[#e2e2e3] font-body-md overflow-x-hidden pt-20">
        {/* Cinematic noise grain overlay */}
        <GrainOverlay />

        {/* Global Nav Bar */}
        <Navbar />

        <Routes>
          <Route path="/" element={<NarrativeJourneyPage />} />
          <Route path="/proof/:projectId" element={<CaseStudyPage />} />
          <Route path="/services/:serviceSlug" element={<ServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp Contact Button */}
        <WhatsAppFloat />
      </div>
    </Router>
  );
}

import React, { useEffect, useRef } from 'react';
import SEO from '../components/SEO';

export default function PrivacyPolicyPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    if (containerRef.current) {
      const revealElements = containerRef.current.querySelectorAll('.reveal');
      revealElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3]" ref={containerRef}>
      <SEO 
        title="Privacy Policy | Skaylon"
        description="Skaylon's privacy policy regarding data protection, client confidentiality, and software development security standards."
        path="/privacy-policy"
      />

      {/* Header Section */}
      <section className="relative min-h-[45vh] flex flex-col justify-center items-center px-6 md:px-16 text-center overflow-hidden soft-glow">
        <div className="relative z-10 space-y-6 max-w-4xl reveal visible">
          <span className="font-label-caps text-primary tracking-[0.4em] uppercase opacity-75">
            Legal Directory
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:text-5xl text-on-surface leading-tight">
            Privacy Policy.
          </h1>
          <p className="font-mono-code text-[11px] text-on-surface-variant/50">
            LAST MODIFIED: JUNE 18, 2026
          </p>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent"></div>
        </div>
      </section>

      {/* Policy Content Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">1. Scope of Privacy</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              At Skaylon, we treat user data and client information with strict operational integrity. This Privacy Policy outlines the types of information we collect, how we process it, and our protocols for preserving client confidentiality.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">2. Information Collection</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              We collect information in two categories:
            </p>
            <ul className="list-disc list-inside space-y-3 font-body-md text-on-surface-variant text-sm md:text-base pl-2">
              <li><strong>Contact Inquiries:</strong> Name, origin email address, and project requirements voluntarily provided via our intake form.</li>
              <li><strong>Usage Analytics:</strong> Anonymous diagnostic telemetry (browser agent types, sitemap navigation paths) captured to improve website rendering and loading speeds.</li>
            </ul>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">3. Data Processing & Security</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Data collected is processed solely to respond to project scoping queries. We implement modern security protocols (SSL/TLS transit encryption, restricted staging repository credentials, and credential hashing) to safeguard origin data against unauthorized access.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">4. Client & Project Confidentiality</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              As a strategic custom software studio, Skaylon holds proprietary client codebases, logic, database structures, and trade secrets in absolute confidence. We enter into formal Non-Disclosure Agreements (NDAs) prior to project blueprints and prevent code leakages through strictly partitioned, private developer sandboxes.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">5. Third-Party Integrations</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              This site utilizes standard external utilities including:
            </p>
            <ul className="list-disc list-inside space-y-2 font-body-md text-on-surface-variant text-sm md:text-base pl-2">
              <li><strong>Formspree:</strong> Handles secure form routing.</li>
              <li><strong>Google Fonts / Material Icons:</strong> Delivers typography and visual symbols.</li>
              <li><strong>Sanity CMS:</strong> Manages website project portfolio database.</li>
            </ul>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">6. Inquiries & Contact</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              For any questions regarding our confidentiality measures or to request the deletion of your telemetry/form history, please contact us directly:
            </p>
            <div className="font-mono-code text-xs text-primary pt-2">
              EMAIL: skaylon.in@gmail.com
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

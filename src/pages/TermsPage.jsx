import React, { useEffect, useRef } from 'react';
import SEO from '../components/SEO';

export default function TermsPage() {
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
        title="Terms and Conditions | Skaylon"
        description="Skaylon's terms and conditions including project scopes, estimates, intellectual property rights, and website disclaimers."
        path="/terms-and-conditions"
      />

      {/* Header Section */}
      <section className="relative min-h-[45vh] flex flex-col justify-center items-center px-6 md:px-16 text-center overflow-hidden soft-glow">
        <div className="relative z-10 space-y-6 max-w-4xl reveal visible">
          <span className="font-label-caps text-primary tracking-[0.4em] uppercase opacity-75">
            Legal Directory
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:text-5xl text-on-surface leading-tight">
            Terms & Conditions.
          </h1>
          <p className="font-mono-code text-[11px] text-on-surface-variant/50">
            LAST MODIFIED: JUNE 18, 2026
          </p>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent"></div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Website Disclaimer Card (User Provided) */}
          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 border-primary/25 reveal">
            <h2 className="font-headline-md text-xl text-primary border-b border-white/5 pb-4">1. Website Disclaimer</h2>
            <p className="font-body-lg text-white leading-relaxed text-sm md:text-base font-medium">
              The information presented on this website is for general informational purposes only. Project timelines, estimates, pricing, and service availability may vary depending on project scope and client requirements. Nothing on this website constitutes a binding offer or contractual agreement.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">2. Scope of Services</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Skaylon provides software design, development, consultation, and engineering services. All deliverables, timelines, milestones, and financial configurations are explicitly governed by individual, signed Master Service Agreements (MSAs) or Statements of Work (SOWs) executed directly between Skaylon and the client.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">3. Projects, Estimates & Variations</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Any pricing calculations, timelines, or scopes listed on this site or discussed in discovery are estimations based on preliminary inquiries. Actual schedules, costs, and resources required are calculated during Skaylon's systems blueprinting phase and will vary based on feature integrations and complexity.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">4. Intellectual Property</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Unless explicitly negotiated otherwise in writing, Skaylon transfers 100% of proprietary source code, assets, database models, and designs to the client upon project completion and full final invoice settlement. Skaylon reserves the right to showcase anonymized, non-proprietary visual interfaces within our digital portfolio.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">5. Limitation of Liability</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              Under no circumstances shall Skaylon, its founders, or its partners be held liable for direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, this website or the general informational materials provided herein.
            </p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-xl space-y-6 reveal">
            <h2 className="font-headline-md text-xl text-white border-b border-white/5 pb-4">6. Governing Law</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
              These terms are governed by and construed in accordance with the laws of India. Any legal actions or disputes arising from this site or our services shall be subject to the exclusive jurisdiction of the competent courts in Kasaragod, Kerala, India.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

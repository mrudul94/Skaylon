import React, { useEffect, useRef } from 'react';
import founderImage from "../../assets/founder.png";

export default function Connection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = containerRef.current.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleProceedClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('commitment');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="connection" ref={containerRef}>
      {/* Hero Section: Philosophy */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-16 pt-32 pb-16 md:pb-0 text-center overflow-hidden reveal">
        <div className="max-w-4xl space-y-8">
          <span className="font-label-caps text-primary tracking-[0.3em] uppercase block">
            Chapter 05 — Connection
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero italic">
            "Transparency is not a courtesy — it is how we work."
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Every engagement is founder-led. Mrudul handles your project personally — not a junior team, not an outsourced delivery partner.
          </p>
        </div>

        {/* Founder Portrait Frame */}
        <div className="mt-12 md:mt-20 w-full max-w-container-max flex flex-col items-center">
          <div className="w-full aspect-[4/3] md:aspect-[21/9] rounded-xl overflow-hidden glass-panel relative group shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] border border-white/5">
            <img
              src={founderImage}
              alt="Mrudul P - Founder of Skaylon"
              className="w-full h-full object-cover object-[70%_center] filter grayscale contrast-[1.1] brightness-[0.9] group-hover:scale-[1.02] transition-transform duration-[3000ms] ease-out"
            />

            {/* Premium editorial dark gradient overlay for text legibility */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent opacity-90"></div>
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

            {/* Mobile-only label inside image */}
            {/* <div className="absolute bottom-4 left-4 z-10 md:hidden bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded border border-white/5">
              <span className="font-label-caps text-primary text-[9px] tracking-[0.2em] uppercase opacity-95">
                FOUNDER'S PRINCIPLE
              </span>
            </div> */}

            {/* Desktop-only quote overlay */}
            <div className="hidden md:flex absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 text-left z-10 max-w-xl md:max-w-2xl space-y-6 flex-col">
              <div>
                <p className="font-label-caps text-primary text-[11px] tracking-[0.25em] mb-2 uppercase opacity-90">
                  FOUNDER'S PRINCIPLE
                </p>
                <h2 className="font-headline-lg text-2xl md:text-4xl text-white font-light tracking-wide leading-tight italic">
                  "We don't sell software. <br className="hidden md:block"/>We solve problems."
                </h2>
              </div>

              <div className="pt-4 border-t border-white/10 w-40">
                <p className="font-body-md text-white font-medium tracking-wide">Mrudul P</p>
                <p className="font-mono-code text-primary/70 text-[10px] uppercase tracking-wider">Founder, Skaylon</p>
              </div>
            </div>
          </div>

          {/* Mobile-only quote & details below the image */}
          <div className="md:hidden mt-8 text-left space-y-6 w-full px-2">
            <div className="space-y-3">
              <span className="font-label-caps text-primary text-[10px] tracking-[0.2em] uppercase opacity-80 block">
                Founder’s Principle
              </span>
              <h2 className="font-headline-lg text-[22px] text-white font-light tracking-wide leading-relaxed italic">
                "We don't sell software. We solve problems."
              </h2>
            </div>

            <div className="pt-4 border-t border-white/10 w-40">
              <p className="font-body-md text-white text-sm font-medium tracking-wide">Mrudul P</p>
              <p className="font-mono-code text-primary/70 text-[9px] uppercase tracking-wider">Founder, Skaylon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section: Why We Exist */}
      <section className="py-20 md:py-32 px-6 md:px-16 bg-[#0c0e0f] reveal">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-40 space-y-6">
            <h2 className="font-headline-lg text-3xl md:text-5xl italic">The Gap</h2>
            <div className="chapter-line-horizontal opacity-25"></div>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              I watched as development became a commodity, detached from the business outcomes it was meant to serve. Products were built without soul, and promises were made without accountability.
            </p>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              Skaylon exists to close that gap. We are not a factory; we are a partnership. We treat your product as if our reputation depends on it — because it does.
            </p>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-6 md:p-12 rounded-xl">
              <span className="font-mono-code text-primary block mb-2">01. The Problem</span>
              <h3 className="font-headline-md text-xl md:text-2xl mb-4 text-white">Development in a Vacuum</h3>
              <p className="text-on-surface-variant text-sm md:text-base">
                Traditional agencies focus on shipping features. We focus on shipping value. If a feature doesn't move your needle, it doesn't belong in your code.
              </p>
            </div>

            <div className="glass-panel p-6 md:p-12 rounded-xl">
              <span className="font-mono-code text-primary block mb-2">02. The Solution</span>
              <h3 className="font-headline-md text-xl md:text-2xl mb-4 text-white">Business-First Engineering</h3>
              <p className="text-on-surface-variant text-sm md:text-base">
                Every sprint is measured against your commercial objective, not just the feature list. If a task doesn't move your needle, it doesn't belong in the build.
              </p>
            </div>

            <div className="glass-panel p-6 md:p-12 rounded-xl border-primary/20">
              <span className="font-mono-code text-primary block mb-2">03. The Certification</span>
              <h3 className="font-headline-md text-xl md:text-2xl mb-4 text-white">Government Backed Credibility</h3>
              <p className="text-on-surface-variant text-sm md:text-base mb-6">
                Registered as a recognized MSME with Udyam Certification, Skaylon operates with the formal rigor and compliance required for world-class partnerships.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span className="font-label-caps text-[10px]">UDYAM CERTIFIED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
                  <span className="font-label-caps text-[10px]">MSME REGISTERED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Radical Honesty Section */}
      <section className="py-20 md:py-32 px-6 md:px-16 overflow-hidden reveal">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="relative aspect-square max-w-[450px] mx-auto rounded-xl overflow-hidden glass-panel">
                <img 
                  alt="Collaborative Space representation" 
                  className="w-full h-full object-cover filter grayscale contrast-110 opacity-70" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlmZFXtvrpEqLGLFdA8VODezqtVObGi8Aj5fwbhRWU_Fksi0791DmYRY1V-V-qpOoksmjWf2wNkmSdGw7Dw7TskzR_lVHTPveJXHgfM3oXcClnIZQf-dIw1U7zTe9yUAjyVS-d7i8bIjFDBd25zw0zVTmDH9duxRXaRYBRB4FDqtNdcRC_2pxNENYpJ3c6OxC5X8bTqztHLejImUFQSscQ6mNV5ua_-oh3n7UdrrN5ceiXXIsCByp19hj3k47XlHtxI2bp5p1233Ik"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 space-y-6 md:space-y-8">
              <h2 className="font-headline-lg text-3xl md:text-5xl italic">"If we don't think it should be built, we'll tell you."</h2>
              <p className="font-body-lg text-on-surface-variant">
                Quality isn't just about how well we code; it's about what we choose to code. Our commitment to you starts with radical honesty. We are your technical conscience.
              </p>
              <div className="flex gap-4 items-center">
                <div className="h-px w-16 bg-primary"></div>
                <span className="font-label-caps text-primary text-[10px] tracking-widest uppercase">How We Work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: The Pillars of Trust */}
      <section className="py-20 md:py-32 px-6 md:px-16 bg-[#0c0e0f] reveal">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline-lg text-3xl md:text-5xl">Human Accountability</h2>
            <p className="text-on-surface-variant font-body-lg">The core pillars of our professional relationship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-low border border-white/5 rounded-xl p-6 md:p-12 flex flex-col justify-end min-h-[300px] hover:border-white/15 transition-all">
              <span className="material-symbols-outlined text-4xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
                visibility
              </span>
              <h3 className="font-headline-md text-2xl text-white mb-4">Unfiltered Visibility</h3>
              <p className="text-on-surface-variant text-sm md:text-base max-w-lg">
                Access our internal Jira, Slack, and repositories. You see what we see, exactly when we see it. No filtered reports, just raw progress.
              </p>
            </div>

            <div className="bg-surface-container-low border border-white/5 rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] hover:border-white/15 transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">history</span>
              <div>
                <h4 className="font-headline-md text-[18px] text-white mb-2">Weekly Synchrony</h4>
                <p className="text-on-surface-variant text-xs md:text-sm">
                  Dedicated human time every week to review progress, pivot based on findings, and align focus.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low border border-white/5 rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] hover:border-white/15 transition-all">
              <span className="material-symbols-outlined text-primary text-3xl">balance</span>
              <div>
                <h4 className="font-headline-md text-[18px] text-white mb-2">Flat Ownership</h4>
                <p className="text-on-surface-variant text-xs md:text-sm">
                  Direct access to the engineers and designers building your product. No account managers or middle layers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Complete Transition */}
      <section className="py-20 max-w-container-max mx-auto text-center reveal">
        <span className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-widest mb-4 block">Next Narrative Phase</span>
        <h3 className="font-headline-lg text-3xl md:text-5xl mb-12">Chapter 6: Commitment</h3>
        <a 
          onClick={handleProceedClick}
          className="group relative inline-flex items-center gap-4 py-4 px-12 border border-primary/30 rounded-full hover:bg-primary transition-all duration-500 overflow-hidden cursor-pointer"
        >
          <span className="relative z-10 font-label-caps text-[11px] text-primary group-hover:text-on-primary transition-colors tracking-widest">
            CONTINUE JOURNEY
          </span>
          <span className="material-symbols-outlined relative z-10 text-primary group-hover:text-on-primary transition-colors text-[20px]">
            arrow_forward
          </span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </a>
      </section>
    </div>
  );
}

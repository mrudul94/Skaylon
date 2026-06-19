import React, { useEffect, useState } from 'react';

export default function Curiosity() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger hero entrance animations shortly after mounting
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('understanding');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="curiosity">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-12 px-6 md:px-16 soft-glow overflow-hidden">
        <div className="max-w-container-max w-full text-center relative z-10">
          <span 
            className={`font-label-caps text-on-tertiary-container tracking-[0.3em] uppercase block mb-8 transition-all duration-1000 ease-out ${
              mounted ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Chapter 1: Curiosity
          </span>
          <h1 
            className={`font-display-hero-mobile md:font-display-hero text-on-surface mb-12 transition-all duration-1000 delay-300 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            We think before <br className="hidden md:block"/> we build.
          </h1>
          <p 
            className={`font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 md:mb-16 transition-all duration-1000 delay-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Skaylon is a custom software development company and digital product development studio, acting as a strategic product partner for businesses that value clarity over code. Based in Kasaragod, Kerala, we partner with businesses across India and globally to design, build, and scale digital products. We treat software as a medium for solving deep structural challenges.
          </p>
          <div 
            className={`flex justify-center transition-all duration-1000 delay-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-px h-16 md:h-24 bg-gradient-to-b from-primary/50 to-transparent"></div>
          </div>
        </div>

        {/* Abstract Floating Vector Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-white/5 float-anim"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white/10 float-anim" style={{ animationDelay: '-2s' }}></div>
        </div>
      </section>

      {/* Problem Narrative Section */}
      <section className="py-20 md:py-32 px-6 md:px-16 bg-[#0c0e0f] relative overflow-hidden">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-12">
            <div className="w-12 h-px bg-primary/40"></div>
            <h2 className="font-headline-lg text-on-surface leading-tight">
              Most software is built to spec. <br/>
              <span className="text-on-surface-variant">We build to solve.</span>
            </h2>
            <div className="space-y-8 max-w-md">
              <p className="font-body-lg text-on-surface-variant">
                Business software development without a brief is guesswork. As a digital product development partner, we ask the questions most developers skip. Then we ask them again until the answer is precise enough to build from.
              </p>
            </div>
          </div>
          
          {/* Card Showcase with Strategic Product Discovery Scene */}
          <div className="flex flex-col gap-4 md:block">
            <div className="relative aspect-square md:aspect-auto md:h-[550px] group overflow-hidden rounded-xl border border-white/5">
              <img 
                alt="Premium strategic product discovery workstation showing user journey maps and UX wireframes" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                src="/curiosity_discovery.png"
              />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#121415] via-transparent to-transparent opacity-60"></div>
              <div className="hidden md:block absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 glass-panel p-6 rounded-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <p className="font-mono-code text-primary mb-2">01 / DISCOVERY PHASE</p>
                <p className="font-body-md text-on-surface">The objective isn't to start coding immediately. It's to understand your landscape clearly enough that the right solution becomes obvious.</p>
              </div>
            </div>

            {/* Mobile-only Glass Card */}
            <div className="block md:hidden glass-panel p-4 rounded-lg">
              <p className="font-mono-code text-primary mb-1.5 text-xs">01 / DISCOVERY PHASE</p>
              <p className="font-body-md text-on-surface text-[13.5px] leading-relaxed">The objective isn't to start coding immediately. It's to understand your landscape clearly enough that the right solution becomes obvious.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 1 Complete / Transition */}
      <section className="py-20 md:py-32 px-6 md:px-16 flex flex-col items-center justify-center relative bg-surface">
        <div className="chapter-line mb-12"></div>
        <div className="text-center max-w-4xl mx-auto space-y-20">
          <div className="space-y-4">
            <span className="font-label-caps text-on-tertiary-container tracking-widest text-[11px]">CHAPTER 1: COMPLETE</span>
            <h3 className="font-headline-lg text-on-surface">Curiosity has defined the path.</h3>
          </div>
          
          <div 
            onClick={handleProceedClick} 
            className="relative py-12 group cursor-pointer inline-block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center space-y-6">
              <p className="font-body-lg text-on-surface-variant max-w-lg mx-auto">
                Discovery complete. We know what needs to be built and why. Next, we turn that into a plan precise enough to execute.
              </p>
              <div className="flex items-center gap-3 text-primary group-hover:gap-5 transition-all duration-500">
                <span className="font-label-caps text-[11px] tracking-widest">PROCEED TO UNDERSTANDING</span>
                <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16 pt-12 border-t border-white/5">
            <div className="p-6 border border-white/5 rounded-lg hover:bg-surface-bright/5 transition-all h-full flex flex-col">
              <span className="font-mono-code text-primary">02.1</span>
              <h4 className="font-headline-md text-[20px] text-on-surface mt-4 mb-2">Synthesis</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Aggregating chaotic inputs into a single, cohesive product strategy.</p>
            </div>
            <div className="p-6 border border-white/5 rounded-lg hover:bg-surface-bright/5 transition-all h-full flex flex-col">
              <span className="font-mono-code text-primary">02.2</span>
              <h4 className="font-headline-md text-[20px] text-on-surface mt-4 mb-2">Definition</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Hardening the boundaries of the system before a single pixel is placed.</p>
            </div>
            <div className="p-6 border border-white/5 rounded-lg hover:bg-surface-bright/5 transition-all h-full flex flex-col">
              <span className="font-mono-code text-primary">02.3</span>
              <h4 className="font-headline-md text-[20px] text-on-surface mt-4 mb-2">Clarity</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">The point where the complex becomes simple and the difficult becomes possible.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

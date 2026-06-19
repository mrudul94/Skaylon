import React, { useEffect, useRef } from 'react';

export default function Understanding() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.15,
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
    const el = document.getElementById('confidence');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = (e) => {
    e.preventDefault();
    const el = document.getElementById('timeline');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="understanding" ref={containerRef}>
      {/* Chapter Intro */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-16 text-center relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-4xl reveal">
          <span className="font-label-caps text-primary tracking-[0.4em] uppercase opacity-75">
            Chapter 2: Understanding
          </span>
          <h1 className="font-display-hero-mobile md:font-display-hero text-on-surface">
            Clarity is the first deliverable.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Before we build, we observe. We turn ambiguity into a roadmap clear enough to build from.
          </p>
        </div>
        
        {/* Globally Centered Scroll Indicator */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 w-full">
          <div 
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-3 float-anim text-primary/60 hover:text-primary transition-colors cursor-pointer select-none"
          >
            <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-glow">
              Descend to clarity
            </span>
            <span 
              className="material-symbols-outlined text-[20px] text-primary"
              style={{ textShadow: '0 0 10px rgba(200, 198, 199, 0.5)' }}
            >
              arrow_downward
            </span>
          </div>
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent mt-4"></div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section id="timeline" className="max-w-container-max mx-auto px-6 md:px-16 py-20 md:py-32 relative">
        {/* Central Vertical Process Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] process-line hidden md:block"></div>

        <div className="space-y-16 md:space-y-32">
          {/* Milestone 1: Discovery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative reveal">
            <div className="order-2 md:order-1 md:text-right pr-0 md:pr-16">
              <span className="font-mono-code text-primary/60 mb-2 block">01 / DISCOVERY</span>
              <h2 className="font-headline-lg text-2xl md:text-4xl mb-4 italic">Identifying the invisible.</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                We audit your current landscape and challenge every assumption on the table. The output isn't a summary of what you told us — it's a map of what you actually need.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-start md:pl-16 relative">
              <div className="w-full aspect-square md:w-[350px] glass-panel rounded-xl relative overflow-hidden group">
                <img 
                  alt="Premium strategic product discovery environment showing UX audit boards and journey maps" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="/stage_01_discovery.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
              {/* Dot on line */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-bg hidden md:block z-20"></div>
            </div>
          </div>

          {/* Milestone 2: Research */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative reveal">
            <div className="flex justify-end md:pr-16 relative">
              <div className="w-full aspect-square md:w-[350px] glass-panel rounded-xl relative overflow-hidden group">
                <img 
                  alt="Sophisticated research and analytics environment showing data visualizations and dashboards" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="/stage_02_research.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-bg hidden md:block z-20"></div>
            </div>
            <div className="md:text-left pl-0 md:pl-16">
              <span className="font-mono-code text-primary/60 mb-2 block">02 / RESEARCH</span>
              <h2 className="font-headline-lg text-2xl md:text-4xl mb-4 italic">Evidence over intuition.</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                We research your users, your competitors, and the technology landscape — so we're not making assumptions when we build. Every decision that follows is backed by evidence, not intuition.
              </p>
            </div>
          </div>

          {/* Milestone 3: Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative reveal">
            <div className="order-2 md:order-1 md:text-right pr-0 md:pr-16">
              <span className="font-mono-code text-primary/60 mb-2 block">03 / DESIGN</span>
              <h2 className="font-headline-lg text-2xl md:text-4xl mb-4 italic">Structure follows intent.</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                UI/UX design is not decoration; it is the visual logic of the solution. We architect experiences that prioritize the user's focus, using space, hierarchy, and motion to tell a coherent story at every touchpoint.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-start md:pl-16 relative">
              <div className="w-full aspect-square md:w-[350px] glass-panel rounded-xl relative overflow-hidden group">
                <img 
                  alt="Premium UI/UX design studio workstation showing high-fidelity interface layouts and component libraries" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="/stage_03_design.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-bg hidden md:block z-20"></div>
            </div>
          </div>

          {/* Milestone 4: Engineering */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative reveal">
            <div className="flex justify-end md:pr-16 relative">
              <div className="w-full aspect-square md:w-[350px] glass-panel rounded-xl relative overflow-hidden group">
                <img 
                  alt="Premium software engineering setup showing multi-monitors, system architecture, and API flow designs" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="/stage_04_engineering.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-bg hidden md:block z-20"></div>
            </div>
            <div className="md:text-left pl-0 md:pl-16">
              <span className="font-mono-code text-primary/60 mb-2 block">04 / ENGINEERING</span>
              <h2 className="font-headline-lg text-2xl md:text-4xl mb-4 italic">The craft of the invisible.</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Execution is our obsession. Whether delivering premium website development services or complex web application development, we build with a focus on durability, performance, and scalability. The result is a system that performs as well as it looks — documented, maintainable, and built to last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Focus Section */}
      <section className="bg-surface-container-low py-20 md:py-32">
        <div className="max-w-container-max mx-auto px-6 md:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-12 reveal">
            <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface">
              As a web development company, we don't just sell websites or apps. <br/>
              <span className="text-primary italic">We sell business outcomes.</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left mt-16">
              <div className="p-6 md:p-8 border border-white/5 bg-background/50 rounded-xl space-y-4 hover:border-white/10 transition-colors h-full flex flex-col">
                <div className="w-12 h-[1px] bg-primary"></div>
                <h3 className="font-label-caps text-primary text-[11px]">Velocity</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Accelerating time-to-market by eliminating recursive design loops and technical debt.
                </p>
              </div>
              <div className="p-6 md:p-8 border border-white/5 bg-background/50 rounded-xl space-y-4 hover:border-white/10 transition-colors h-full flex flex-col">
                <div className="w-12 h-[1px] bg-primary"></div>
                <h3 className="font-label-caps text-primary text-[11px]">Equity</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Building brand value through high-fidelity experiences that command authority in your sector.
                </p>
              </div>
              <div className="p-6 md:p-8 border border-white/5 bg-background/50 rounded-xl space-y-4 hover:border-white/10 transition-colors h-full flex flex-col">
                <div className="w-12 h-[1px] bg-primary"></div>
                <h3 className="font-label-caps text-primary text-[11px]">Resilience</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  Creating technical infrastructure that adapts as your business evolves and scales globally.
                </p>
              </div>
            </div>

            <div className="pt-12">
  <button
    onClick={handleProceedClick}
    className="group px-8 py-4 rounded-full border border-primary hover:bg-primary transition-all duration-300 active:scale-95"
  >
    <span className="font-label-caps text-[11px] tracking-widest text-primary group-hover:text-on-primary transition-colors duration-300">
      ENTER CHAPTER 3: CONFIDENCE
    </span>
  </button>
</div>
          </div>
        </div>
      </section>
    </div>
  );
}

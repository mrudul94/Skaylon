import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../services/projectService';

export default function Confidence() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects dynamically
  useEffect(() => {
    let isMounted = true;
    fetchProjects()
      .then((data) => {
        if (!isMounted) return;
        // Filter: isConfidenceFeatured = true
        // Sort: confidencePriority ASC
        const confidenceFeatured = data
          .filter(p => p.isConfidenceFeatured)
          .sort((a, b) => a.confidencePriority - b.confidencePriority)
          .slice(0, 3); // Show only 3 projects
          
        setProjects(confidenceFeatured);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Confidence fetch failed:", err);
        setError("Failed to fetch featured projects");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Intersection Observer for slide reveals
  useEffect(() => {
    if (loading || projects.length === 0 || !containerRef.current) return;

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
  }, [loading, projects]);

  const handleProjectClick = (slug) => {
    if (!slug) return;
    navigate(`/proof/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('proof');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div id="confidence" className="py-20 text-center bg-[#121415] min-h-[50vh] flex flex-col justify-center">
        <span className="font-label-caps text-primary tracking-[0.3em] uppercase mb-6 block animate-pulse">
          Retrieving Featured Projects...
        </span>
        <div className="max-w-container-max mx-auto px-6 md:px-16 w-full space-y-16 mt-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 aspect-[4/3] bg-surface-container rounded-xl"></div>
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="h-4 w-24 bg-surface-container rounded"></div>
              <div className="h-10 w-64 bg-surface-container rounded"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-surface-container rounded"></div>
                <div className="h-4 w-5/6 bg-surface-container rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div id="confidence" className="py-20 text-center bg-[#121415]">
        <header className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-6">
          <div className="relative z-10 text-center max-w-4xl">
            <span className="font-label-caps text-primary tracking-[0.3em] uppercase mb-6 block">
              Confidence
            </span>
            <h1 className="font-display-hero text-display-hero-mobile md:text-5xl text-glow mb-8 text-white">
              Flagship Cases Arriving.
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto mb-12">
              Flags of confidence are currently being raised. Checked credentials and selected case studies will display here shortly.
            </p>
            <a 
              onClick={handleProceedClick}
              className="group relative inline-flex items-center gap-4 py-4 px-12 border border-primary/30 rounded-full hover:bg-primary transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 font-label-caps text-[11px] text-primary group-hover:text-on-primary transition-colors tracking-widest">
                CONTINUE TO PROOF
              </span>
              <span className="material-symbols-outlined relative z-10 text-primary group-hover:text-on-primary transition-colors text-[20px]">
                arrow_forward
              </span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </a>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div id="confidence" ref={containerRef} className="bg-[#121415]">
      {/* Chapter Intro */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-16">
        <div className="relative z-10 text-center max-w-4xl reveal">
          <span className="font-label-caps text-primary tracking-[0.3em] uppercase mb-6 block">
            The Third Narrative Arc
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-glow mb-8">
            Confidence.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            A demonstration of technical authority and creative precision. Selected work, with measurable outcomes.
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest">Scroll to Explore Projects</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </header>

      {/* Dynamic Projects Mapping */}
      {projects.map((proj, index) => {
        const isEven = index % 2 === 0;
        
        if (isEven) {
          // Image on Left, Details on Right
          return (
            <section key={proj.id} className="py-20 md:py-32 px-6 md:px-16 max-w-container-max mx-auto reveal">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                <div 
                  className="lg:col-span-7 overflow-hidden rounded-xl bg-surface-container border border-white/5 group cursor-pointer" 
                  onClick={() => handleProjectClick(proj.slug)}
                >
                  <img 
                    alt={proj.title} 
                    className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={proj.coverImage || proj.bgImage}
                  />
                </div>
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-primary-container text-primary rounded-full font-label-caps text-[10px] uppercase border border-primary/20">
                      {proj.category}
                    </span>
                  </div>
                  <h2 className="font-display-hero text-3xl md:text-5xl mb-6">{proj.title}</h2>
                  <div className="space-y-6 border-l border-white/10 pl-6 mb-8">
                    <div>
                      <h4 className="font-label-caps text-primary text-[10px] mb-1">Challenge</h4>
                      <p className="font-body-md text-on-surface-variant">
                        {proj.challenge?.summary || proj.shortDescription}
                      </p>
                    </div>
                    {proj.thinking?.summary && (
                      <div>
                        <h4 className="font-label-caps text-primary text-[10px] mb-1">Thinking</h4>
                        <p className="font-body-md text-on-surface-variant">
                          {proj.thinking.summary.length > 150 
                            ? proj.thinking.summary.substring(0, 150) + "..." 
                            : proj.thinking.summary}
                        </p>
                      </div>
                    )}
                    {proj.outcomes?.[0] && (
                      <div>
                        <h4 className="font-label-caps text-primary text-[10px] mb-1">Key Impact</h4>
                        <p className="font-body-md text-on-surface-variant font-bold text-white">
                          {proj.outcomes[0].metric} — {proj.outcomes[0].label}
                        </p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleProjectClick(proj.slug)}
                    className="self-start text-[11px] font-label-caps tracking-widest text-primary border-b border-primary/40 hover:border-primary pb-1 transition-all duration-300"
                  >
                    See how we built it &rarr;
                  </button>
                </div>
              </div>
            </section>
          );
        } else {
          // Image on Right, Details on Left (Asymmetric / Dark Section)
          return (
            <section key={proj.id} className="py-20 md:py-32 bg-[#0c0e0f] reveal">
              <div className="px-6 md:px-16 max-w-container-max mx-auto">
                <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-12 items-center">
                  <div 
                    className="w-full md:w-3/5 overflow-hidden rounded-xl border border-white/5 cursor-pointer group" 
                    onClick={() => handleProjectClick(proj.slug)}
                  >
                    <img 
                      alt={proj.title} 
                      className="w-full aspect-[16/9] object-cover transition-transform duration-1000 group-hover:scale-105" 
                      src={proj.coverImage || proj.bgImage}
                    />
                  </div>
                  <div className="w-full md:w-2/5 md:mt-0">
                    <span className="font-label-caps text-primary text-[10px] mb-3 block">
                      {proj.category}
                    </span>
                    <h2 className="font-display-hero text-3xl md:text-5xl mb-6">{proj.title}</h2>
                    <p className="font-body-lg text-on-surface-variant mb-8 italic leading-relaxed">
                      "{proj.shortDescription}"
                    </p>
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      <div className="p-5 bg-surface-container-low border border-white/5 rounded-lg">
                        <h4 className="font-label-caps text-primary text-[10px] mb-1">The Thinking</h4>
                        <p className="font-body-md text-on-surface-variant">
                          {proj.thinking?.summary 
                            ? (proj.thinking.summary.length > 150 ? proj.thinking.summary.substring(0, 150) + "..." : proj.thinking.summary)
                            : proj.shortDescription}
                        </p>
                      </div>
                      {proj.outcomes?.[0] && (
                        <div className="p-5 bg-surface-container-low border border-white/5 rounded-lg">
                          <h4 className="font-label-caps text-primary text-[10px] mb-1">Key Impact</h4>
                          <p className="font-body-md text-on-surface-variant font-bold text-white">
                            {proj.outcomes[0].metric} — {proj.outcomes[0].label}
                          </p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleProjectClick(proj.slug)}
                      className="text-[11px] font-label-caps tracking-widest text-primary border-b border-primary/40 hover:border-primary pb-1 transition-all duration-300"
                    >
                      See how we built it &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        }
      })}

      {/* Next Chapter Transition */}
      <section className="py-20 max-w-container-max mx-auto text-center reveal">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12 md:mb-20"></div>
        <span className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-widest mb-4 block">Next Narrative Phase</span>
        <h3 className="font-headline-lg text-3xl md:text-5xl mb-12">Chapter 4: Proof</h3>
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

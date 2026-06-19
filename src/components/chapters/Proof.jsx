import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../../services/projectService';

export default function Proof() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch projects dynamically
  useEffect(() => {
    let isMounted = true;
    fetchProjects()
      .then((data) => {
        if (!isMounted) return;
        // Filter: isProofFeatured = true
        // Sort: proofPriority ASC
        const proofFeatured = data
          .filter(p => p.isProofFeatured)
          .sort((a, b) => a.proofPriority - b.proofPriority);
        
        setProjects(proofFeatured);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Proof fetch failed:", err);
        setError("Failed to fetch showcase projects");
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
  }, [loading, projects, activeCategory, isExpanded]);

  const handleReadCaseStudy = (slug) => {
    if (!slug) return;
    navigate(`/proof/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('connection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsExpanded(false); // Reset expand state on filter change
  };

  // 1. Select the homepage spotlight project
  let spotlight = projects.find(p => p.homepageSpotlight);
  // Fallback to the first project in priority if none has spotlight = true
  if (!spotlight && projects.length > 0) {
    spotlight = projects[0];
  }

  // 2. Filter remaining projects (excluding the spotlight) for the grid showcase
  const remainingProjects = projects.filter(p => p.id !== spotlight?.id);

  // 3. Extract unique categories from remaining projects for filtering
  const categories = ['All', ...new Set(remainingProjects.map(p => p.category).filter(Boolean))];

  // 4. Filter remaining projects by active category selection
  const filteredProjects = activeCategory === 'All'
    ? remainingProjects
    : remainingProjects.filter(p => p.category === activeCategory);

  // 5. Paginated / split lists for smooth expand transition
  const initialProjects = filteredProjects.slice(0, 5);
  const extraProjects = filteredProjects.slice(5);
  const hasExtra = filteredProjects.length > 5;

  if (loading) {
    return (
      <div id="proof" className="py-20 text-center bg-[#121415] min-h-[50vh] flex flex-col justify-center">
        <span className="font-label-caps text-primary tracking-[0.3em] uppercase mb-6 block animate-pulse">
          Retrieving Showcase Directory...
        </span>
        <div className="max-w-container-max mx-auto px-6 md:px-16 w-full space-y-12 mt-8 animate-pulse">
          <div className="h-[300px] md:h-[500px] bg-surface-container rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div id="proof" className="py-20 text-center bg-[#121415] min-h-[50vh] flex flex-col justify-center">
        <span className="font-label-caps text-primary tracking-[0.3em] uppercase mb-6 block">
          Chapter 4: Proof
        </span>
        <h2 className="font-display-hero text-display-hero-mobile md:text-5xl text-glow mb-8 text-white">
          Showcase Directory Empty
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-12">
          No projects are marked for showcase at this moment. Dynamic contents will load once configured.
        </p>
      </div>
    );
  }



  return (
    <div id="proof" ref={containerRef} className="bg-[#121415]">
      
      {/* Spotlight Case Study Block */}
      {spotlight && (
        <section className="py-20 md:py-32 px-6 md:px-16 max-w-container-max mx-auto reveal">
          <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
            <div className="flex-1">
              <span className="font-label-caps text-primary tracking-[0.3em] uppercase block mb-4">
                Chapter 4: Proof
              </span>
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero mb-8 leading-none">
                Spotlight: {spotlight.title} Case Study.
              </h1>
              <p className="font-body-lg text-on-surface-variant max-w-2xl">
                {spotlight.description || spotlight.shortDescription}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-right shrink-0">
              <div className="text-on-tertiary-container font-label-caps text-[10px]">
                TIMELINE / {spotlight.duration?.toUpperCase() || spotlight.completionDate || 'ONGOING'}
              </div>
              <div className="text-on-tertiary-container font-label-caps text-[10px]">
                SECTOR / {(spotlight.sector || spotlight.category)?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Cinematic Mockup Frame Container */}
          <div 
            onClick={() => handleReadCaseStudy(spotlight.slug)}
            className="w-full flex flex-col md:block cursor-pointer group"
          >
           
            {/* <div className="block md:hidden mb-6 space-y-3">
              <span className="font-label-caps text-primary text-[10px] tracking-widest uppercase block">
                Featured Spotlight
              </span>
              <h2 
                className="font-headline-md text-white tracking-tight leading-snug line-clamp-2 max-w-[90%]"
                style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
              >
                {spotlight.title}
              </h2>
              <p className="font-body-md text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
                {spotlight.tagline || spotlight.shortDescription}
              </p>
            </div> */}

            {/* Laptop Mockup Image Frame */}
            <div className="w-full h-[200px] md:h-[500px] overflow-hidden rounded-xl border border-white/10 relative">
              <img 
                alt={`${spotlight.title} Mockup`}
                className="w-full h-full object-cover grayscale transition-all duration-[1200ms] group-hover:grayscale-0 group-hover:scale-103" 
                src={spotlight.coverImage || spotlight.bgImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121415] via-transparent to-transparent opacity-75"></div>
              
              {/* Desktop-only Text Overlay */}
              {/* <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-left z-10 hidden md:block">
                <span className="font-label-caps text-primary text-[10px] tracking-widest uppercase mb-1 block">Featured Spotlight</span>
                <p className="font-headline-md text-2xl md:text-4xl text-white">{spotlight.title}: {spotlight.tagline || spotlight.shortDescription}</p>
              </div> */}
            </div>

            {/* Mobile-only Case Study CTA (placed below mockup on mobile) */}
            <div className="block md:hidden mt-6 text-left">
              <div className="flex items-center gap-1 text-[11px] font-label-caps text-primary tracking-widest group-hover:gap-2 transition-all duration-300">
                SEE HOW WE BUILT IT
                <span className="material-symbols-outlined text-[16px] self-center">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Spotlight Impact Metrics */}
      {spotlight && spotlight.outcomes && spotlight.outcomes.length > 0 && (
        <section className="py-20 bg-[#0c0e0f] reveal">
          <div className="max-w-container-max mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="font-headline-lg text-3xl md:text-5xl mb-4">The Impact</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Key business value and technological parameters delivered.
              </p>
            </div>
            <div className="md:col-span-8 space-y-12">
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                {spotlight.challenge?.summary || spotlight.fullDescription}
              </p>
              
              {/* Impact Metrics Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-surface-container-low p-8 md:p-12 rounded-xl border border-white/5">
                {spotlight.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex flex-col justify-between p-6 bg-background/50 rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300">
                    <div>
                      <span className="font-display-hero text-4xl md:text-5xl text-primary block mb-2">{outcome.metric}</span>
                      <span className="font-label-caps text-[11px] tracking-wider text-white block">{outcome.label}</span>
                    </div>
                    {outcome.description && (
                      <p className="text-xs text-on-surface-variant/85 mt-4 leading-relaxed">
                        {outcome.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => handleReadCaseStudy(spotlight.slug)}
                  className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-[11px] hover:bg-surface-bright/20 hover:text-primary border border-primary transition-all duration-300"
                >
                  OPEN DETAILED {spotlight.title.toUpperCase()} STUDY
                </button>
                {remainingProjects[0] && (
                  <button 
                    onClick={() => handleReadCaseStudy(remainingProjects[0].slug)}
                    className="w-full sm:w-auto px-8 py-3 rounded-full font-label-caps text-[11px] text-primary border border-primary/20 hover:border-primary transition-all duration-300"
                  >
                    VIEW {remainingProjects[0].title.toUpperCase()} STUDY
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Showcase Directory Section */}
      {remainingProjects.length > 0 && (
        <section className="py-20 md:py-32 px-6 md:px-16 max-w-container-max mx-auto border-t border-white/5">
          <div className="text-center mb-16">
            <span className="font-label-caps text-primary tracking-[0.2em] block mb-2">Showcase Directory</span>
            <h2 className="font-headline-lg text-3xl md:text-5xl text-white">Narrative Catalogue</h2>
          </div>

          {/* Category Pill Filters */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12 reveal">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-5 py-2.5 rounded-full font-label-caps text-[10px] tracking-wider transition-all duration-300 border ${
                      isActive 
                        ? 'bg-primary text-[#121415] border-primary' 
                        : 'bg-transparent text-[#797982] border-white/10 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Initial 5 Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initialProjects.map((proj) => (
              <div 
                key={proj.id}
                onClick={() => handleReadCaseStudy(proj.slug)}
                className="group bg-surface-container-low border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:bg-surface-container transition-all duration-500 cursor-pointer flex flex-col h-full reveal"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
                    src={proj.coverImage || proj.bgImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121415] via-transparent to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-primary text-[10px] tracking-widest mb-2 block">
                      {proj.category}
                    </span>
                    <h3 className="font-headline-md text-xl text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {proj.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed mb-6">
                      {proj.shortDescription}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.techStack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-[#121415] text-[#797982] rounded font-mono-code text-[10px] uppercase border border-white/5">
                            {tech}
                          </span>
                        ))}
                        {proj.techStack.length > 3 && (
                          <span className="text-[10px] text-[#797982] self-center">+ {proj.techStack.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-[11px] font-label-caps text-primary tracking-widest pt-2 border-t border-white/5 group-hover:gap-2 transition-all duration-300">
                      EXPLORE STUDY
                      <span className="material-symbols-outlined text-[16px] self-center">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Smooth Expanding Grid container for Extra Projects */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 ease-in-out overflow-hidden ${
              isExpanded 
                ? 'max-h-[3000px] opacity-100 mt-8' 
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            {extraProjects.map((proj) => (
              <div 
                key={proj.id}
                onClick={() => handleReadCaseStudy(proj.slug)}
                className="group bg-surface-container-low border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:bg-surface-container transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
                    src={proj.coverImage || proj.bgImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121415] via-transparent to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-primary text-[10px] tracking-widest mb-2 block">
                      {proj.category}
                    </span>
                    <h3 className="font-headline-md text-xl text-white mb-3 group-hover:text-primary transition-colors duration-300">
                      {proj.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed mb-6">
                      {proj.shortDescription}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.techStack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-[#121415] text-[#797982] rounded font-mono-code text-[10px] uppercase border border-white/5">
                            {tech}
                          </span>
                        ))}
                        {proj.techStack.length > 3 && (
                          <span className="text-[10px] text-[#797982] self-center">+ {proj.techStack.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-[11px] font-label-caps text-primary tracking-widest pt-2 border-t border-white/5 group-hover:gap-2 transition-all duration-300">
                      EXPLORE STUDY
                      <span className="material-symbols-outlined text-[16px] self-center">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Explore Our Work CTA Button */}
          {hasExtra && (
            <div className="text-center mt-16 reveal">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-transparent hover:bg-white text-white hover:text-[#121415] px-10 py-4 rounded-full font-label-caps text-[11px] tracking-wider border border-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {isExpanded ? "Show Less" : "Explore Our Work"}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Transition to next chapter */}
      <section className="py-20 max-w-container-max mx-auto text-center reveal">
        <span className="font-label-caps text-on-surface-variant text-[11px] uppercase tracking-widest mb-4 block">Next Narrative Phase</span>
        <h3 className="font-headline-lg text-3xl md:text-5xl mb-12">Chapter 5: Connection</h3>
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

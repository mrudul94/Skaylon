import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProjectBySlug } from '../services/projectService';
import SEO from '../components/SEO';

const projectServicesMap = {
  "navora-global-ltd": [
    { slug: "custom-software-development", name: "Custom Software Development" },
    { slug: "web-application-development", name: "Web Application Development" }
  ],
  "tikitak-board-arena": [
    { slug: "web-application-development", name: "Web Application Development" },
    { slug: "mobile-app-development", name: "Mobile App Development" }
  ],
  "manifestos": [
    { slug: "website-development", name: "Website Development" },
    { slug: "ui-ux-design", name: "UI/UX Design" }
  ]
};

export default function CaseStudyPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerRef = useRef(null);

  // Fetch project dynamically based on slug (projectId route param)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProjectBySlug(projectId)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setError("Case study not found");
        } else {
          setProject(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Scroll Progress logic
  useEffect(() => {
    if (loading || error || !project) return;

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollWidth(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, error, project]);

  // Intersection Observer for slide reveals
  useEffect(() => {
    if (loading || error || !project || !containerRef.current) return;

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
  }, [loading, error, project]);

  if (loading) {
    return (
      <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3] flex flex-col items-center justify-center space-y-4">
        <SEO 
          title="Loading Case Study | Skaylon"
          description="Retrieving custom software and digital product details from the Skaylon showcase directory."
          path={`/proof/${projectId}`}
          noindex={true}
        />
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="font-label-caps text-[11px] text-primary tracking-widest animate-pulse">
          LOADING CORE DATA...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3] flex flex-col items-center justify-center px-6 text-center">
        <SEO 
          title="Case Study Not Found | Skaylon"
          description="The requested case study could not be located in the Skaylon showcase directory."
          path={`/proof/${projectId}`}
          noindex={true}
        />
        <span className="material-symbols-outlined text-primary text-5xl mb-4">warning</span>
        <h1 className="font-display-hero text-3xl md:text-5xl mb-4 text-white">Narrative Broken</h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
          {error || "We couldn't retrieve the requested project details."}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-[#121415] px-8 py-3 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-300"
        >
          Return to Narrative
        </button>
      </div>
    );
  }

  const handleCTAClick = () => {
    navigate('/#commitment');
    setTimeout(() => {
      const el = document.getElementById('commitment');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const displayTimeline = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toUpperCase()
    : (project.duration?.toUpperCase() || 'ONGOING');

  const displaySector = (project.sector || project.category || 'TECHNOLOGY').toUpperCase();
  const normalizedSlug = (project.slug || projectId || '').toLowerCase();
  const relatedServices = projectServicesMap[normalizedSlug] || [];

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "headline": project.tagline || project.shortDescription || project.title,
    "description": project.fullDescription || project.shortDescription,
    "image": project.coverImage || 'https://skaylon.com/partnership_begins.png',
    "url": `https://skaylon.com/proof/${project.slug}`,
    "creator": {
      "@type": "Organization",
      "name": "Skaylon",
      "url": "https://skaylon.com"
    }
  };

  return (
    <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3]" ref={containerRef}>
      <SEO 
        title={`${project.title} | Skaylon`}
        description={project.shortDescription || project.fullDescription}
        path={`/proof/${project.slug}`}
        ogImage={project.coverImage || 'https://skaylon.com/partnership_begins.png'}
        ogType="article"
        schemaStructure={projectSchema}
      />
      {/* Scroll indicator bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-primary z-[150] transition-all duration-100"
        style={{ width: `${scrollWidth}%` }}
      />

      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 reveal visible">
        <div className="flex flex-col md:flex-row gap-12 items-end">
          <div className="flex-1">
            <span className="font-label-caps text-on-tertiary-container text-[11px] mb-4 block">CHAPTER 4: PROOF</span>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero mb-4 leading-none">
              {project.title}
            </h1>
            {project.tagline && (
              <p className="font-headline-md text-lg md:text-2xl text-primary mb-8 italic">
                {project.tagline}
              </p>
            )}
            <p className="font-body-lg text-on-surface-variant max-w-2xl">
              {project.shortDescription}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-left md:text-right shrink-0">
            <div className="text-on-tertiary-container font-label-caps text-[10px]">TIMELINE / {displayTimeline}</div>
            <div className="text-on-tertiary-container font-label-caps text-[10px]">SECTOR / {displaySector}</div>
            {relatedServices && relatedServices.length > 0 && (
              <div className="text-on-tertiary-container font-label-caps text-[10px] flex flex-wrap md:justify-end gap-x-1">
                <span>SERVICES /</span>
                {relatedServices.map((srv, idx) => (
                  <React.Fragment key={srv.slug}>
                    <Link to={`/services/${srv.slug}`} className="text-primary hover:underline">
                      {srv.name.toUpperCase()}
                    </Link>
                    {idx < relatedServices.length - 1 && <span className="text-on-tertiary-container">,</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Large mockup banner */}
        {project.coverImage && (
          <div className="mt-16 w-full aspect-video md:h-[550px] md:aspect-auto overflow-hidden rounded-xl border border-white/10 relative group bg-[#0c0e0f]">
            <img 
              alt={`${project.title} Banner`}
              className="w-full h-full object-contain md:object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
              src={project.coverImage}
            />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#121415] via-transparent to-transparent opacity-60 pointer-events-none"></div>
          </div>
        )}
      </section>

      {/* The Challenge Section */}
      {project.challenge && project.challenge.summary && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 reveal">
          <div className="md:col-span-4">
            <h2 className="font-headline-lg text-3xl md:text-5xl sticky top-32">The Challenge</h2>
          </div>
          <div className="md:col-span-8">
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              {project.challenge.summary}
            </p>
          </div>
        </section>
      )}


      {/* The Thinking & Strategy */}
      {project.thinking && project.thinking.summary && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 reveal">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-12">
              <span className="font-label-caps text-primary text-[10px] mb-2 block">STRATEGIC ARCHITECTURE</span>
              <h2 className="font-headline-lg text-3xl md:text-5xl text-white">The Thinking</h2>
            </div>
            <div className="md:col-span-8">
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                {project.thinking.summary}
              </p>
            </div>
          </div>

          {project.thinking.pillars && project.thinking.pillars.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.thinking.pillars.map((pillar, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-px bg-white/10 w-full"></div>
                  <span className="text-white font-bold block text-sm md:text-base">0{index+1} / {pillar.title}</span>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Design Language Section */}
      {project.design && project.design.summary && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 reveal">
          <h2 className="font-headline-lg text-3xl md:text-5xl mb-12">The Design Language</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {project.design.image && (
              <div className="aspect-video rounded-xl overflow-hidden border border-white/5 relative group bg-[#0c0e0f]">
                <img 
                  alt={`${project.title} Design Spec`}
                  className="w-full h-full object-contain p-4 group-hover:scale-103 transition-transform duration-700" 
                  src={project.design.image}
                />
              </div>
            )}
            <div className="space-y-6">
              <p className="font-body-lg italic text-on-surface-variant leading-relaxed">
                "{project.design.summary}"
              </p>
              {project.design.colors && project.design.colors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-label-caps text-on-tertiary-container">COLOR PALETTE</h4>
                  <div className="flex flex-wrap gap-4">
                    {project.design.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="w-10 h-10 rounded-full border border-white/20"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project Image Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 border-t border-white/5 reveal">
          <h2 className="font-headline-lg text-3xl md:text-5xl mb-12">Project Visuals</h2>
          
          {project.gallery.length === 1 ? (
            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/5 relative group aspect-video bg-[#0c0e0f]">
              <img 
                alt={`${project.title} Gallery Image 1`}
                className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-102"
                src={project.gallery[0]}
              />
            </div>
          ) : project.gallery.length === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((imageUrl, index) => (
                <div key={index} className="rounded-xl overflow-hidden border border-white/5 relative group aspect-video bg-[#0c0e0f]">
                  <img 
                    alt={`Project Gallery Image ${index + 1}`}
                    className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-102"
                    src={imageUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.gallery.map((imageUrl, index) => (
                <div key={index} className="rounded-xl overflow-hidden border border-white/5 relative group aspect-video bg-[#0c0e0f]">
                  <img 
                    alt={`Project Gallery Image ${index + 1}`}
                    className="w-full h-full object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-102"
                    src={imageUrl}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* The Engineering Section */}
      {project.engineering && (project.engineering.description || (project.engineering.specs && project.engineering.specs.length > 0)) && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 md:py-20 border-t border-white/5 reveal">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <h2 className="font-headline-lg text-3xl md:text-5xl">The Engineering</h2>
              {project.engineering.description && (
                <p className="font-body-lg text-on-surface-variant leading-relaxed">
                  {project.engineering.description}
                </p>
              )}
            </div>
            <div className="md:col-span-5 bg-surface-container-low p-8 rounded-xl border border-white/5 space-y-6">
              {project.engineering.specs && project.engineering.specs.length > 0 ? (
                <div className="space-y-4">
                  <span className="font-label-caps text-primary text-[10px] tracking-[0.3em] uppercase block">
                    TECHNICAL SPECIFICATIONS
                  </span>
                  <div className="space-y-3">
                    {project.engineering.specs.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-on-surface-variant text-sm">{spec.key}</span>
                        <span className="font-mono-code text-primary text-xs">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="font-label-caps text-primary text-[10px] tracking-[0.3em] uppercase block">
                    TECHNOLOGY STACK
                  </span>
                  {project.techStack && project.techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span key={index} className="px-2.5 py-0.5 bg-[#121415] text-[#797982] rounded font-mono-code text-[10px] uppercase border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant">No parameters specified</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Metric Impact Numbers */}
      {project.outcomes && project.outcomes.length > 0 && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 reveal">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start py-12 border-t border-white/5">
            <div className="md:col-span-4">
              <h2 className="font-headline-lg text-3xl md:text-5xl mb-4">The Impact</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Measurable value delivered through precision engineering and design thinking.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-surface-container-low p-6 md:p-12 rounded-xl border border-white/5">
                {project.outcomes.map((outcome, index) => (
                  <div key={index} className="flex flex-col justify-between p-6 bg-background/50 rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300">
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
            </div>
          </div>
        </section>
      )}

      {/* External Links */}
      {(project.liveUrl || project.githubUrl) && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 text-center reveal">
          <div className="flex justify-center gap-6">
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-label-caps text-[11px] tracking-wider border border-primary text-primary hover:bg-primary hover:text-[#121415] transition-all duration-300"
              >
                Launch Live Experience
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-label-caps text-[11px] tracking-wider border border-white/10 text-white hover:border-primary transition-all duration-300"
              >
                View Repository
                <span className="material-symbols-outlined text-[16px]">code</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Related Services Capabilities */}
      {relatedServices && relatedServices.length > 0 && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-12 border-t border-white/5 reveal">
          <div className="glass-panel p-8 rounded-xl space-y-6">
            <span className="font-label-caps text-primary text-[10px] tracking-widest block">System Capabilities Involved</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedServices.map((srv) => (
                <div key={srv.slug} className="p-6 bg-[#121415]/50 border border-white/5 rounded-lg flex flex-col justify-between items-start gap-4 hover:border-primary/25 transition-all">
                  <div>
                    <h4 className="font-headline-md text-base md:text-lg text-white mb-2">{srv.name}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Read our dedicated capability guide for {srv.name} to understand our architecture, tech stack, and full delivery processes.
                    </p>
                  </div>
                  <Link 
                    to={`/services/${srv.slug}`}
                    className="text-[10px] font-label-caps text-primary border-b border-primary/25 hover:border-primary pb-0.5 transition-colors"
                  >
                    View Capability Guide &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Action CTA */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-16 md:py-24 text-center reveal">
        <h2 className="font-headline-lg text-3xl md:text-5xl mb-8">Ready to define your own proof?</h2>
        <button 
          onClick={handleCTAClick}
          className="bg-white text-[#121415] px-10 py-4 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Start the Conversation
        </button>
      </section>
    </div>
  );
}


import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import SEO from '../components/SEO';
import FAQ from '../components/FAQ';
import { Helmet } from 'react-helmet-async';

export default function ServicePage() {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const service = servicesData[serviceSlug];

  useEffect(() => {
    if (!service) return;

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

    const revealElements = containerRef?.current?.querySelectorAll('.reveal');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [serviceSlug, service]);

  if (!service) {
    // Redirect or render NotFound page if slug is not matched
    return (
      <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3] flex flex-col items-center justify-center px-6 text-center">
        <SEO 
          title="Service Not Found | Skaylon"
          description="The requested capability guide could not be located in our service directory."
          path={`/services/${serviceSlug}`}
          noindex={true}
        />
        <span className="material-symbols-outlined text-primary text-5xl mb-4">warning</span>
        <h1 className="font-display-hero text-3xl md:text-5xl mb-4 text-white">Service Not Found</h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
          The requested Skaylon capability does not exist in our directory.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-white text-[#121415] px-8 py-3 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-300"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleCTAClick = () => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('commitment');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Skaylon",
      "url": "https://skaylon.com"
    },
    "serviceType": service.h1
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://skaylon.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://skaylon.com/#understanding"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.h1.replace(/\.$/, ''),
        "item": `https://skaylon.com/services/${serviceSlug}`
      }
    ]
  };

  return (
    <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3]" ref={containerRef}>
      <SEO 
        title={service.title}
        description={service.description}
        path={`/services/${serviceSlug}`}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center px-6 md:px-16 text-center overflow-hidden soft-glow">
        <div className="relative z-10 space-y-6 max-w-4xl reveal visible">
          <span className="font-label-caps text-primary tracking-[0.4em] uppercase opacity-75">
            Skaylon Capability
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:font-display-hero text-on-surface leading-tight">
            {service.h1}
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {service.overview}
          </p>
          <div className="pt-6">
            <button
              onClick={handleCTAClick}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-[11px] tracking-widest hover:bg-surface-bright/20 hover:text-primary border border-primary transition-all duration-300"
            >
              {service.cta.buttonText.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent"></div>
        </div>
      </section>

      {/* Benefits Grid Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-20 md:py-32 border-t border-white/5 relative z-10">
        <div className="text-center mb-16 space-y-4 reveal">
          <span className="font-label-caps text-primary tracking-[0.2em] uppercase block">
            Why Partner With Skaylon
          </span>
          <h2 className="font-headline-lg text-3xl md:text-5xl text-white">
            Operational Benefits.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {service.benefits.map((benefit, index) => (
            <div 
              key={index}
              className="glass-panel p-8 rounded-xl space-y-4 hover:border-primary/25 transition-all duration-300 flex flex-col justify-between h-full reveal"
            >
              <div>
                <div className="w-12 h-[1px] bg-primary mb-6"></div>
                <h3 className="font-headline-md text-xl text-white mb-2">{benefit.title}</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
                  {benefit.description}
                </p>
              </div>
              <span className="font-mono-code text-[11px] text-primary/40 block pt-4">0{index + 1} / BENEFIT</span>
            </div>
          ))}
        </div>
      </section>

      {/* Process Workflow Section */}
      <section className="bg-[#0c0e0f] py-20 md:py-32 relative overflow-hidden z-10 border-t border-white/5">
        <div className="max-w-container-max mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 sticky top-36 space-y-6 reveal">
              <span className="font-label-caps text-primary tracking-[0.2em] uppercase block">
                The Methodology
              </span>
              <h2 className="font-headline-lg text-3xl md:text-5xl italic text-white leading-tight">
                Our Delivery Process.
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                We design and engineer transparently, maintaining strict milestones and checking code health at every build stage.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-8">
              {service.process.map((step, index) => (
                <div 
                  key={index}
                  className="glass-panel p-6 md:p-8 rounded-xl border border-white/5 space-y-4 hover:border-white/10 transition-all reveal"
                >
                  <h3 className="font-headline-md text-lg md:text-xl text-white">{step.title}</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Localized Supporting Content Section */}
      {service.localContent && (
        <section className="max-w-container-max mx-auto px-6 md:px-16 py-20 md:py-28 border-t border-white/5 relative z-10">
          <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="font-label-caps text-primary tracking-[0.2em] uppercase block">
                Regional Delivery & Impact
              </span>
              <h2 className="font-headline-lg text-2xl md:text-4xl text-white">
                {service.localContent.heading}
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                {service.localContent.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Accordion FAQ Component */}
      <FAQ customFaqs={service.faqs} />

      {/* Final Intake Callout */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 py-20 md:py-32 text-center reveal">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-headline-lg text-3xl md:text-5xl text-white">
            {service.cta.title}
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            Connect with our engineering and design founders today. We will audit your current requirements and prepare a technical blueprint mapping your exact path forward.
          </p>
          <button 
            onClick={handleCTAClick}
            className="bg-white text-[#121415] px-10 py-4 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {service.cta.buttonText}
          </button>
        </div>
      </section>
    </div>
  );
}

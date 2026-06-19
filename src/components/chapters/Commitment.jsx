import React, { useEffect, useRef, useState } from 'react';

export default function Commitment() {
  const containerRef = useRef(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    if (containerRef.current) {
      const revealElements = containerRef.current.querySelectorAll('.reveal');
      revealElements.forEach((el) => observer.observe(el));
    }

    // Console warning if Formspree endpoint is missing
    if (!import.meta.env.VITE_FORMSPREE_ENDPOINT) {
      console.warn(
        '[Skaylon Contact] VITE_FORMSPREE_ENDPOINT environment variable is missing. ' +
        'Contact form submissions will fallback to opening mailto:skaylon.in@gmail.com.'
      );
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formState.name || !formState.email || !formState.service || !formState.subject || !formState.message) {
      setError('Please fill out all required fields.');
      return;
    }

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

    setLoading(true);

    if (!endpoint) {
      console.warn(
        '[Skaylon Contact] VITE_FORMSPREE_ENDPOINT is missing. ' +
        'Falling back to mailto:skaylon.in@gmail.com.'
      );

      // Construct mailto link with form details
      const emailTo = 'skaylon.in@gmail.com';
      const subject = encodeURIComponent(formState.subject);
      const body = encodeURIComponent(
        `Full Name: ${formState.name}\n` +
        `Email Address: ${formState.email}\n` +
        `Service Interested In: ${formState.service}\n` +
        `Subject: ${formState.subject}\n\n` +
        `Project Details:\n${formState.message}`
      );

      // Trigger mailto redirect
      window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

      setSubmitted(true);
      setLoading(false);
      setFormState({ name: '', email: '', service: '', subject: '', message: '' });
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', service: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong while submitting. Please try again.');
      }
    } catch (err) {
      console.error('[Skaylon Contact] Form submission error:', err);
      setError('Failed to send inquiry. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="commitment" ref={containerRef}>
      {/* Chapter Title */}
      <div className="max-w-container-max mx-auto px-6 md:px-16 mb-12 reveal">
        <div className="flex items-center gap-4 text-primary opacity-60">
          <span className="font-mono-code tracking-[0.2em]">CHAPTER 06</span>
          <div className="h-[1px] w-12 bg-primary/30"></div>
          <span className="font-label-caps">COMMITMENT</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 mb-12 md:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end reveal">
        <div className="lg:col-span-8">
          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero mb-8 text-on-surface leading-none">
            Ready to start?
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-xl">
            The end of the journey and the start of a partnership. We don't just build software. We build the system your business depends on — and we stay accountable for how it performs. Let’s start the conversation.
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-end">
          <div className="w-full aspect-square max-w-[280px] glass-panel rounded-xl overflow-hidden relative group">
            <img 
              alt="Premium project initiation environment representing the beginning of a client partnership" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="/partnership_begins.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121415]/90 via-[#121415]/50 to-[#121415]/20 group-hover:via-[#121415]/40 transition-all duration-1000"></div>
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 text-center">
              <p className="font-label-caps text-primary/60 group-hover:text-primary transition-colors duration-1000 tracking-wider">
                {submitted ? 'CONNECTION ESTABLISHED' : 'PARTNERSHIP BEGINS'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where We Work Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 mb-20 md:mb-32 reveal">
        <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="font-label-caps text-primary tracking-[0.2em] uppercase block">
              Geographic Scope
            </span>
            <h2 className="font-headline-lg text-2xl md:text-4xl text-white">
              Where We Work
            </h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              Based in Kasaragod, Kerala, Skaylon partners with startups, businesses, and organizations across India and international markets to build websites, web applications, mobile applications, and custom software systems.
            </p>
          </div>
        </div>
      </section>

      {/* Intake Form Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-16 mb-20 md:mb-32 reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Side: Approach details */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface italic">A Human-Centered Intake.</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Instead of rigid forms and product requests, we want to hear about the friction you're facing. What keeps you from moving forward? Tell us about the problem, not the product.
              </p>
            </div>
            
            <div className="space-y-8 pt-8 border-t border-white/10">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
                <div>
                  <p className="font-label-caps text-on-tertiary-container text-[10px] mb-1">EMAIL DIRECT</p>
                  <p className="font-body-lg text-white">
                    <a href="mailto:skaylon.in@gmail.com" className="hover:text-primary transition-colors">
                      skaylon.in@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <p className="font-label-caps text-on-tertiary-container text-[10px] mb-1">LOCATION</p>
                  <p className="font-body-lg text-white">Kasaragod, Kerala, India</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div>
                  <p className="font-label-caps text-on-tertiary-container text-[10px] mb-1">AVAILABILITY</p>
                  <p className="font-body-lg text-white">9:30 AM — 6:30 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Intake Form Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
              
              {submitted ? (
                <div className="relative z-10 text-center py-12 space-y-6">
                  <span className="material-symbols-outlined text-primary text-6xl block">verified</span>
                  <h3 className="font-headline-md text-2xl text-white">Connection Initialized</h3>
                  <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    We have successfully registered your inquiry in our secure portal. Skaylon's founding team will reach out directly via your provided origin address within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[11px] font-label-caps text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors pt-4"
                  >
                    SUBMIT ANOTHER INTAKE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-on-tertiary-container text-[10px]">FULL NAME *</label>
                      <input 
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        className="w-full bg-[#1a1c1d] border border-white/5 rounded-lg p-4 font-body-md text-white input-glow transition-all"
                        placeholder="Full Name" 
                        type="text"
                        required
                        disabled={loading}
                      />
                    </div>
                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-on-tertiary-container text-[10px]">EMAIL ADDRESS *</label>
                      <input 
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#1a1c1d] border border-white/5 rounded-lg p-4 font-body-md text-white input-glow transition-all"
                        placeholder="Email Address" 
                        type="email"
                        required
                        disabled={loading}
                      />
                    </div>
                    {/* Service Interested In */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-on-tertiary-container text-[10px]">SERVICE INTERESTED IN *</label>
                      <select 
                        name="service"
                        value={formState.service}
                        onChange={handleInputChange}
                        className="w-full bg-[#1a1c1d] border border-white/5 rounded-lg p-4 font-body-md text-white input-glow transition-all cursor-pointer"
                        required
                        disabled={loading}
                      >
                        <option value="" disabled className="bg-[#1a1c1d] text-on-surface-variant/50">Select a service</option>
                        <option value="Website Development" className="bg-[#1a1c1d] text-white">Website Development</option>
                        <option value="Web Application Development" className="bg-[#1a1c1d] text-white">Web Application Development</option>
                        <option value="Mobile App Development" className="bg-[#1a1c1d] text-white">Mobile App Development</option>
                        <option value="Custom Software Solutions" className="bg-[#1a1c1d] text-white">Custom Software Solutions</option>
                        <option value="UI/UX Design" className="bg-[#1a1c1d] text-white">UI/UX Design</option>
                        <option value="Backend & API Integration" className="bg-[#1a1c1d] text-white">Backend & API Integration</option>
                        <option value="Software Consulting" className="bg-[#1a1c1d] text-white">Software Consulting</option>
                        <option value="Other" className="bg-[#1a1c1d] text-white">Other</option>
                      </select>
                    </div>
                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-on-tertiary-container text-[10px]">SUBJECT *</label>
                      <input 
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        className="w-full bg-[#1a1c1d] border border-white/5 rounded-lg p-4 font-body-md text-white input-glow transition-all"
                        placeholder="Subject" 
                        type="text"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  {/* Project Details */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-on-tertiary-container text-[10px]">PROJECT DETAILS *</label>
                    <textarea 
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a1c1d] border border-white/5 rounded-lg p-4 font-body-md text-white input-glow transition-all resize-none"
                      placeholder="Describe your project goals, timeline, and requirements..." 
                      rows="5"
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                  
                  {/* Error State Banner */}
                  {error && (
                    <div className="border border-red-500/20 bg-red-950/20 text-[#f87171] rounded-lg p-4 text-sm font-body-md flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#f87171]">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-4">
                    <button 
                      className={`w-full md:w-auto bg-primary text-on-primary px-8 py-4 rounded-full font-label-caps text-[11px] hover:bg-surface-bright/20 hover:text-primary border border-primary transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Sending Inquiry...' : 'Send Inquiry'}
                      {!loading && (
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic Corridor Closure Element */}
      {/* <section className="w-full h-[550px] relative overflow-hidden flex items-center justify-center reveal">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-10"></div>
          <img 
            className="w-full h-full object-cover opacity-20 grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChi0R6SgBQTrJWJNDIKAvb5B420r1IOYvBeWBpPwicGGN1DWN7SxCaojjQGaHh8aXuDhTZAxLgViucc5i0V5Lg8PFfDgdZbQkRMJAgBPhBTD09remLUJYIgGLv44RLi8KWvATfCzbjs1Ebo9GGA_y644wqGmXxL2Ej1UuHcBrhoVaGGilasXUtd8JmgLaQyBYDYbUiwkwk45OVuWULx6V0DxReXKCvq8oVRB29vBhp1vVHYP1BKoGs0JCy8yQ0RYuAYp1QD6lFg9lT"
            alt="Cinematic corridor architecture lighting representation"
          />
        </div>
        <div className="relative z-20 text-center space-y-6 max-w-2xl px-6">
          <p className="font-label-caps text-on-tertiary-container tracking-[0.3em] text-[10px]">SKAYLON 2026</p>
        </div>
      </section> */}
    </div>
  );
}

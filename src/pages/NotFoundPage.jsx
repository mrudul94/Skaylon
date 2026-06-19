import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-4 min-h-screen bg-[#121415] text-[#e2e2e3] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <SEO 
        title="Page Not Found | Skaylon" 
        description="The requested page could not be located on the Skaylon narrative path." 
        path="/404" 
        noindex={true} 
      />

      {/* Futuristic glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-xl space-y-8">
        <div className="space-y-4">
          <span className="font-mono-code text-primary tracking-[0.3em] uppercase block">
            ERROR 404 / PAGE NOT FOUND
          </span>
          <h1 className="font-display-hero text-display-hero-mobile md:text-6xl text-glow mb-4 text-white">
            Narrative Severed.
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The coordinate path you are attempting to traverse does not exist or has been relocated within the Skaylon domain.
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={() => navigate('/')}
            className="group relative inline-flex items-center gap-4 py-4 px-12 border border-primary/30 rounded-full hover:bg-primary transition-all duration-500 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 font-label-caps text-[11px] text-primary group-hover:text-on-primary transition-colors tracking-widest">
              RETURN TO MAIN NARRATIVE
            </span>
            <span className="material-symbols-outlined relative z-10 text-primary group-hover:text-on-primary transition-colors text-[20px]">
              arrow_forward
            </span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

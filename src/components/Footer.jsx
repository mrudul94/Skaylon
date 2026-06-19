import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="w-full py-20 bg-surface-container-lowest border-t border-white/5 relative z-10">
      <div className="max-w-container-max mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 md:w-1/3">
          <div className="font-headline-lg text-[36px] tracking-tighter text-on-surface">SKAYLON</div>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Intentional design. Strategic engineering. Uncompromising execution.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 md:w-1/2">
          {/* Services Column */}
          <div className="space-y-4">
            <span className="font-label-caps text-label-caps text-on-tertiary-container text-[11px] block">SERVICES</span>
            <div className="flex flex-col gap-2">
              <Link
                to="/services/website-development"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Website Development
              </Link>
              <Link
                to="/services/web-application-development"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Web Application Development
              </Link>
              <Link
                to="/services/mobile-app-development"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Mobile App Development
              </Link>
              <Link
                to="/services/custom-software-development"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Custom Software Development
              </Link>
              <Link
                to="/services/ui-ux-design"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                UI/UX Design
              </Link>
            </div>
          </div>

          {/* Case Studies Column */}
          <div className="space-y-4">
            <span className="font-label-caps text-label-caps text-on-tertiary-container text-[11px] block">CASE STUDIES</span>
            <div className="flex flex-col gap-2">
              <Link
                to="/proof/navora-global-ltd"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Navora
              </Link>
              <Link
                to="/proof/manifestos"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                ManifestOS
              </Link>
              <Link
                to="/proof/tikitak-board-arena"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                TikiTak
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <span className="font-label-caps text-label-caps text-on-tertiary-container text-[11px] block">COMPANY</span>
            <div className="flex flex-col gap-2">
              <a
                href="#connection"
                onClick={(e) => handleLinkClick(e, 'connection')}
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                About
              </a>
              <a
                href="#commitment"
                onClick={(e) => handleLinkClick(e, 'commitment')}
                className="text-on-surface-variant hover:text-primary transition-colors text-sm hover:underline decoration-primary/30 underline-offset-4"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:text-right">
          <span className="font-label-caps text-label-caps text-on-tertiary-container text-[11px] block">CREDENTIALS</span>
          <p className="text-xs text-on-surface-variant/60 leading-relaxed uppercase tracking-widest">
            UDYAM-KL-05-0037475<br />
            MSME REGISTERED ENTITY
          </p>
          {/* <div className="flex md:justify-end gap-6 text-on-surface-variant/50 pt-2">
            <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">share</span>
            <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">verified_user</span>
            <span className="material-symbols-outlined text-[20px] hover:text-primary cursor-pointer transition-colors">public</span>
          </div> */}
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <p className="font-label-caps text-[10px] text-on-surface-variant/40 tracking-[0.2em]">
            © 2026 SKAYLON TECHNOLOGY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="font-label-caps text-[9px] text-on-surface-variant/40 hover:text-primary transition-colors tracking-widest">
              PRIVACY POLICY
            </Link>
            <Link to="/terms-and-conditions" className="font-label-caps text-[9px] text-on-surface-variant/40 hover:text-primary transition-colors tracking-widest">
              TERMS & CONDITIONS
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-1.5">
          <p className="font-mono-code text-[11px] text-on-surface-variant/30 italic">
            Built with accountability from Kasaragod, Kerala.
          </p>
          <p className="font-body-sm text-[11px] text-on-surface-variant/30 text-left md:text-right leading-relaxed">
            Based in Kasaragod, Kerala, India.<br />
            Serving businesses across India and globally.
          </p>
        </div>
      </div>
    </footer>
  );
}

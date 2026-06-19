import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const chapters = [
  { id: 'curiosity', label: 'Curiosity' },
  { id: 'understanding', label: 'Understanding' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'proof', label: 'Proof' },
  { id: 'connection', label: 'Connection' },
  { id: 'commitment', label: 'Commitment' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('curiosity');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  // Track active chapter during scroll on home page
  useEffect(() => {
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the mid-upper part of screen
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
      // Wait a tick for navigation to occur then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 w-full h-20 border-b border-white/10 bg-[#121415]/95 backdrop-blur-2xl shadow-lg z-[200] flex items-center"
      >
        <div className="max-w-container-max mx-auto px-6 md:px-16 flex justify-between items-center w-full">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="font-headline-md tracking-tighter text-on-surface cursor-pointer select-none text-xl nav-desktop:text-2xl shrink-0"
            style={{ letterSpacing: '-0.05em' }}
          >
            SKAYLON
          </div>

          {/* Chapters list (Desktop) */}
          <div className="hidden nav-desktop:flex items-center gap-5 xl:gap-8">
            {chapters.map((chapter) => {
              const isActive = isHomePage && activeSection === chapter.id;
              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  onClick={(e) => handleNavClick(e, chapter.id)}
                  className={`font-label-caps text-label-caps tracking-widest text-[11px] pb-1 border-b transition-all duration-300 ${
                    isActive
                      ? 'text-primary font-bold border-primary'
                      : 'text-on-surface-variant hover:text-on-surface border-transparent'
                  }`}
                >
                  {chapter.label}
                </a>
              );
            })}
          </div>

          {/* Action Button & Hamburger */}
          <div className="flex items-center gap-2 nav-desktop:gap-3 shrink-0">
            <button
              onClick={(e) => handleNavClick(e, 'commitment')}
              className="hidden nav-desktop:block bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-surface-bright/20 hover:text-primary border border-primary transition-all duration-500 ease-out active:scale-95 shrink-0"
            >
              Connect
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-desktop:hidden bg-surface-container-low border border-white/5 text-white w-11 h-11 rounded-full flex items-center justify-center hover:border-white/20 transition-all active:scale-95 shrink-0"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[18px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Background click layer to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[185] nav-desktop:hidden bg-black/40 backdrop-blur-sm transition-all duration-500"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-down Menu Panel */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 w-[95%] bg-[#121415]/98 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 transition-all duration-500 ease-out z-[190] nav-desktop:hidden top-20 ${
          menuOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.9)',
        }}
      >
        <div className="flex flex-col gap-4 items-center max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
          {chapters.map((chapter) => {
            const isActive = isHomePage && activeSection === chapter.id;
            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={(e) => {
                  handleNavClick(e, chapter.id);
                  setMenuOpen(false);
                }}
                className={`font-label-caps text-label-caps tracking-widest text-[12px] py-2 w-full text-center border-b border-white/5 transition-all duration-300 ${
                  isActive
                    ? 'text-primary font-bold border-primary'
                    : 'text-on-surface-variant hover:text-on-surface border-transparent'
                }`}
              >
                {chapter.id === 'commitment' ? 'Contact' : chapter.label}
              </a>
            );
          })}
          <button
            onClick={(e) => {
              handleNavClick(e, 'commitment');
              setMenuOpen(false);
            }}
            className="w-full mt-2 bg-primary text-on-primary py-3 rounded-full font-label-caps text-[11px] tracking-wider hover:bg-surface-bright/20 hover:text-primary border border-primary transition-all duration-500 ease-out active:scale-95 flex items-center justify-center gap-2"
          >
            Connect
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </>
  );
}

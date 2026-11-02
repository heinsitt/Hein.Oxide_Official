import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders, Menu, X, Play, Youtube } from 'lucide-react';

interface NavbarProps {
  onOpenReel: () => void;
  onOpenA11y: () => void;
  ambientSoundActive: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReel,
  onOpenA11y,
  ambientSoundActive,
  onToggleSound
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07090a]/90 backdrop-blur-md border-b border-[#f3ede2]/10 py-3.5 shadow-lg'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 md:py-6'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <a
            href="#hero"
            className="flex items-center gap-3 shrink-0 group focus-visible:ring-2 focus-visible:ring-[#d9803f] rounded-lg p-1"
            aria-label="Heino Xide - Return to Top"
          >
            <img
              src="/assets/aistudio/logo_1041e95d.jpg"
              alt="Heino Xide Crest"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-sm object-cover border border-white/20"
              width="32"
              height="32"
            />
            <span className="font-serif text-lg sm:text-xl font-normal tracking-tight text-[#f3ede2] group-hover:text-white transition-colors whitespace-nowrap">
              Heino <span className="italic text-[#d9803f] font-light">Xide</span>
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] tracking-[0.14em] uppercase text-[#f3ede2]/75 font-medium"
          >
            <a
              href="#films"
              className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
            >
              Films
            </a>
            <a
              href="#studio-3d"
              className="text-[#e9be86] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>3D Studio</span>
            </a>
            <a
              href="#about"
              className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
            >
              Story
            </a>
            <a
              href="#gear"
              className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
            >
              Gear
            </a>
            <a
              href="#locations"
              className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
            >
              Locations
            </a>
            <a
              href="#subscribe"
              className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d9803f] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap shrink-0"
            >
              Permissions
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action + Quick Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Ambient Audio Synth Button */}
            <button
              onClick={onToggleSound}
              aria-label={ambientSoundActive ? 'Mute ambient ocean breeze' : 'Play ambient ocean breeze'}
              className={`p-2 rounded-full border transition-all ${
                ambientSoundActive
                  ? 'bg-[#d9803f]/20 border-[#d9803f] text-[#d9803f]'
                  : 'bg-white/5 border-white/10 text-[#f3ede2]/70 hover:text-white hover:bg-white/10'
              }`}
              title={ambientSoundActive ? 'Soundscape on (Click to mute)' : 'Soundscape muted (Click to play)'}
            >
              {ambientSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Accessibility Settings Trigger */}
            <button
              onClick={onOpenA11y}
              aria-label="Open accessibility and visual settings"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-[#f3ede2]/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Accessibility & display preferences"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenReel}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d9803f] hover:bg-[#c56e2f] text-[#07090a] font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-[#d9803f]/20 active:scale-95 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Reel
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg text-[#f3ede2] hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Sheet */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/logo_1041e95d.jpg"
                alt="Heino Xide Logo"
                className="h-8 w-8 rounded-sm object-cover"
              />
              <span className="font-serif text-xl text-[#f3ede2]">
                Heino <span className="italic text-[#d9803f]">Xide</span>
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-2.5 rounded-lg text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-5 py-6 text-xl font-serif text-[#f3ede2]">
            <a
              href="#films"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5"
            >
              <span>Featured Films</span>
              <span className="text-xs font-mono text-[#d9803f]">01</span>
            </a>
            <a
              href="#studio-3d"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5 text-[#e9be86]"
            >
              <span>3D Drone Workbench</span>
              <span className="text-xs font-mono text-[#d9803f]">02</span>
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5"
            >
              <span>Cinematic Story</span>
              <span className="text-xs font-mono text-[#d9803f]">03</span>
            </a>
            <a
              href="#gear"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5"
            >
              <span>Equipment Arsenal</span>
              <span className="text-xs font-mono text-[#d9803f]">04</span>
            </a>
            <a
              href="#locations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5"
            >
              <span>Rakhine Locations</span>
              <span className="text-xs font-mono text-[#d9803f]">05</span>
            </a>
            <a
              href="#subscribe"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#d9803f] transition-colors py-2 flex items-center justify-between border-b border-white/5"
            >
              <span>Clip Permissions & Collab</span>
              <span className="text-xs font-mono text-[#d9803f]">06</span>
            </a>
          </nav>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReel();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#d9803f] text-[#07090a] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Drone Showreel
            </button>
            <div className="flex items-center justify-between gap-3 text-xs text-[#f3ede2]/70 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenA11y();
                }}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 text-white/90"
              >
                <Sliders className="w-3.5 h-3.5 text-[#d9803f]" />
                Display Settings
              </button>
              <a
                href="https://www.youtube.com/@heinoxide5128?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 text-white/90 hover:text-white"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                Subscribe (110)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

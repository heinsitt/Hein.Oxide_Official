import React from 'react';
import { Youtube, Compass, ArrowUp, Sliders } from 'lucide-react';

interface FooterProps {
  onOpenA11y: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenA11y }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050708] border-t border-white/10 text-xs text-[#f3ede2]/60 pt-16 pb-12">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/logo_1041e95d.jpg"
                alt="Heino Xide Logo"
                className="w-7 h-7 rounded-sm object-cover"
              />
              <span className="font-serif text-lg text-white">
                Heino <span className="italic text-[#d9803f]">Xide</span>
              </span>
            </div>
            <p className="text-xs text-[#f3ede2]/70 max-w-sm leading-relaxed">
              "The world is originally in peace." — Cinematic stillness and aerial documentary archive from Kyaukphyu, Rakhine State.
            </p>
            <div className="text-[11px] text-[#e9be86] font-mono">
              Films by Hein Thu Tun (Heino Xide) · Maintained by Hein Sitt Tun
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-[11px] uppercase tracking-wider text-white font-semibold mb-3">
              Archive & Navigation
            </div>
            <div className="flex flex-col gap-2">
              <a href="#films" className="hover:text-white transition-colors">Featured Films</a>
              <a href="#about" className="hover:text-white transition-colors">Filmmaker Story</a>
              <a href="#gear" className="hover:text-white transition-colors">Camera Arsenal</a>
              <a href="#locations" className="hover:text-white transition-colors">Kyaukphyu Coastline</a>
              <a href="#subscribe" className="hover:text-white transition-colors">Monthly Dispatch</a>
            </div>
          </div>

          {/* Social & External Platforms */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="text-[11px] uppercase tracking-wider text-white font-semibold mb-3">
              Connect & Follow
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.youtube.com/@heinoxide5128"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube Channel (110 Subscribers)</span>
              </a>
              <a
                href="https://www.facebook.com/planet.heinoxide"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook Community</span>
              </a>
              <a
                href="https://github.com/heinsitt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#d9803f]" />
                <span>GitHub Developer Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#f3ede2]/50">
          <div>
            &copy; {new Date().getFullYear()} Heino Xide &bull; Kyaukphyu, Rakhine State, Myanmar. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenA11y}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#d9803f]" />
              <span>Accessibility Preferences</span>
            </button>
            <span aria-hidden="true">&bull;</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

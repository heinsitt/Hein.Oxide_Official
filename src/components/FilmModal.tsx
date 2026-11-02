import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Share2, Film as FilmIcon, Camera, Compass, Clock, Eye, Check } from 'lucide-react';
import { Film } from '../data/films';

interface FilmModalProps {
  film: Film | null;
  onClose: () => void;
}

export const FilmModal: React.FC<FilmModalProps> = ({ film, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (film) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [film, onClose]);

  if (!film) return null;

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(film.youtubeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-title-heading"
      className="fixed inset-0 z-[220] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-4xl bg-[#090d0b] border border-[#f3ede2]/15 rounded-2xl overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#07090a]">
          <div className="flex items-center gap-2 text-xs text-[#f3ede2]/70 font-mono">
            <FilmIcon className="w-3.5 h-3.5 text-[#d9803f]" aria-hidden="true" />
            <span className="truncate max-w-[200px] md:max-w-md">{film.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="Copy film URL"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <a
              href={film.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
              aria-label="Open on YouTube in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </a>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Close cinema modal"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={film.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Film Details & Metadata */}
        <div className="p-5 md:p-8 space-y-6 max-h-[45vh] overflow-y-auto">
          {/* Header & Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#d9803f] uppercase tracking-wider mb-2 font-medium">
              <span>{film.category}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-[#f3ede2]/70 flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#e9be86]" />
                {film.location}
              </span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-[#f3ede2]/70 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {film.duration}
              </span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="text-[#f3ede2]/70 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {film.views} views
              </span>
            </div>
            <h2 id="film-title-heading" className="font-serif text-2xl md:text-3xl font-normal text-white">
              {film.title}
            </h2>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-[#f3ede2]/80">
              {film.description}
            </p>
          </div>

          {/* Director Notes */}
          <div className="p-4 md:p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <h3 className="text-xs uppercase tracking-widest text-[#e9be86] font-semibold mb-2 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#d9803f]" />
              Director's Notes
            </h3>
            <p className="text-sm italic leading-relaxed text-[#f3ede2]/90 font-serif">
              "{film.directorNotes}"
            </p>
          </div>

          {/* Technical Master Specs */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#f3ede2]/60 font-semibold mb-3">
              Cinematic & Technical Master
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[#f3ede2]/50 block">Resolution</span>
                <span className="font-mono text-white mt-1 block font-medium">{film.technicalSpecs.resolution}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[#f3ede2]/50 block">Frame Rate</span>
                <span className="font-mono text-white mt-1 block font-medium">{film.technicalSpecs.frameRate}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[#f3ede2]/50 block">Color Profile</span>
                <span className="font-mono text-[#d9803f] mt-1 block font-medium">{film.technicalSpecs.colorProfile}</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[#f3ede2]/50 block">Gear Rig</span>
                <span className="font-mono text-white mt-1 block font-medium truncate">{film.gearUsed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

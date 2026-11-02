import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Eye, EyeOff, Box, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenReel: () => void;
  reducedMotion: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReel, reducedMotion }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cinemaView, setCinemaView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [reducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="hero"
      aria-label="Hero Showcase"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-between bg-[#07090a] pt-24 sm:pt-28 pb-10"
    >
      {/* Background Video Layer — Pure Hardware-Accelerated Looping, Zero Seek Glitch */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!reducedMotion && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/aistudio/hero-poster_9e7f73d8.jpg"
            onLoadedData={() => setVideoLoaded(true)}
            aria-hidden="true"
          >
            <source src="/assets/aistudio/hero-drone_7ad9b874.mp4" type="video/mp4" />
          </video>
        )}

        {/* Fallback & Poster layer */}
        <img
          src="/assets/aistudio/hero-poster_9e7f73d8.jpg"
          alt="Aerial drone flight over coastal waters"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            reducedMotion || !videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Lightened, Non-Obtrusive Edge Scrim (Ensures Drone Video is Bright & Clearly Visible) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: cinemaView
              ? 'linear-gradient(180deg, rgba(7,9,10,0.3) 0%, transparent 15%, transparent 85%, rgba(7,9,10,0.5) 100%)'
              : 'linear-gradient(180deg, rgba(7,9,10,0.65) 0%, rgba(7,9,10,0.1) 22%, rgba(7,9,10,0.15) 60%, rgba(7,9,10,0.88) 100%)'
          }}
        />
      </div>

      {/* Floating Viewport Controls (Play/Pause & Cinema Full-Video Mode) */}
      <div className="absolute top-28 right-5 sm:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => setCinemaView((prev) => !prev)}
          aria-label={cinemaView ? 'Show text overlay' : 'Hide text to view full drone video'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white/80 hover:text-white hover:bg-black/85 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          title={cinemaView ? 'Restore text overlay' : 'Clear text to see drone video clearly'}
        >
          {cinemaView ? <Eye className="w-3.5 h-3.5 text-[#d9803f]" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline font-sans text-[11px] font-medium tracking-wide">
            {cinemaView ? 'Show Text' : 'Clear View'}
          </span>
        </button>

        {!reducedMotion && (
          <button
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause background hero video' : 'Play background hero video'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white/80 hover:text-white hover:bg-black/85 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline font-sans text-[11px] font-medium tracking-wide">
              {isPlaying ? 'Pause Loop' : 'Play'}
            </span>
          </button>
        )}
      </div>

      {/* Main Hero Content — Refined, Airy, and Non-Obstructive */}
      <div
        className={`relative z-10 max-w-[1240px] mx-auto px-6 w-full my-auto flex flex-col items-center text-center transition-all duration-700 ${
          cinemaView ? 'opacity-0 pointer-events-none translate-y-6' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Anti-Slop Unboxed Editorial Kicker */}
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.28em] uppercase text-[#e9be86] mb-5 drop-shadow-md">
          <span>Arakan Coastlines</span>
          <span aria-hidden="true" className="text-[#d9803f]">·</span>
          <span>Aerial Cinematography</span>
          <span aria-hidden="true" className="text-[#d9803f]">·</span>
          <span>Kyaukphyu</span>
        </div>

        {/* Primary Headline */}
        <h1 className="font-serif font-normal leading-[0.95] tracking-tight text-[clamp(3rem,8.5vw,7.5rem)] text-[#f3ede2] max-w-5xl [text-wrap:balance] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
          Heino <em className="italic text-[#d9803f] font-light">Xide</em>
        </h1>

        {/* Subtitle / Philosophy */}
        <p className="mt-4 max-w-2xl text-[16px] sm:text-lg md:text-xl leading-relaxed text-[#f3ede2]/90 font-serif italic [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          "The world is originally in peace."
        </p>

        {/* Filmmaker Direct Credit */}
        <p className="mt-2 text-xs sm:text-sm tracking-wide text-[#f3ede2]/75 font-sans max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          Cinematography & aerial flight by <strong className="text-white font-medium">Hein Thu Tun</strong> across the shores of Rakhine State.
        </p>

        {/* Streamlined Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onOpenReel}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#d9803f] hover:bg-[#c56e2f] text-[#07090a] font-semibold text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all shadow-xl hover:shadow-[#d9803f]/30 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Showreel
          </button>

          <a
            href="#studio-3d"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/75 hover:bg-black/90 border border-white/20 text-[#f3ede2] font-medium text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all hover:border-[#d9803f] backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          >
            <Box className="w-4 h-4 text-[#d9803f]" />
            <span>3D Drone Studio</span>
          </a>

          <a
            href="#films"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 text-white/90 hover:text-white font-medium text-xs sm:text-[13px] tracking-[0.14em] uppercase transition-all hover:border-white/25 backdrop-blur-md"
          >
            Browse Films
          </a>
        </div>
      </div>

      {/* Quiet Bottom Anchor (Unobtrusive) */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 flex items-center justify-between text-[11px] text-white/60">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#d9803f]">Mavic Air 2</span>
          <span aria-hidden="true">·</span>
          <span>Kyaukphyu Coastline Flight</span>
        </div>

        <a
          href="#films"
          aria-label="Scroll to featured films"
          className="flex items-center gap-1.5 text-[#f3ede2]/60 hover:text-[#d9803f] uppercase tracking-wider text-[10px] transition-colors"
        >
          <span>Explore Archive</span>
          <ArrowDown className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
};

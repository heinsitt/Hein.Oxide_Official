import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilmCatalog } from './components/FilmCatalog';
import { Drone3DStudio } from './components/Drone3DStudio';
import { AboutDirector } from './components/AboutDirector';
import { CinematicReveal, CinematicScrollProgress } from './components/CinematicTransition';
import { GearShowcase } from './components/GearShowcase';
import { LocationsShowcase } from './components/LocationsShowcase';
import { SubscribeSection } from './components/SubscribeSection';
import { Footer } from './components/Footer';
import { FilmModal } from './components/FilmModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { FILMS, Film } from './data/films';
import { ambientSound } from './utils/audio';

export default function App() {
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);

  // Accessibility state
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Toggle ambient coastal audio
  const handleToggleSound = useCallback(() => {
    const isNowPlaying = ambientSound.toggle();
    setAmbientSoundActive(isNowPlaying);
  }, []);

  // Quick showreel launcher
  const handleOpenShowreel = useCallback(() => {
    const reelFilm = FILMS.find((f) => f.id === 'showreel-2020') || FILMS[0];
    setActiveFilm(reelFilm);
  }, []);

  // Apply high contrast and text scale to root
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (textSize === 'large') {
      root.classList.add('text-scale-large');
    } else if (textSize === 'xlarge') {
      root.classList.add('text-scale-xlarge');
    }
  }, [highContrast, textSize]);

  // Global keyboard shortcuts (Space to toggle sound if not focused on input, '?' for a11y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setA11yOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#07090a] text-[#f3ede2] selection:bg-[#d9803f] selection:text-[#07090a] ${
        highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* WCAG AA Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Cinematic Top Scroll Progress Bar */}
      <CinematicScrollProgress reducedMotion={reducedMotion} />

      {/* Main Navigation Bar */}
      <Navbar
        onOpenReel={handleOpenShowreel}
        onOpenA11y={() => setA11yOpen(true)}
        ambientSoundActive={ambientSoundActive}
        onToggleSound={handleToggleSound}
      />

      {/* Main Landmark */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* Fullscreen Hero Showcase */}
        <Hero
          onOpenReel={handleOpenShowreel}
          reducedMotion={reducedMotion}
        />

        {/* Curated Film Catalog with Cinematic Entrance */}
        <CinematicReveal direction="up" distance={40} reducedMotion={reducedMotion}>
          <FilmCatalog onSelectFilm={(film) => setActiveFilm(film)} />
        </CinematicReveal>

        {/* Real-time 3D Aerial Drone Workbench */}
        <CinematicReveal direction="up" distance={40} delay={0.1} reducedMotion={reducedMotion}>
          <Drone3DStudio reducedMotion={reducedMotion} />
        </CinematicReveal>

        {/* Filmmaker Bio & Story */}
        <CinematicReveal direction="up" distance={36} reducedMotion={reducedMotion}>
          <AboutDirector />
        </CinematicReveal>

        {/* Camera Gear Arsenal & Comparative Matrix */}
        <CinematicReveal direction="up" distance={36} reducedMotion={reducedMotion}>
          <GearShowcase />
        </CinematicReveal>

        {/* Coastal Geography & Locations */}
        <CinematicReveal direction="up" distance={36} reducedMotion={reducedMotion}>
          <LocationsShowcase />
        </CinematicReveal>

        {/* Dispatch & Community Subscription */}
        <CinematicReveal direction="up" distance={36} reducedMotion={reducedMotion}>
          <SubscribeSection reducedMotion={reducedMotion} />
        </CinematicReveal>
      </main>

      {/* Quiet Structured Footer */}
      <Footer onOpenA11y={() => setA11yOpen(true)} />

      {/* Cinema Lightbox Video Player Modal */}
      <FilmModal
        film={activeFilm}
        onClose={() => setActiveFilm(null)}
      />

      {/* Accessibility & Display Settings Modal */}
      <AccessibilityModal
        isOpen={a11yOpen}
        onClose={() => setA11yOpen(false)}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        ambientSoundActive={ambientSoundActive}
        onToggleSound={handleToggleSound}
        textSize={textSize}
        setTextSize={setTextSize}
      />
    </div>
  );
}

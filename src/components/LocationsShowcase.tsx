import React, { useState } from 'react';
import { MapPin, Sun, Camera, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FILMING_LOCATIONS, FilmingLocation } from '../data/locations';
import { CINEMATIC_EASE } from './CinematicTransition';

export const LocationsShowcase: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<FilmingLocation>(FILMING_LOCATIONS[0]);

  return (
    <section id="locations" aria-labelledby="locations-heading" className="py-24 sm:py-32 relative bg-[#090e0c]/60 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-[#d9803f] mb-3">
            <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
            Coastal Geography
          </div>
          <h2 id="locations-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f3ede2] font-normal tracking-tight">
            The Land of <em className="italic text-[#d9803f] font-light">Kyaukphyu</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#f3ede2]/65 max-w-xl">
            Where the Bay of Bengal rolls into emerald estuaries and ancient volcanic reefs. The natural backdrops behind every frame.
          </p>
        </div>

        {/* Location Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Location Selector Tabs (Left Col) */}
          <div className="lg:col-span-5 space-y-3" role="tablist" aria-label="Filming locations in Kyaukphyu">
            {FILMING_LOCATIONS.map((loc, idx) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <motion.button
                  key={loc.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedLocation(loc)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: CINEMATIC_EASE }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative ${
                    isSelected
                      ? 'bg-[#0d1411] border-[#d9803f] shadow-lg'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#d9803f] font-mono mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.area}</span>
                      </div>
                      <h3 className="font-serif text-lg font-medium text-white">
                        {loc.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-white/40 shrink-0 tabular-nums">
                      {loc.coordinates.split(',')[0]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#f3ede2]/60 line-clamp-2">
                    {loc.description}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {/* Location Details Panel (Right Col) with Smooth Crossfade */}
          <div className="lg:col-span-7 bg-[#0d1411] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: CINEMATIC_EASE }}
              >
                {/* Top Badge & Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#d9803f]">
                      Coordinates: {selectedLocation.coordinates}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1">
                      {selectedLocation.name}
                    </h3>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#e9be86] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Rakhine State</span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#f3ede2]/80 font-sans">
                  {selectedLocation.description}
                </p>

                {/* Director's Field Guide Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#e9be86] mb-1.5 uppercase tracking-wider">
                      <Sun className="w-3.5 h-3.5 text-[#d9803f]" />
                      Optimal Light Window
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {selectedLocation.bestLight}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#e9be86] mb-1.5 uppercase tracking-wider">
                      <Camera className="w-3.5 h-3.5 text-[#d9803f]" />
                      Recommended Flight / Lens
                    </div>
                    <div className="text-xs text-white/90 font-medium">
                      {selectedLocation.favoriteLensOrDrone}
                    </div>
                  </div>
                </div>

                {/* Notable Film Reference */}
                <div className="mt-6 p-4 rounded-xl bg-[#d9803f]/10 border border-[#d9803f]/20 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d9803f] font-semibold block">
                      Captured In Film
                    </span>
                    <span className="text-sm font-serif text-white font-medium">
                      {selectedLocation.notableFilm}
                    </span>
                  </div>
                  <a
                    href="#films"
                    className="text-xs uppercase tracking-wider font-semibold text-[#d9803f] hover:text-[#e9be86] flex items-center gap-1 shrink-0"
                  >
                    <span>View Film</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

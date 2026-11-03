import React, { useState, useRef } from 'react';
import {
  Camera,
  Layers,
  Box,
  Compass,
  ArrowUpRight,
  Sliders,
  Check,
  X,
  Play,
  Maximize2,
  Cpu,
  Battery,
  Wind,
  Aperture,
  Film as FilmIcon
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { GEAR_ITEMS, GearItem } from '../data/gear';
import { CINEMATIC_EASE } from './CinematicTransition';

interface GearShowcaseProps {
  onSelectFilmById?: (id: string) => void;
}

interface ParallaxGearCardProps {
  gear: GearItem;
  idx: number;
  onInspect: (gear: GearItem) => void;
}

const ParallaxGearCard: React.FC<ParallaxGearCardProps> = ({ gear, idx, onInspect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Subtle, smooth parallax displacement and gentle breathing scale
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1.08, 1.14]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: CINEMATIC_EASE }}
      className="group bg-[#0d1411] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d9803f]/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
    >
      {/* Media Image Showcase with Parallax Drift */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          <motion.img
            src={gear.image}
            alt={gear.name}
            loading="lazy"
            style={{ y, scale }}
            className="w-full h-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1411] via-transparent to-black/35 pointer-events-none" />

          {/* Category Label */}
          <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-mono text-[#d9803f] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
            {gear.category}
          </div>

          {/* 3D Model Badge for Mavic Air 2 */}
          {gear.id === 'mavic-air-2' && (
            <a
              href="#studio-3d"
              className="absolute top-3 right-3 text-[10px] font-mono uppercase text-white bg-[#14221a] hover:bg-[#1c3225] border border-[#d9803f]/40 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
              title="Interactive 3D Simulation Available"
            >
              <Box className="w-3 h-3 text-[#d9803f]" />
              <span>3D Studio</span>
            </a>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6">
          <div className="text-xs text-[#e9be86] font-medium mb-1">
            {gear.role}
          </div>
          <h3 className="font-serif text-xl font-normal text-white group-hover:text-[#d9803f] transition-colors">
            {gear.name}
          </h3>
          <p className="mt-2 text-xs text-[#f3ede2]/70 leading-relaxed line-clamp-2">
            {gear.summary}
          </p>

          {/* Key Technical Highlights */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-[11px] font-mono">
            {gear.specs.slice(0, 3).map((spec, sIdx) => (
              <div key={sIdx} className="flex items-center justify-between text-[#f3ede2]/70">
                <span className="text-white/40">{spec.label}:</span>
                <span className="text-white truncate max-w-[150px]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Trigger Action */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={() => onInspect(gear)}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#d9803f] text-white hover:text-[#07090a] font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Field Specs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export const GearShowcase: React.FC<GearShowcaseProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectedGear, setInspectedGear] = useState<GearItem | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Complete Arsenal' },
    { id: 'Aerial Drone', label: 'Drones & Flight' },
    { id: 'Mirrorless Camera', label: 'Cinema Mirrorless' },
    { id: 'Gimbal Camera', label: 'Handheld Gimbals' }
  ];

  const filteredGear = GEAR_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'Aerial Drone') {
      return item.category.includes('Drone');
    }
    return item.category === activeCategory;
  });

  return (
    <section id="gear" aria-labelledby="gear-heading" className="py-24 sm:py-32 relative">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-[#d9803f] mb-3">
              <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
              Production Equipment
            </div>
            <h2 id="gear-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f3ede2] font-normal tracking-tight">
              Tools of the <em className="italic text-[#d9803f] font-light">Craft.</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#f3ede2]/65 max-w-xl">
              Compact, rugged optics and flight systems selected by Hein Thu Tun to capture the salt breezes, tides, and portraits of Rakhine State.
            </p>
          </div>

          {/* User-Friendly View Mode Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 border ${
                compareMode
                  ? 'bg-[#d9803f] border-[#d9803f] text-[#07090a] font-semibold'
                  : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{compareMode ? 'Show Cards View' : 'Compare Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8" role="tablist" aria-label="Equipment categories">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1c3225] border border-[#d9803f] text-[#f3ede2] shadow-sm'
                    : 'bg-white/[0.03] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* COMPARE MATRIX VIEW */}
        {compareMode ? (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d1411]">
            <table className="w-full text-left text-xs" aria-label="Equipment comparison matrix">
              <thead>
                <tr className="border-b border-white/10 bg-black/50 text-[#f3ede2]/60 uppercase tracking-wider font-mono text-[11px]">
                  <th className="p-4 sm:p-5">Equipment</th>
                  <th className="p-4 sm:p-5">Sensor & Optics</th>
                  <th className="p-4 sm:p-5">Resolution / FPS</th>
                  <th className="p-4 sm:p-5">Stabilization</th>
                  <th className="p-4 sm:p-5">Flight / Battery</th>
                  <th className="p-4 sm:p-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredGear.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-serif text-sm font-medium text-white">{item.name}</div>
                          <div className="text-[10px] text-[#d9803f] uppercase font-mono">{item.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-[#f3ede2]/80 font-mono text-xs">
                      {item.specs.find((s) => s.label.includes('Sensor') || s.label.includes('Lens'))?.value || 'Custom'}
                    </td>
                    <td className="p-4 sm:p-5 text-[#f3ede2]/80 font-mono tabular-nums text-xs">
                      {item.specs.find((s) => s.label.includes('Resolution') || s.label.includes('Video'))?.value || '4K'}
                    </td>
                    <td className="p-4 sm:p-5 text-[#f3ede2]/80 text-xs">
                      {item.specs.find((s) => s.label.includes('Gimbal') || s.label.includes('Autofocus'))?.value || 'Mechanical'}
                    </td>
                    <td className="p-4 sm:p-5 text-[#f3ede2]/80 font-mono tabular-nums text-xs">
                      {item.specs.find((s) => s.label.includes('Flight') || s.label.includes('Battery'))?.value || 'N/A'}
                    </td>
                    <td className="p-4 sm:p-5">
                      <button
                        onClick={() => setInspectedGear(item)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white text-[11px] font-medium transition-colors"
                      >
                        Inspect Specs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* MODERN USER-FRIENDLY GEAR DECK WITH SUBTLE PARALLAX SCROLL */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGear.map((gear, idx) => (
              <ParallaxGearCard
                key={gear.id}
                gear={gear}
                idx={idx}
                onInspect={(item) => setInspectedGear(item)}
              />
            ))}
          </div>
        )}

        {/* Filmmaker Director Note Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#090e0c] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-[#d9803f] font-mono font-medium">
              Filmmaker Ethics · Hein Thu Tun
            </div>
            <p className="text-sm italic font-serif text-[#f3ede2]/90 max-w-3xl leading-relaxed">
              "We film with lightweight gear not out of compromise, but out of respect. Small drone silhouettes don't frighten local fishing boats, and compact cameras allow real human moments to unfold without intrusion."
            </p>
          </div>

          <a
            href="#studio-3d"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d9803f] hover:bg-[#c56e2f] text-[#07090a] font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-md"
          >
            <Box className="w-4 h-4" />
            <span>Launch 3D Drone Studio</span>
          </a>
        </div>
      </div>

      {/* DETAILED GEAR SPECIFICATION INSPECTOR MODAL */}
      <AnimatePresence>
        {inspectedGear && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${inspectedGear.name} Detailed Specs`}
            className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
              className="relative w-full max-w-2xl bg-[#0d1411] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-black/40">
                <div className="flex items-center gap-4">
                  <img
                    src={inspectedGear.image}
                    alt={inspectedGear.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/15 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#d9803f]">
                      {inspectedGear.category} · {inspectedGear.role}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-normal mt-0.5">
                      {inspectedGear.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setInspectedGear(null)}
                  className="p-2 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close specifications modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#f3ede2]/80">
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-2">
                    Equipment Role & Function
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#f3ede2]/80">
                    {inspectedGear.summary}
                  </p>
                </div>

                {/* Complete Technical Specs Grid */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-3">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {inspectedGear.specs.map((spec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] font-mono text-white/40 block">{spec.label}</span>
                        <span className="text-white font-medium text-xs mt-0.5 block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Director's Personal Field Diary */}
                <div className="p-4 rounded-xl bg-[#14221a] border border-[#d9803f]/25">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#d9803f] font-semibold mb-1">
                    Director Field Notes — Hein Thu Tun
                  </h4>
                  <p className="text-xs italic font-serif text-[#f3ede2]/90 leading-relaxed">
                    "{inspectedGear.filmmakerThoughts}"
                  </p>
                </div>

                {/* Featured In Films */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-white font-semibold mb-2">
                    Captured Works
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectedGear.featuredIn.map((filmTitle, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                      >
                        {filmTitle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
                {inspectedGear.id === 'mavic-air-2' ? (
                  <a
                    href="#studio-3d"
                    onClick={() => setInspectedGear(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d9803f] hover:bg-[#c56e2f] text-[#07090a] font-semibold text-xs tracking-wider uppercase transition-colors"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Open in 3D Drone Workbench</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-white/40 font-mono">
                    Official Production Gear · Heino Xide
                  </span>
                )}

                <button
                  onClick={() => setInspectedGear(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

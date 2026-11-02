import React from 'react';
import { Camera, Compass, Heart, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { CINEMATIC_EASE } from './CinematicTransition';

export const AboutDirector: React.FC = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 sm:py-32 relative bg-[#090e0c]/80 border-y border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Visual Monograph */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, ease: CINEMATIC_EASE }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <img
                src="/assets/aistudio/about-photo_56290401.jpg"
                alt="Hein Sitt Htun (Heino Xide) on motorcycle in Rakhine State"
                loading="lazy"
                className="w-full h-full object-cover object-[center_20%] transform hover:scale-102 transition-transform duration-700"
              />
              {/* Radial gradient warmth */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(120% 90% at 20% 0%, rgba(217,128,63,0.22) 0%, transparent 60%), linear-gradient(180deg, transparent 50%, rgba(7,9,10,0.92) 95%)'
                }}
              />
              {/* Overlay Quote */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs sm:text-sm italic font-serif text-[#f3ede2]/90 leading-relaxed">
                "Every horizon I film is borrowed — from the hills, the tide, the people who were here first."
              </div>
            </div>

            {/* Subtle decorative emblem */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121c17] border border-white/15 text-[11px] font-mono text-[#d9803f] shadow-lg">
              <Compass className="w-3.5 h-3.5 text-[#e9be86]" />
              Kyaukphyu, Myanmar
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Principles */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: CINEMATIC_EASE }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.28em] uppercase text-[#d9803f] mb-3">
                <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
                About the Filmmaker
              </div>
              <h2
                id="about-heading"
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.12] text-[#f3ede2] tracking-tight [text-wrap:balance]"
              >
                Cinematic stillness, <em className="italic text-[#d9803f] font-light">carried by wind</em> and rotor blades.
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#f3ede2]/80">
              Heino Xide is a visual storytelling practice founded and directed by <strong className="text-white font-medium">Hein Thu Tun</strong>, born out of a profound reverence for the coastlines and people of Arakan (Rakhine State).
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-[#f3ede2]/80">
              Armed with a Mavic Air 2, a Sony mirrorless rig, and an eye for natural light, every film is produced independently. From the crashing volcanic breakers of Point Beach to the quiet ferry boats crossing the Gyaing bay, each scene is graded slowly, scored gently, and shared without rushing.
            </p>

            {/* Three Pillar Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#d9803f]/10 text-[#d9803f] flex items-center justify-center mb-3">
                  <Wind className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base text-white mb-1">Oceanic Flight</h3>
                <p className="text-xs text-[#f3ede2]/60 leading-relaxed">
                  Navigating strong coastal tides and sea salt breezes to reach untouched viewpoints.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#e9be86]/10 text-[#e9be86] flex items-center justify-center mb-3">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base text-white mb-1">Authentic Bokeh</h3>
                <p className="text-xs text-[#f3ede2]/60 leading-relaxed">
                  Sigma 30mm f/1.4 prime optics capturing real smiles and unposed everyday lives.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base text-white mb-1">Respect All Beings</h3>
                <p className="text-xs text-[#f3ede2]/60 leading-relaxed">
                  Flying with mindful ethics — never intruding on sacred grounds or wildlife.
                </p>
              </div>
            </div>

            {/* Footnote / Social Profile Link & Maintainer Credit */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#f3ede2]/60 border-t border-white/5">
              <span>Director & Pilot: <strong className="text-white">Hein Thu Tun</strong></span>
              <span aria-hidden="true">·</span>
              <span>Channel: <strong className="text-white">@heinoxide5128</strong></span>
              <span aria-hidden="true">·</span>
              <span>Web Archive: <strong className="text-white">Hein Sitt Tun</strong></span>
              <span aria-hidden="true">·</span>
              <span>Based in: <strong className="text-white">Kyaukphyu</strong></span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

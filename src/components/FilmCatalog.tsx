import React, { useState, useMemo } from 'react';
import { Play, Search, Filter, Compass, Clock, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FILMS, Film } from '../data/films';
import { CINEMATIC_EASE } from './CinematicTransition';

interface FilmCatalogProps {
  onSelectFilm: (film: Film) => void;
}

export const FilmCatalog: React.FC<FilmCatalogProps> = ({ onSelectFilm }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFilms = useMemo(() => {
    return FILMS.filter((film) => {
      const matchesCategory = selectedCategory === 'all' || film.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.gearUsed.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="films" aria-labelledby="films-heading" className="py-24 sm:py-32 relative">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-[#d9803f] mb-3">
              <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
              Cinematography Portfolio
            </div>
            <h2 id="films-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f3ede2] font-normal tracking-tight">
              Featured <em className="italic text-[#d9803f] font-light">Films & Footage</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#f3ede2]/65 max-w-xl">
              Curated aerial sweeps, coastal memories, and visual essays filmed on the shores and headlands of Rakhine State.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/@heinoxide5128/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 text-xs uppercase tracking-wider text-[#f3ede2]/80 hover:text-white hover:border-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
            >
              <span>YouTube Channel (22 Films)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-[#0d1411] border border-white/10 mb-10">
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0" role="tablist" aria-label="Film categories">
            {[
              { id: 'all', label: 'All Films', count: FILMS.length },
              { id: 'aerial', label: 'Aerial Cinematography', count: FILMS.filter((f) => f.category === 'aerial').length },
              { id: 'narrative', label: 'Narrative & Bokeh', count: FILMS.filter((f) => f.category === 'narrative').length },
              { id: 'documentary', label: 'Coastal Documentaries', count: FILMS.filter((f) => f.category === 'documentary').length }
            ].map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#d9803f] text-[#07090a] font-semibold shadow-sm'
                    : 'text-[#f3ede2]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-md ${
                  selectedCategory === cat.id ? 'bg-[#07090a]/20 text-[#07090a]' : 'bg-white/10 text-white/60'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px] sm:max-w-xs w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search films, gear, location..."
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:border-[#d9803f] focus:outline-none focus:ring-1 focus:ring-[#d9803f]"
              aria-label="Filter films by title, gear, or location"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Film Cards Grid */}
        {filteredFilms.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <Filter className="w-8 h-8 text-[#d9803f]/50 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-white">No films found</h3>
            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
              No films matched your search for "{searchQuery}". Try searching for "Mavic", "Kyaukphyu", or reset the category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredFilms.map((film, index) => (
              <motion.article
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.65,
                  delay: (index % 3) * 0.1,
                  ease: CINEMATIC_EASE
                }}
                className="group relative bg-[#0d1411] border border-white/10 rounded-2xl overflow-hidden hover:border-[#d9803f]/50 transition-colors duration-300 flex flex-col justify-between"
              >
                {/* Media Thumbnail Container */}
                <div
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-black/60"
                  onClick={() => onSelectFilm(film)}
                >
                  <img
                    src={film.thumbnail}
                    alt={film.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 font-mono text-[11px] text-[#f3ede2] tabular-nums">
                    {film.duration}
                  </div>

                  {/* Category Indicator (Quiet unboxed text overlay) */}
                  <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-[#e9be86] font-mono drop-shadow-md">
                    {film.category}
                  </div>

                  {/* Play Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-[#d9803f] text-[#07090a] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line (Anti-Slop) */}
                    <div className="flex items-center gap-2 text-[11.5px] text-[#f3ede2]/60 mb-2.5">
                      <span className="flex items-center gap-1 text-[#e9be86]">
                        <Compass className="w-3 h-3" />
                        <span className="truncate max-w-[130px]">{film.location}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{film.views} views</span>
                      <span aria-hidden="true">·</span>
                      <span>{film.year}</span>
                    </div>

                    {/* Film Title */}
                    <h3
                      onClick={() => onSelectFilm(film)}
                      className="font-serif text-lg sm:text-xl font-normal leading-snug text-white hover:text-[#d9803f] transition-colors cursor-pointer"
                    >
                      {film.title}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-[#f3ede2]/70 line-clamp-2">
                      {film.description}
                    </p>
                  </div>

                  {/* Bottom Strip: Equipment & Direct Watch Trigger */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#f3ede2]/50 font-mono text-[11px] truncate">
                      {film.gearUsed}
                    </span>

                    <button
                      onClick={() => onSelectFilm(film)}
                      className="inline-flex items-center gap-1.5 text-[#d9803f] hover:text-[#e9be86] font-medium tracking-wider uppercase text-[11px] shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Watch Film
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

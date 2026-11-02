import React, { useEffect, useRef } from 'react';
import { X, Eye, Volume2, VolumeX, Sparkles, Sliders, Check } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  ambientSoundActive: boolean;
  onToggleSound: () => void;
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  reducedMotion,
  setReducedMotion,
  highContrast,
  setHighContrast,
  ambientSoundActive,
  onToggleSound,
  textSize,
  setTextSize
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#0d1411] border border-[#f3ede2]/20 rounded-2xl p-6 md:p-8 shadow-2xl relative text-[#f3ede2]"
      >
        <div className="flex items-center justify-between pb-5 border-b border-[#f3ede2]/10 mb-6">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-[#d9803f]" aria-hidden="true" />
            <h2 id="a11y-modal-title" className="font-serif text-xl md:text-2xl font-normal">
              Accessibility & Display Preferences
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="p-2 rounded-full text-[#f3ede2]/70 hover:text-[#f3ede2] hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Reduced Motion Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor="reduced-motion-toggle" className="font-medium text-[15px] block text-white">
                Reduce Motion & Disable Video Loops
              </label>
              <p className="text-xs text-[#f3ede2]/70 mt-1">
                Replaces continuous looping drone backgrounds with high-definition still posters and calms transitions.
              </p>
            </div>
            <button
              id="reduced-motion-toggle"
              role="switch"
              aria-checked={reducedMotion}
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-[#d9803f] ${
                reducedMotion ? 'bg-[#d9803f]' : 'bg-white/20'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <label htmlFor="high-contrast-toggle" className="font-medium text-[15px] block text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#e9be86]" aria-hidden="true" />
                Enhanced Contrast Mode
              </label>
              <p className="text-xs text-[#f3ede2]/70 mt-1">
                Deepens surface backgrounds and sharpens typography borders for increased legibility in direct sunlight.
              </p>
            </div>
            <button
              id="high-contrast-toggle"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-[#d9803f] ${
                highContrast ? 'bg-[#d9803f]' : 'bg-white/20'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Text Size Selection */}
          <div>
            <span className="font-medium text-[15px] block text-white mb-2">Typography Scale</span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Text size options">
              {(
                [
                  { id: 'normal', label: 'Default' },
                  { id: 'large', label: 'Large (+15%)' },
                  { id: 'xlarge', label: 'Spacious (+30%)' }
                ] as const
              ).map((size) => (
                <button
                  key={size.id}
                  role="radio"
                  aria-checked={textSize === size.id}
                  onClick={() => setTextSize(size.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center flex items-center justify-center gap-1.5 ${
                    textSize === size.id
                      ? 'bg-[#d9803f] text-[#07090a] border-[#d9803f] font-semibold'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {textSize === size.id && <Check className="w-3.5 h-3.5" />}
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Coastal Atmosphere Toggle */}
          <div className="flex items-start justify-between gap-4 pt-2 border-t border-[#f3ede2]/10">
            <div>
              <span className="font-medium text-[15px] block text-white flex items-center gap-2">
                {ambientSoundActive ? <Volume2 className="w-4 h-4 text-[#d9803f]" /> : <VolumeX className="w-4 h-4 text-[#f3ede2]/50" />}
                Atmospheric Soundscape (Ocean Breeze)
              </span>
              <p className="text-xs text-[#f3ede2]/70 mt-1">
                Generates a calm, rhythmic sea breeze using native browser audio. Safe, muted by default, and ads-free.
              </p>
            </div>
            <button
              onClick={onToggleSound}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
                ambientSoundActive
                  ? 'bg-[#d9803f] text-[#07090a] border-[#d9803f]'
                  : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
              }`}
            >
              {ambientSoundActive ? 'Playing' : 'Muted'}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#f3ede2]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium tracking-wider uppercase text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#d9803f]"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

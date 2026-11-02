import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Cinema-grade weighted cubic bezier curve (smooth deceleration, zero bounce)
export const CINEMATIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CinematicRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  distance?: number;
  className?: string;
  reducedMotion?: boolean;
  once?: boolean;
}

/**
 * CinematicReveal
 * Smooth viewport entrance reveal mimicking 35mm film exposure and camera boom movement.
 */
export const CinematicReveal: React.FC<CinematicRevealProps> = ({
  children,
  delay = 0,
  duration = 0.85,
  direction = 'up',
  distance = 32,
  className = '',
  reducedMotion = false,
  once = true
}) => {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: CINEMATIC_EASE
        }
      }}
      viewport={{ once, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface CinematicStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  reducedMotion?: boolean;
}

/**
 * CinematicStagger
 * Orchestrates sequenced reveals for grids, gallery tiles, and lists.
 */
export const CinematicStagger: React.FC<CinematicStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  reducedMotion = false
}) => {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const cinematicItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: CINEMATIC_EASE
    }
  }
};

/**
 * CinematicScrollProgress
 * Thin, atmospheric gold film progress indicator tracking page position.
 */
export const CinematicScrollProgress: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  if (reducedMotion) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[120] pointer-events-none bg-black/40"
      aria-hidden="true"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-[#d9803f]/50 via-[#d9803f] to-[#e9be86] origin-left shadow-[0_0_8px_rgba(217,128,63,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
};

import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Compass, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './shared/Button';
import SectionHeading from './shared/SectionHeading';
import ImageMarquee from './shared/ImageMarquee';

interface LandingProps {
  onStart: () => void;
}

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HERO_IMAGES = [
  '/images/hero-1.webp',
  '/images/hero-2.webp',
  '/images/hero-3.webp',
  '/images/hero-4.webp',
];

export default function Landing({ onStart }: LandingProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: EASE_OUT_SOFT },
    };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Images Crossfade */}
        {HERO_IMAGES.map((src, index) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: (prefersReducedMotion && index === 0) ? 1 : (index === currentHeroIndex ? 1 : 0),
              scale: prefersReducedMotion ? 1 : (index === currentHeroIndex ? 1.05 : 1)
            }}
            transition={{
              opacity: { duration: 2, ease: 'easeInOut' },
              scale: { duration: 10, ease: 'linear' }
            }}
            aria-hidden="true"
          />
        ))}

        {/* Gradient Scrim Overlay */}
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="gradient-hero absolute inset-0 opacity-60 mix-blend-overlay" aria-hidden="true" />
        <div className="gradient-hero absolute inset-0 opacity-40" aria-hidden="true" />

        {/* Decorative floating elements */}
        <motion.div
          className="pointer-events-none absolute top-[15%] right-[8%] opacity-40 mix-blend-overlay"
          animate={prefersReducedMotion ? {} : { y: [0, -8, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Compass size={120} strokeWidth={1} style={{ color: 'var(--color-primary-light)' }} />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-[20%] left-[6%] opacity-40 mix-blend-overlay"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <MapPin size={90} strokeWidth={1} style={{ color: 'var(--color-secondary-light)' }} />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-[55%] right-[15%] opacity-40 mix-blend-overlay"
          animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Sun size={70} strokeWidth={1} style={{ color: 'var(--color-warning-light)' }} />
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
          <div className="max-w-2xl text-center">
            {/* Overline */}
            <motion.p
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.1,
              }}
              className="body-sm mb-6 font-medium tracking-widest uppercase text-white/80"
            >
              Your journey starts here
            </motion.p>

            {/* Headline */}
            <motion.h1
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.2,
              }}
              className="text-white text-shadow-sm"
            >
              Travel plans that{' '}
              <span className="text-white">feel personal</span>,
              <br className="hidden sm:inline" />
              {' '}not generated
            </motion.h1>

            {/* Subhead */}
            <motion.p
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.35,
              }}
              className="body-lg mx-auto mt-6 max-w-lg text-white/90"
            >
              Tell us where you want to go — or let us surprise you. We'll craft a
              complete itinerary with a day-by-day plan, budget breakdown, and
              packing list in seconds.
            </motion.p>

            {/* CTA */}
            <motion.div
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.5,
              }}
              className="mt-10"
            >
              <Button 
                size="lg" 
                onClick={onStart} 
                className="hover:scale-105 active:scale-95 transition-transform"
                style={{ backgroundColor: 'white', color: 'black' }}
              >
                <MapPin size={20} strokeWidth={1.75} />
                Plan My Trip
              </Button>
            </motion.div>

            {/* Feature hints */}
            <motion.div
              {...fadeUp}
              transition={{
                ...fadeUp.transition,
                delay: 0.65,
              }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8"
            >
              {[
                'Day-by-day itinerary',
                'Budget breakdown',
                'Packing checklist',
              ].map((label) => (
                <span
                  key={label}
                  className="body-sm flex items-center gap-2 font-medium text-white/80"
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-white/60"
                  />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="py-24 bg-[var(--color-bg-primary)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8 mb-12">
          <SectionHeading level="h2" align="center">
            Where will you go next?
          </SectionHeading>
        </div>
        <ImageMarquee />
      </div>
    </div>
  );
}

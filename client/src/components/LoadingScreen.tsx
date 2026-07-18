import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import SectionHeading from './shared/SectionHeading';

const STATUS_MESSAGES = [
  "Finding the best spots...",
  "Balancing your budget...",
  "Packing your bags...",
  "Finalizing your itinerary..."
];

export default function LoadingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    initial: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 15 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    exit: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -15 
    }
  };

  const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const transition = prefersReducedMotion 
    ? { duration: 0.3 } 
    : { duration: 0.5, ease: EASE_OUT_SOFT };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background Image */}
      <img 
        src="/images/jungle.webp" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply blur-sm" 
      />
      <div className="absolute inset-0 bg-[var(--color-bg)]/60" />

      <div className="relative z-10 flex flex-col items-center">
        <div 
          className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-full shadow-sm"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <motion.div
            animate={prefersReducedMotion ? { opacity: [0.5, 1, 0.5] } : { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--color-primary-light)' }}
          />
          <MapPin 
            size={32} 
            strokeWidth={1.5} 
            style={{ color: 'var(--color-primary-dark)' }} 
          />
        </div>

        <div className="h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <SectionHeading level="h2" align="center">
                {STATUS_MESSAGES[currentIndex]}
              </SectionHeading>
            </motion.div>
          </AnimatePresence>
        </div>

        <p 
          className="body-base mt-4 max-w-sm" 
          style={{ color: 'var(--color-text-secondary)' }}
        >
          We're designing a personalized trip tailored exactly to your preferences. This takes just a few seconds.
        </p>
      </div>
    </div>
  );
}

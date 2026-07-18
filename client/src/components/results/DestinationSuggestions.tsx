import { motion, useReducedMotion } from 'framer-motion';
import Card from '../shared/Card';
import SectionHeading from '../shared/SectionHeading';
import { getDestinationImage } from '../../lib/destinationImageMap';
import type { DestinationSuggestion } from '../../types/itinerary';
import { Calendar } from 'lucide-react';

interface DestinationSuggestionsProps {
  suggestions: DestinationSuggestion[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } }
};

const reducedItemVariants = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } }
};

export default function DestinationSuggestions({ suggestions }: DestinationSuggestionsProps) {
  const prefersReducedMotion = useReducedMotion();
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <section className="mb-16">
      <SectionHeading 
        level="h2" 
        subtitle="Since you weren't sure where to go, here are three destinations that perfectly match your preferences."
        className="mb-8"
      >
        Suggested Destinations
      </SectionHeading>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {suggestions.map((dest, idx) => (
          <motion.div key={`${dest.name}-${idx}`} variants={prefersReducedMotion ? reducedItemVariants : itemVariants} className="h-full">
            <Card className="h-full flex flex-col p-0 overflow-hidden" hoverable>
              <div className="relative h-48 w-full shrink-0">
                <img 
                  src={getDestinationImage(dest.name)} 
                  alt={dest.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-2xl font-display font-semibold leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                    {dest.country}
                  </p>
                </div>
              </div>
              <div className="p-5 flex flex-col grow">
                <p className="body-sm text-(--color-text-secondary) grow mb-4">
                  {dest.whyItFits}
                </p>
                <div className="flex items-center gap-2 text-(--color-text-muted) text-xs font-medium">
                  <Calendar size={14} />
                  <span>Best season: {dest.bestSeason}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

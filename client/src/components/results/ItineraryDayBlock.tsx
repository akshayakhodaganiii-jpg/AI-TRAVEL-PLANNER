import { motion, useReducedMotion } from 'framer-motion';
import Card from '../shared/Card';
import SectionHeading from '../shared/SectionHeading';
import type { ItineraryDay } from '../../types/itinerary';
import { Clock, Banknote, Sun, Sunset, Moon } from 'lucide-react';

interface ItineraryDayBlockProps {
  dayData: ItineraryDay;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

const reducedItemVariants = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } }
};

const timeIconMap = {
  morning: <Sun size={20} className="text-(--color-warning)" />,
  afternoon: <Sunset size={20} className="text-(--color-primary)" />,
  evening: <Moon size={20} className="text-(--color-secondary)" />,
};

export default function ItineraryDayBlock({ dayData }: ItineraryDayBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      key={`day-${dayData.day}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="flex flex-col gap-6"
    >
      <div className="mb-2">
        <SectionHeading level="h2">Day {dayData.day}: {dayData.theme}</SectionHeading>
        <p className="text-(--color-text-muted) text-sm mt-1">{dayData.date}</p>
      </div>

      <div className="flex flex-col gap-4">
        {dayData.blocks.map((block, idx) => (
          <motion.div key={`${block.timeOfDay}-${idx}`} variants={prefersReducedMotion ? reducedItemVariants : itemVariants}>
            <Card className="flex flex-col sm:flex-row sm:items-start gap-4" hoverable>
              <div className="flex items-center gap-2 sm:w-32 shrink-0 pt-1">
                {timeIconMap[block.timeOfDay]}
                <span className="font-semibold capitalize text-(--color-text-secondary)">
                  {block.timeOfDay}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-(--color-text-primary) mb-2">
                  {block.activity}
                </h3>
                <p className="body-base text-(--color-text-secondary) mb-4">
                  {block.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-(--color-text-muted) font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{block.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Banknote size={16} />
                    <span>
                      {block.estimatedCost.amount === 0 
                        ? 'Free' 
                        : `${block.estimatedCost.currency} ${block.estimatedCost.amount}`}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

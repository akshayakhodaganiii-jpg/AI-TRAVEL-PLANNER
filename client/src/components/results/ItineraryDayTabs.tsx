import { motion, useReducedMotion } from 'framer-motion';

interface ItineraryDayTabsProps {
  days: number;
  activeDay: number;
  onSelectDay: (day: number) => void;
}

export default function ItineraryDayTabs({ days, activeDay, onSelectDay }: ItineraryDayTabsProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="flex w-full overflow-x-auto no-scrollbar py-2 mb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex space-x-2 px-1 md:px-0">
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1;
          const isActive = day === activeDay;
          
          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`relative px-5 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors duration-200 shrink-0 ${
                isActive 
                  ? 'text-white' 
                  : 'text-(--color-text-secondary) hover:bg-(--color-bg-soft)'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-(--color-primary) rounded-full shadow-sm"
                  initial={false}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Day {day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

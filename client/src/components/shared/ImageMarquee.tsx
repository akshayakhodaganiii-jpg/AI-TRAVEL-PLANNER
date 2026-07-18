import { motion, useAnimationFrame, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

const DESTINATIONS = [
  'arunachal', 'desert', 'jungle', 'kashmir', 'kedarnath',
  'kerala', 'meghalaya', 'mountain', 'ocean', 'sikkim',
  'spiti', 'varanasi', 'vrindavan', 'zanskar'
];

export default function ImageMarquee() {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isHovered) return;
    
    // velocity in percentage points per millisecond, e.g. move full 50% in ~40s
    // 50% / 40000ms = 0.00125 %/ms
    let moveBy = -0.00125 * delta;
    
    let newX = baseX.get() + moveBy;
    if (newX <= -50) {
      newX += 50;
    }
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  const doubledDestinations = [...DESTINATIONS, ...DESTINATIONS];

  // Title case helper
  const formatTitle = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div 
      className="w-full overflow-hidden py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="flex gap-4 w-max px-4"
        style={{ x: prefersReducedMotion ? 0 : x }}
      >
        {doubledDestinations.map((dest, i) => (
          <div 
            key={`${dest}-${i}`} 
            className="group relative w-[280px] sm:w-[320px] h-[210px] sm:h-[240px] flex-shrink-0 overflow-hidden rounded-2xl cursor-pointer bg-[var(--color-surface)] shadow-sm"
          >
            <img 
              src={`/images/${dest}.webp`} 
              alt={formatTitle(dest)} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Caption Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 flex items-end">
              <span className="text-white font-medium p-6 tracking-wide text-lg transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                {formatTitle(dest)}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

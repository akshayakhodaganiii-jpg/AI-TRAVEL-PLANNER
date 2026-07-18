import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ItineraryResponse } from '../../types/itinerary';
import { Check } from 'lucide-react';

interface PackingChecklistProps {
  checklist: ItineraryResponse['packingChecklist'];
}

export default function PackingChecklist({ checklist }: PackingChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useReducedMotion();

  const toggleItem = (item: string) => {
    const next = new Set(checkedItems);
    if (next.has(item)) {
      next.delete(item);
    } else {
      next.add(item);
    }
    setCheckedItems(next);
  };

  return (
    <div className="p-6 rounded-2xl bg-(--color-bg-elevated) border border-(--color-border) shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-display font-semibold text-(--color-text-primary) mb-6">
        Packing Checklist
      </h3>
      
      <div className="space-y-6">
        {checklist.map((categoryGroup, idx) => (
          <div key={idx}>
            <h4 className="text-(--color-text-primary) font-medium mb-3">
              {categoryGroup.category}
            </h4>
            <ul className="space-y-2">
              {categoryGroup.items.map((item, itemIdx) => {
                const uniqueKey = `${categoryGroup.category}-${item}-${itemIdx}`;
                const isChecked = checkedItems.has(uniqueKey);

                return (
                  <li key={uniqueKey} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleItem(uniqueKey)}
                      className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-(--color-primary) rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3 -mt-2"
                      aria-label={`Toggle ${item}`}
                      aria-checked={isChecked}
                      role="checkbox"
                    >
                      <motion.div
                        initial={false}
                        animate={
                          isChecked
                            ? prefersReducedMotion
                              ? { backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', scale: 1 }
                              : { backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', scale: [1, 1.15, 1] }
                            : { backgroundColor: 'transparent', borderColor: 'var(--color-border)', scale: 1 }
                        }
                        transition={{ duration: 0.2 }}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center`}
                      >
                        {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                      </motion.div>
                    </button>
                    <span 
                      className={`body-sm pt-[2px] cursor-pointer transition-colors ${isChecked ? 'text-(--color-text-muted) line-through' : 'text-(--color-text-secondary)'}`}
                      onClick={() => toggleItem(uniqueKey)}
                    >
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

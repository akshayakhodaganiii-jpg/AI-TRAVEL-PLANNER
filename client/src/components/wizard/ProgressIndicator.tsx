import { motion, useReducedMotion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div
      className="mb-8 flex items-center justify-center space-x-3"
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={index}
            className="relative h-2 w-12 overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--color-bg-soft)' }}
          >
            <motion.div
              initial={false}
              animate={{
                width: isCurrent || isCompleted ? '100%' : '0%',
                backgroundColor: isCurrent
                  ? 'var(--color-primary)'
                  : isCompleted
                  ? 'var(--color-secondary)'
                  : 'transparent',
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' }}
              className="absolute left-0 top-0 h-full"
            />
          </div>
        );
      })}
    </div>
  );
}

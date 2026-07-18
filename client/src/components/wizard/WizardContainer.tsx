import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ItineraryRequest } from '../../types/itinerary';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ProgressIndicator from './ProgressIndicator';
import StepTripBasics from './StepTripBasics';
import StepPreferences from './StepPreferences';
import StepExtras from './StepExtras';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardContainerProps {
  onSubmit: (data: ItineraryRequest) => void;
  onBack: () => void; // to go back to landing from step 0
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

const reducedMotionVariants = {
  enter: { opacity: 0, x: 0 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

export default function WizardContainer({ onSubmit, onBack }: WizardContainerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<ItineraryRequest>({
    destination: '',
    originCity: '',
    startDate: '',
    durationDays: 3,
    travelers: 2,
    budgetTier: 'mid-range',
    exactBudget: null,
    tripTypes: [],
    pace: 'balanced',
    mustSee: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
  });

  const updateData = (updates: Partial<ItineraryRequest>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      const isSuggestDestination = data.destination === null;
      return (
        (data.destination !== '' || isSuggestDestination) &&
        data.originCity.trim() !== '' &&
        data.startDate !== '' &&
        data.durationDays > 0 &&
        data.travelers > 0
      );
    }
    if (step === 1) {
      const hasBudget = data.budgetTier !== null || (data.exactBudget !== null && data.exactBudget.amount > 0);
      return hasBudget && data.tripTypes.length > 0;
    }
    return true; // step 2 is all optional
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < 2) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <img 
        src="/images/kerala.webp" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-multiply" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 to-[var(--color-bg)]" />
      
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

      <Card className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={prefersReducedMotion ? reducedMotionVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentStep === 0 && (
              <StepTripBasics data={data} updateData={updateData} />
            )}
            {currentStep === 1 && (
              <StepPreferences data={data} updateData={updateData} />
            )}
            {currentStep === 2 && (
              <StepExtras data={data} updateData={updateData} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between border-t border-(--color-border) pt-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft size={18} strokeWidth={1.75} />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          <Button 
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
          >
            {currentStep === 2 ? 'Generate Itinerary' : 'Next'}
            {currentStep < 2 && <ArrowRight size={18} strokeWidth={1.75} />}
          </Button>
        </div>
      </Card>
      </div>
    </div>
  );
}

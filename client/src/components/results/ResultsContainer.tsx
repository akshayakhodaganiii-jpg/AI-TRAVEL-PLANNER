import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import DestinationSuggestions from './DestinationSuggestions';
import ItineraryDayTabs from './ItineraryDayTabs';
import ItineraryDayBlock from './ItineraryDayBlock';
import BudgetBreakdown from './BudgetBreakdown';
import PackingChecklist from './PackingChecklist';
import type { ItineraryResponse } from '../../types/itinerary';
import { RefreshCw } from 'lucide-react';

interface ResultsContainerProps {
  data: ItineraryResponse;
  onRegenerate: () => void;
  onStartOver: () => void;
}

export default function ResultsContainer({ data, onRegenerate, onStartOver }: ResultsContainerProps) {
  const [activeDay, setActiveDay] = useState(1);

  const activeDayData = data.itinerary.find(d => d.day === activeDay) || data.itinerary[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      
      {data.destinationSuggestions && data.destinationSuggestions.length > 0 && (
        <DestinationSuggestions suggestions={data.destinationSuggestions} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Itinerary (2/3 width on desktop) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-display font-semibold text-(--color-text-primary) mb-2">
              Your Trip to {data.finalDestination}
            </h1>
            <p className="text-(--color-text-secondary) body-lg">
              Here is your AI-crafted itinerary.
            </p>
          </div>

          <ItineraryDayTabs 
            days={data.itinerary.length} 
            activeDay={activeDay} 
            onSelectDay={setActiveDay} 
          />
          
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeDayData && (
                <ItineraryDayBlock key={`block-${activeDay}`} dayData={activeDayData} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Budget & Packing (1/3 width on desktop) */}
        <div className="flex flex-col gap-8">
          <BudgetBreakdown budget={data.budget} />
          
          <PackingChecklist checklist={data.packingChecklist} />

          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={onRegenerate} className="w-full justify-center">
              <RefreshCw size={18} strokeWidth={1.75} className="mr-2" />
              Regenerate
            </Button>
            <Button variant="ghost" onClick={onStartOver} className="w-full justify-center">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

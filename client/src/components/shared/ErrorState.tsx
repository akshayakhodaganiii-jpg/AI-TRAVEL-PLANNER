import { AlertTriangle, Clock, ServerCrash } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import SectionHeading from './SectionHeading';
import type { ApiError } from '../../types/itinerary';

interface ErrorStateProps {
  error: ApiError | null;
  onRetry: () => void;
  onStartOver: () => void;
}

export default function ErrorState({ error, onRetry, onStartOver }: ErrorStateProps) {
  let title = 'Something went wrong';
  let message = error?.message || 'We had an unexpected issue generating your itinerary.';
  let Icon = AlertTriangle;

  if (error?.code === 'LLM_TIMEOUT') {
    title = 'This is taking longer than expected';
    message = 'Our AI planner took too long to put together your itinerary. Let\'s try again.';
    Icon = Clock;
  } else if (error?.code === 'LLM_INVALID_JSON') {
    title = 'We had trouble putting your itinerary together';
    message = 'The generated itinerary had some missing pieces. Let\'s give it another shot.';
    Icon = ServerCrash;
  } else if (error?.code === 'VALIDATION_ERROR') {
    title = 'Just a little mix-up';
    // Use the backend's validation error message which is usually descriptive
    message = error.message; 
    Icon = AlertTriangle;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="flex flex-col items-center p-8 text-center shadow-md border-[var(--color-border)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-primary)]">
            <Icon size={32} strokeWidth={1.5} />
          </div>
          
          <SectionHeading
            level="h2"
            align="center"
            subtitle={message}
          >
            {title}
          </SectionHeading>
          
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={onRetry} className="w-full sm:w-auto">
              Try Again
            </Button>
            <Button variant="ghost" onClick={onStartOver} className="w-full sm:w-auto">
              Start Over
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

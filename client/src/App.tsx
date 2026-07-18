import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Landing from './components/Landing';
import WizardContainer from './components/wizard/WizardContainer';
import LoadingScreen from './components/LoadingScreen';
import ErrorState from './components/shared/ErrorState';
import { useItineraryGeneration } from './hooks/useItineraryGeneration';
import type { ItineraryRequest } from './types/itinerary';

import ResultsContainer from './components/results/ResultsContainer';

/* ─────────────────────────────────────────────
   State Machine
   ───────────────────────────────────────────── */

type AppView = 'landing' | 'wizard' | 'loading' | 'results' | 'error';

/* ─────────────────────────────────────────────
   Animation Config (shared across views)
   ───────────────────────────────────────────── */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function getPageTransition(prefersReducedMotion: boolean | null) {
  return prefersReducedMotion
    ? { duration: 0.15 }
    : { duration: 0.35, ease: EASE_OUT_SOFT };
}

/* ─────────────────────────────────────────────
   App — State Machine Router
   ───────────────────────────────────────────── */

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [requestData, setRequestData] = useState<ItineraryRequest | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { generate, error, result } = useItineraryGeneration();

  /* ── Transition callbacks ── */
  const goToWizard = useCallback(() => setView('wizard'), []);
  const goToLanding = useCallback(() => setView('landing'), []);
  const goToLoading = useCallback(() => setView('loading'), []);
  const goToResults = useCallback(() => setView('results'), []);
  const goToError = useCallback(() => setView('error'), []);

  const handleGenerate = async (data: ItineraryRequest) => {
    setRequestData(data);
    goToLoading();
    try {
      await generate(data);
      goToResults();
    } catch (err) {
      console.error(err);
      goToError();
    }
  };

  const handleRetry = () => {
    if (requestData) {
      handleGenerate(requestData);
    } else {
      goToWizard();
    }
  };

  const transition = getPageTransition(prefersReducedMotion);

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <Landing onStart={goToWizard} />
          </motion.div>
        )}

        {view === 'wizard' && (
          <motion.div
            key="wizard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <WizardContainer
              onSubmit={handleGenerate}
              onBack={goToLanding}
            />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <LoadingScreen />
          </motion.div>
        )}

        {view === 'results' && result && (
          <motion.div
            key="results"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <ResultsContainer
              data={result}
              onRegenerate={() => {
                if (requestData) handleGenerate(requestData);
              }}
              onStartOver={goToLanding}
            />
          </motion.div>
        )}

        {view === 'error' && (
          <motion.div
            key="error"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            <ErrorState error={error} onRetry={handleRetry} onStartOver={goToLanding} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev-only: quick navigation to test state machine transitions */}
      {import.meta.env.DEV && (
        <div className="fixed right-3 bottom-3 z-50 flex gap-1.5 rounded-xl border border-(--color-border) bg-(--color-bg-elevated) p-2 shadow-md">
          {(['landing', 'wizard', 'loading', 'results', 'error'] as const).map(
            (v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150"
                style={{
                  backgroundColor:
                    view === v
                      ? 'var(--color-primary)'
                      : 'var(--color-bg-soft)',
                  color: view === v ? '#fff' : 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {v}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

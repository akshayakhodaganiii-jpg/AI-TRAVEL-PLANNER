import { useMemo } from 'react';
import type { ItineraryResponse } from '../../types/itinerary';

interface BudgetBreakdownProps {
  budget: ItineraryResponse['budget'];
}

export default function BudgetBreakdown({ budget }: BudgetBreakdownProps) {
  // Always recompute total to avoid trusting the LLM blindly
  const calculatedTotal = useMemo(() => {
    return budget.categories.reduce((acc, cat) => acc + cat.amount, 0);
  }, [budget.categories]);

  const maxAmount = useMemo(() => {
    return Math.max(...budget.categories.map(cat => cat.amount), 1);
  }, [budget.categories]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: budget.currency,
    maximumFractionDigits: 0,
  });

  return (
    <div className="p-6 rounded-2xl bg-(--color-bg-elevated) border border-(--color-border) shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-display font-semibold text-(--color-text-primary) mb-4">
        Estimated Budget
      </h3>
      
      <div className="mb-6">
        <p className="text-3xl font-semibold text-(--color-primary) mb-1">
          {formatter.format(calculatedTotal)}
        </p>
        <p className="text-(--color-text-secondary) body-sm">
          {formatter.format(budget.perPersonPerDay)} per person / day
        </p>
      </div>

      <div className="space-y-4">
        {budget.categories.map((cat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="text-(--color-text-primary) capitalize font-medium body-sm">
                {cat.category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-(--color-text-secondary) body-sm">
                {formatter.format(cat.amount)}
              </span>
            </div>
            <div className="h-2 w-full bg-(--color-bg-soft) rounded-full overflow-hidden">
              <div 
                className="h-full bg-(--color-secondary) rounded-full"
                style={{ width: `${(cat.amount / maxAmount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

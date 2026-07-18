import type { ItineraryRequest } from '../../types/itinerary';
import SectionHeading from '../shared/SectionHeading';

interface StepPreferencesProps {
  data: ItineraryRequest;
  updateData: (updates: Partial<ItineraryRequest>) => void;
}

const TRIP_TYPES = [
  'Adventure',
  'Relaxation',
  'Culture',
  'Food',
  'Nightlife',
  'Nature',
  'Family',
  'Romantic',
];

export default function StepPreferences({
  data,
  updateData,
}: StepPreferencesProps) {
  const handleTripTypeToggle = (type: string) => {
    const current = data.tripTypes;
    if (current.includes(type)) {
      updateData({ tripTypes: current.filter((t) => t !== type) });
    } else {
      updateData({ tripTypes: [...current, type] });
    }
  };

  const isExactBudget = data.exactBudget !== null;

  return (
    <div className="space-y-8">
      <SectionHeading level="h2" subtitle="What kind of trip are you looking for?">
        Preferences
      </SectionHeading>

      {/* Budget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="body-base font-medium">Budget</label>
          <label className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
            <input
              type="checkbox"
              checked={isExactBudget}
              onChange={(e) => {
                if (e.target.checked) {
                  updateData({
                    exactBudget: { amount: 1000, currency: 'USD' },
                    budgetTier: null,
                  });
                } else {
                  updateData({
                    exactBudget: null,
                    budgetTier: 'mid-range',
                  });
                }
              }}
              className="h-4 w-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
            />
            Use exact budget
          </label>
        </div>

        {!isExactBudget ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {(['budget', 'mid-range', 'luxury'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => updateData({ budgetTier: tier })}
                className={`flex-1 rounded-xl border p-3 text-center transition-colors ${
                  data.budgetTier === tier
                    ? 'border-(--color-primary) bg-(--color-primary) text-white'
                    : 'border-(--color-border) bg-white hover:bg-(--color-bg-soft)'
                }`}
              >
                <span className="capitalize">{tier}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              value={data.exactBudget?.amount || ''}
              onChange={(e) =>
                updateData({
                  exactBudget: {
                    amount: parseInt(e.target.value) || 0,
                    currency: data.exactBudget?.currency || 'USD',
                  },
                })
              }
              placeholder="e.g. 2000"
              className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
            />
            <select
              value={data.exactBudget?.currency || 'USD'}
              onChange={(e) =>
                updateData({
                  exactBudget: {
                    amount: data.exactBudget?.amount || 0,
                    currency: e.target.value,
                  },
                })
              }
              className="rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        )}
      </div>

      {/* Trip Types */}
      <div className="space-y-3">
        <label className="body-base block font-medium">
          Trip Vibe <span className="text-sm font-normal text-(--color-text-secondary)">(Select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TRIP_TYPES.map((type) => {
            const isSelected = data.tripTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTripTypeToggle(type)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? 'border-(--color-primary) bg-(--color-primary) text-white'
                    : 'border-(--color-border) bg-white text-(--color-text-primary) hover:bg-(--color-bg-soft)'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pace */}
      <div className="space-y-3">
        <label className="body-base block font-medium">Pace</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          {[
            { id: 'relaxed', label: 'Relaxed', desc: '2-3 activities/day' },
            { id: 'balanced', label: 'Balanced', desc: '3-4 activities/day' },
            { id: 'packed', label: 'Packed', desc: '5+ activities/day' },
          ].map((pace) => (
            <button
              key={pace.id}
              type="button"
              onClick={() =>
                updateData({
                  pace: pace.id as ItineraryRequest['pace'],
                })
              }
              className={`flex flex-1 flex-col items-center justify-center rounded-xl border p-3 transition-colors ${
                data.pace === pace.id
                  ? 'border-(--color-secondary) bg-(--color-secondary) text-white'
                  : 'border-(--color-border) bg-white hover:bg-(--color-bg-soft)'
              }`}
            >
              <span className="font-medium capitalize">{pace.label}</span>
              <span
                className={`text-xs ${
                  data.pace === pace.id ? 'text-white/80' : 'text-(--color-text-secondary)'
                }`}
              >
                {pace.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

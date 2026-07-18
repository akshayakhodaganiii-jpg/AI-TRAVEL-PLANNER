import type { ItineraryRequest } from '../../types/itinerary';
import SectionHeading from '../shared/SectionHeading';

interface StepExtrasProps {
  data: ItineraryRequest;
  updateData: (updates: Partial<ItineraryRequest>) => void;
}

export default function StepExtras({ data, updateData }: StepExtrasProps) {
  return (
    <div className="space-y-6">
      <SectionHeading level="h2" subtitle="Any special requests? (All optional)">
        The Extras
      </SectionHeading>

      <div className="space-y-4">
        {/* Must-see */}
        <div className="space-y-2">
          <label className="body-base block font-medium">
            Must-see Attractions or Activities
          </label>
          <textarea
            rows={3}
            placeholder="e.g. I definitely want to visit the Louvre and try a local cooking class."
            value={data.mustSee}
            onChange={(e) => updateData({ mustSee: e.target.value })}
            className="w-full resize-none rounded-lg border border-(--color-border) bg-white px-4 py-3 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-2">
          <label className="body-base block font-medium">
            Dietary Restrictions
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Vegetarian, no seafood, peanut allergy"
            value={data.dietaryRestrictions}
            onChange={(e) => updateData({ dietaryRestrictions: e.target.value })}
            className="w-full resize-none rounded-lg border border-(--color-border) bg-white px-4 py-3 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>

        {/* Accessibility Needs */}
        <div className="space-y-2">
          <label className="body-base block font-medium">
            Accessibility or Mobility Needs
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Need wheelchair accessible hotels, prefer minimal walking"
            value={data.accessibilityNeeds}
            onChange={(e) => updateData({ accessibilityNeeds: e.target.value })}
            className="w-full resize-none rounded-lg border border-(--color-border) bg-white px-4 py-3 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>
      </div>
    </div>
  );
}

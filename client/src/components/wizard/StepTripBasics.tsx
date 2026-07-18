import type { ItineraryRequest } from '../../types/itinerary';
import SectionHeading from '../shared/SectionHeading';

interface StepTripBasicsProps {
  data: ItineraryRequest;
  updateData: (updates: Partial<ItineraryRequest>) => void;
}

export default function StepTripBasics({
  data,
  updateData,
}: StepTripBasicsProps) {
  const isSuggestDestination = data.destination === null;

  return (
    <div className="space-y-6">
      <SectionHeading level="h2" subtitle="Let's start with the logistics.">
        Trip Basics
      </SectionHeading>

      <div className="space-y-4">
        {/* Destination */}
        <div className="space-y-2">
          <label className="body-base block font-medium">Destination</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="e.g. Tokyo, Japan"
              disabled={isSuggestDestination}
              value={data.destination || ''}
              onChange={(e) => updateData({ destination: e.target.value })}
              className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) disabled:bg-gray-100 disabled:opacity-60"
            />
            <label className="flex items-center gap-2 whitespace-nowrap text-sm text-(--color-text-secondary)">
              <input
                type="checkbox"
                checked={isSuggestDestination}
                onChange={(e) =>
                  updateData({
                    destination: e.target.checked ? null : '',
                  })
                }
                className="h-4 w-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary)"
              />
              Suggest for me
            </label>
          </div>
        </div>

        {/* Origin City */}
        <div className="space-y-2">
          <label className="body-base block font-medium">Origin City</label>
          <input
            type="text"
            placeholder="e.g. New York, USA"
            value={data.originCity}
            onChange={(e) => updateData({ originCity: e.target.value })}
            className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="body-base block font-medium">Start Date</label>
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => updateData({ startDate: e.target.value })}
              className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="body-base block font-medium">Duration (days)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={data.durationDays || ''}
              onChange={(e) =>
                updateData({ durationDays: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
            />
          </div>

          {/* Travelers */}
          <div className="space-y-2">
            <label className="body-base block font-medium">Travelers</label>
            <input
              type="number"
              min="1"
              value={data.travelers || ''}
              onChange={(e) =>
                updateData({ travelers: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-(--color-border) bg-white px-4 py-2 text-base focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

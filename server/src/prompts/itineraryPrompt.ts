import type { ItineraryRequest } from '../types/itinerary';

/**
 * Builds the system + user prompt pair for the Anthropic Claude call.
 * Follows the template from 04_API_SPEC.md exactly.
 */

const ITINERARY_SCHEMA = `{
  "destinationSuggestions": [                    // null if destination was specified
    {
      "name": "string",
      "country": "string",
      "whyItFits": "string (1-2 sentences)",
      "bestSeason": "string"
    }
  ] | null,

  "finalDestination": "string",                  // the destination used for the itinerary

  "itinerary": [                                 // length MUST equal durationDays
    {
      "day": "number (1-indexed)",
      "date": "string (ISO date, YYYY-MM-DD)",
      "theme": "string (short label)",
      "blocks": [
        {
          "timeOfDay": "'morning' | 'afternoon' | 'evening'",
          "activity": "string (short name)",
          "description": "string (1-2 sentences)",
          "estimatedDuration": "string (e.g. '2 hours')",
          "estimatedCost": { "amount": "number", "currency": "string" }
        }
      ]
    }
  ],

  "budget": {
    "currency": "string",
    "categories": [
      { "category": "'flights' | 'accommodation' | 'food' | 'activities' | 'localTransport' | 'misc'", "amount": "number" }
    ],
    "total": "number (MUST equal sum of category amounts)",
    "perPersonPerDay": "number"
  },

  "packingChecklist": [
    {
      "category": "'Clothing' | 'Documents' | 'Electronics' | 'Health & Toiletries' | 'Misc'",
      "items": ["string"]
    }
  ]
}`;

const PACE_DESCRIPTIONS: Record<string, string> = {
  relaxed: '2-3 activities/day',
  balanced: '3-4 activities/day',
  packed: '5+ activities/day',
};

export function buildSystemPrompt(): string {
  return `You are a professional travel planner. You produce ONLY valid JSON matching the exact schema provided. No markdown code fences, no commentary before or after, no trailing text. If you cannot determine a value, use a sensible estimate rather than omitting the field.`;
}

export function buildUserPrompt(req: ItineraryRequest): string {
  // Budget description
  let budgetDesc: string;
  if (req.exactBudget) {
    budgetDesc = `${req.exactBudget.amount} ${req.exactBudget.currency} total`;
  } else if (req.budgetTier) {
    budgetDesc = `${req.budgetTier} tier`;
  } else {
    budgetDesc = 'not specified — use reasonable mid-range estimates';
  }

  // Destination instruction
  const destinationDesc = req.destination
    ? req.destination
    : 'Not specified — suggest 3 destinations that fit the preferences below, then build the itinerary for the best-fitting one';

  return `Generate a travel itinerary with these parameters:
- Destination: ${destinationDesc}
- Origin city: ${req.originCity}
- Start date: ${req.startDate}
- Trip duration: EXACTLY ${req.durationDays} days — the itinerary array must contain exactly ${req.durationDays} entries, no more, no fewer.
- Number of travelers: ${req.travelers}
- Budget: ${budgetDesc}
- Trip focus: ${req.tripTypes.join(', ')}
- Pace: ${req.pace} (${PACE_DESCRIPTIONS[req.pace] || 'balanced'})
- Must-see/must-do: ${req.mustSee || 'none specified'}
- Dietary restrictions: ${req.dietaryRestrictions || 'none'}
- Accessibility needs: ${req.accessibilityNeeds || 'none'}

Return JSON matching exactly this schema:
${ITINERARY_SCHEMA}

Rules:
1. itinerary array length MUST equal ${req.durationDays} exactly.
2. budget.total MUST equal the sum of all budget.categories amounts.
3. ${req.destination ? `destinationSuggestions must be null and finalDestination must equal "${req.destination}".` : 'destinationSuggestions must contain exactly 3 suggestions.'}
4. Costs should be realistic for the destination and budget tier, not placeholder round numbers.
5. Packing checklist must reflect destination climate/season and trip type, not a generic list.
6. Return ONLY the JSON object. No prose, no markdown fences.`;
}

/**
 * Builds a retry prompt to append when the first LLM attempt was invalid.
 */
export function buildRetryMessage(reason: string): string {
  return `Your previous response was invalid: ${reason}. Return corrected JSON only.`;
}

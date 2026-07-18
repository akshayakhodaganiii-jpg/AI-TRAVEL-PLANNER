// ──────────────────────────────────────────────
// Request body — what the client sends
// ──────────────────────────────────────────────
export interface ItineraryRequest {
  destination: string | null;       // null = "suggest for me"
  originCity: string;
  startDate: string;                // ISO date
  durationDays: number;
  travelers: number;
  budgetTier: 'budget' | 'mid-range' | 'luxury' | null;
  exactBudget: { amount: number; currency: string } | null;
  tripTypes: string[];              // e.g. ['adventure', 'food']
  pace: 'relaxed' | 'balanced' | 'packed';
  mustSee: string;                  // free text, can be empty
  dietaryRestrictions: string;      // free text, can be empty
  accessibilityNeeds: string;       // free text, can be empty
}

// ──────────────────────────────────────────────
// Response body — what the LLM must return
// ──────────────────────────────────────────────
export interface ItineraryBlock {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  activity: string;
  description: string;
  estimatedDuration: string;        // e.g. "2 hours"
  estimatedCost: { amount: number; currency: string };
}

export interface ItineraryDay {
  day: number;                      // 1-indexed
  date: string;                     // ISO date
  theme: string;                    // e.g. "Old Town & Local Markets"
  blocks: ItineraryBlock[];
}

export interface DestinationSuggestion {
  name: string;
  country: string;
  whyItFits: string;
  bestSeason: string;
}

export interface BudgetCategory {
  category: 'flights' | 'accommodation' | 'food' | 'activities' | 'localTransport' | 'misc';
  amount: number;
}

export interface Budget {
  currency: string;
  categories: BudgetCategory[];
  total: number;
  perPersonPerDay: number;
}

export interface PackingCategory {
  category: 'Clothing' | 'Documents' | 'Electronics' | 'Health & Toiletries' | 'Misc';
  items: string[];
}

export interface ItineraryResponse {
  destinationSuggestions: DestinationSuggestion[] | null;
  finalDestination: string;
  itinerary: ItineraryDay[];
  budget: Budget;
  packingChecklist: PackingCategory[];
}

// ──────────────────────────────────────────────
// Error response — what the server returns on failure
// ──────────────────────────────────────────────
export type ApiErrorCode = 'LLM_TIMEOUT' | 'LLM_INVALID_JSON' | 'VALIDATION_ERROR' | 'UNKNOWN';

export interface ApiError {
  error: true;
  message: string;
  code: ApiErrorCode;
}

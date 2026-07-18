import { Router, Request, Response } from 'express';
import type { ItineraryRequest, ApiError } from '../types/itinerary';
import { generateItinerary, LlmValidationError } from '../services/llmClient';

const router = Router();

// ──────────────────────────────────────────────
// Request body validation
// ──────────────────────────────────────────────

function validateRequest(body: unknown): { valid: true; data: ItineraryRequest } | { valid: false; message: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, message: 'Request body is empty or not an object.' };
  }

  const b = body as Record<string, unknown>;

  // originCity — required non-empty string
  if (typeof b.originCity !== 'string' || !b.originCity.trim()) {
    return { valid: false, message: '"originCity" is required.' };
  }

  // startDate — required ISO date string
  if (typeof b.startDate !== 'string' || !b.startDate.trim()) {
    return { valid: false, message: '"startDate" is required.' };
  }
  if (isNaN(Date.parse(b.startDate))) {
    return { valid: false, message: '"startDate" must be a valid ISO date string.' };
  }

  // durationDays — required, 1-30
  if (typeof b.durationDays !== 'number' || !Number.isInteger(b.durationDays)) {
    return { valid: false, message: '"durationDays" must be an integer.' };
  }
  if (b.durationDays < 1 || b.durationDays > 30) {
    return { valid: false, message: '"durationDays" must be between 1 and 30.' };
  }

  // travelers — required, positive integer
  if (typeof b.travelers !== 'number' || !Number.isInteger(b.travelers) || b.travelers < 1) {
    return { valid: false, message: '"travelers" must be a positive integer.' };
  }

  // tripTypes — required, at least one
  if (!Array.isArray(b.tripTypes) || b.tripTypes.length === 0) {
    return { valid: false, message: '"tripTypes" must be a non-empty array.' };
  }

  // pace — required, one of the valid values
  const validPaces = ['relaxed', 'balanced', 'packed'];
  if (typeof b.pace !== 'string' || !validPaces.includes(b.pace)) {
    return { valid: false, message: `"pace" must be one of: ${validPaces.join(', ')}.` };
  }

  // budgetTier — optional, but if present must be valid
  const validBudgetTiers = ['budget', 'mid-range', 'luxury'];
  if (b.budgetTier !== null && b.budgetTier !== undefined) {
    if (typeof b.budgetTier !== 'string' || !validBudgetTiers.includes(b.budgetTier)) {
      return { valid: false, message: `"budgetTier" must be one of: ${validBudgetTiers.join(', ')} or null.` };
    }
  }

  // Assemble validated request
  const data: ItineraryRequest = {
    destination: typeof b.destination === 'string' && b.destination.trim() ? b.destination.trim() : null,
    originCity: (b.originCity as string).trim(),
    startDate: (b.startDate as string).trim(),
    durationDays: b.durationDays as number,
    travelers: b.travelers as number,
    budgetTier: (b.budgetTier as ItineraryRequest['budgetTier']) ?? null,
    exactBudget: b.exactBudget && typeof b.exactBudget === 'object'
      ? b.exactBudget as { amount: number; currency: string }
      : null,
    tripTypes: b.tripTypes as string[],
    pace: b.pace as ItineraryRequest['pace'],
    mustSee: typeof b.mustSee === 'string' ? b.mustSee : '',
    dietaryRestrictions: typeof b.dietaryRestrictions === 'string' ? b.dietaryRestrictions : '',
    accessibilityNeeds: typeof b.accessibilityNeeds === 'string' ? b.accessibilityNeeds : '',
  };

  return { valid: true, data };
}

// ──────────────────────────────────────────────
// POST /api/generate-itinerary
// ──────────────────────────────────────────────

router.post('/api/generate-itinerary', async (req: Request, res: Response) => {
  // 1. Validate request body
  const validation = validateRequest(req.body);
  if (!validation.valid) {
    const err: ApiError = {
      error: true,
      message: validation.message,
      code: 'VALIDATION_ERROR',
    };
    res.status(400).json(err);
    return;
  }

  try {
    // 2-6. Build prompt → call LLM → validate/retry → return
    const itinerary = await generateItinerary(validation.data);
    res.json(itinerary);
  } catch (error) {
    // LLM validation failed after retry
    if (error instanceof LlmValidationError) {
      const err: ApiError = {
        error: true,
        message: 'The AI returned an improperly formatted response. Please try again.',
        code: 'LLM_INVALID_JSON',
      };
      res.status(502).json(err);
      return;
    }

    // Anthropic SDK timeout / network errors
    if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('ETIMEDOUT'))) {
      const err: ApiError = {
        error: true,
        message: 'The request timed out. Please try again.',
        code: 'LLM_TIMEOUT',
      };
      res.status(504).json(err);
      return;
    }

    // Unknown errors
    console.error('[Route] Unexpected error:', error);
    const err: ApiError = {
      error: true,
      message: 'Something went wrong. Please try again.',
      code: 'UNKNOWN',
    };
    res.status(500).json(err);
  }
});

export default router;

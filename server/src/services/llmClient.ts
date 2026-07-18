import { GoogleGenAI } from '@google/genai';
import type { ItineraryRequest, ItineraryResponse } from '../types/itinerary';
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildRetryMessage,
} from '../prompts/itineraryPrompt';

// ──────────────────────────────────────────────
// Validation helpers
// ──────────────────────────────────────────────

/**
 * Validates the parsed JSON matches the ItineraryResponse schema.
 * Returns a string describing the first failure, or null if valid.
 */
function validateItinerary(
  data: unknown,
  expectedDays: number
): string | null {
  if (!data || typeof data !== 'object') {
    return 'Response is not a JSON object.';
  }

  const resp = data as Record<string, unknown>;

  // finalDestination
  if (typeof resp.finalDestination !== 'string' || !resp.finalDestination) {
    return 'Missing or empty "finalDestination".';
  }

  // itinerary array existence & length
  if (!Array.isArray(resp.itinerary)) {
    return '"itinerary" is not an array.';
  }
  if (resp.itinerary.length !== expectedDays) {
    return `itinerary has ${resp.itinerary.length} days but expected exactly ${expectedDays}.`;
  }

  // itinerary[i].day === i + 1
  for (let i = 0; i < resp.itinerary.length; i++) {
    const day = resp.itinerary[i] as Record<string, unknown>;
    if (day.day !== i + 1) {
      return `itinerary[${i}].day is ${day.day} but expected ${i + 1}.`;
    }
    if (!Array.isArray(day.blocks) || day.blocks.length === 0) {
      return `itinerary[${i}].blocks is missing or empty.`;
    }
  }

  // budget validation
  if (!resp.budget || typeof resp.budget !== 'object') {
    return '"budget" is missing or not an object.';
  }
  const budget = resp.budget as Record<string, unknown>;
  if (!Array.isArray(budget.categories) || budget.categories.length === 0) {
    return '"budget.categories" is missing or empty.';
  }
  const categorySum = (budget.categories as Array<{ amount: number }>).reduce(
    (sum, cat) => sum + (cat.amount ?? 0),
    0
  );
  if (typeof budget.total !== 'number') {
    return '"budget.total" is not a number.';
  }
  if (Math.abs(budget.total - categorySum) >= 1) {
    return `budget.total (${budget.total}) does not equal sum of categories (${categorySum}).`;
  }

  // packing checklist
  if (!Array.isArray(resp.packingChecklist)) {
    return '"packingChecklist" is not an array.';
  }
  if (resp.packingChecklist.length < 3) {
    return `packingChecklist has ${resp.packingChecklist.length} categories but expected at least 3.`;
  }

  return null; // valid
}

/**
 * Attempts to extract a JSON object from the LLM response text.
 * Handles cases where the LLM wraps JSON in markdown fences.
 */
function extractJson(text: string): unknown {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    // Remove opening fence (```json or ```)
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    // Remove closing fence
    cleaned = cleaned.replace(/\n?```\s*$/, '');
    cleaned = cleaned.trim();
  }

  return JSON.parse(cleaned);
}

// ──────────────────────────────────────────────
// LLM client — Google Gemini
// (Swap to Anthropic later by changing this file only)
// ──────────────────────────────────────────────

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type LlmCallResult =
  | { success: true; data: ItineraryResponse }
  | { success: false; reason: string };

/**
 * Single LLM call attempt — builds messages, calls Gemini, parses + validates.
 */
async function attemptLlmCall(
  req: ItineraryRequest,
  retryContext?: string
): Promise<LlmCallResult> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(req);

  // Build the conversation contents
  let fullPrompt = userPrompt;
  if (retryContext) {
    fullPrompt = `${userPrompt}\n\n---\n\nPREVIOUS ATTEMPT FEEDBACK:\n${retryContext}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: fullPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      maxOutputTokens: computeMaxTokens(req.durationDays),
    },
  });

  // Extract text from response
  const text = response.text;
  if (!text) {
    return { success: false, reason: 'No text content in LLM response.' };
  }

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = extractJson(text);
  } catch {
    return {
      success: false,
      reason: `JSON parse failed: ${text.slice(0, 200)}...`,
    };
  }

  // Validate
  const validationError = validateItinerary(parsed, req.durationDays);
  if (validationError) {
    return { success: false, reason: validationError };
  }

  return { success: true, data: parsed as ItineraryResponse };
}

/** Max-tokens scaled by trip duration + overhead for budget/packing. */
function computeMaxTokens(durationDays: number): number {
  const perDayTokens = 350;
  const fixedOverhead = 1500; // budget, packing, destination suggestions, JSON envelope
  return Math.min(perDayTokens * durationDays + fixedOverhead, 16384);
}

/**
 * Main entry point: call LLM, validate, retry once on failure.
 * Throws typed errors for the route handler to catch.
 */
export async function generateItinerary(
  req: ItineraryRequest
): Promise<ItineraryResponse> {
  // First attempt
  const first = await attemptLlmCall(req);
  if (first.success) {
    return first.data;
  }

  console.warn(`[LLM] First attempt failed: ${first.reason}. Retrying...`);

  // Second attempt with corrective message
  const retryMessage = buildRetryMessage(first.reason);
  const second = await attemptLlmCall(req, retryMessage);
  if (second.success) {
    return second.data;
  }

  console.error(`[LLM] Second attempt also failed: ${second.reason}`);
  throw new LlmValidationError(second.reason);
}

/** Custom error class so the route can distinguish LLM validation failures. */
export class LlmValidationError extends Error {
  constructor(public readonly detail: string) {
    super(`LLM returned invalid JSON after retry: ${detail}`);
    this.name = 'LlmValidationError';
  }
}

import type { ItineraryRequest, ItineraryResponse } from '../types/itinerary';

export async function generateItinerary(data: ItineraryRequest): Promise<ItineraryResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000); // 28 seconds

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/generate-itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred', code: 'UNKNOWN' }));
      const error = new Error(errorData.message || 'Failed to generate itinerary');
      (error as any).code = errorData.code || 'UNKNOWN';
      throw error;
    }

    return response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      const error = new Error('Request timed out');
      (error as any).code = 'LLM_TIMEOUT';
      throw error;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

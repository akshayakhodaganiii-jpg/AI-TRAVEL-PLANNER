import { useState } from 'react';
import { generateItinerary } from '../lib/api';
import type { ItineraryRequest, ItineraryResponse, ApiError } from '../types/itinerary';

export function useItineraryGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<ItineraryResponse | null>(null);

  const generate = async (requestData: ItineraryRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateItinerary(requestData);
      setResult(data);
      return data;
    } catch (err: any) {
      const message = err?.message || 'An unknown error occurred';
      const code = err?.code || 'UNKNOWN';
      setError({ error: true, message, code });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading, error, result };
}

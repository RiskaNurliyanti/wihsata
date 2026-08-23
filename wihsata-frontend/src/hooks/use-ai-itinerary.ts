'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { AiPlannerInput, AiPlannerOutput } from '@/types/database.types';

async function requestItinerary(input: AiPlannerInput): Promise<AiPlannerOutput> {
  const res = await apiFetch<{ data: AiPlannerOutput }>('/ai-planner', {
    method: 'POST',
    json: input,
  });
  return res.data;
}

/**
 * Mutation untuk memicu generate itinerary via AI Planner.
 * Fase 6: dipanggil LANGSUNG ke Laravel `/api/ai-planner` (bukan lagi proxy
 * `src/app/api/ai-planner/route.ts`, yang sudah dihapus) — API key OpenRouter
 * hanya ada di Laravel/.env, tidak pernah tersentuh frontend. `ApiError`
 * extends `Error`, jadi `error.message` di komponen pemanggil tetap jalan
 * tanpa perubahan.
 */
export function useAiItinerary() {
  return useMutation({
    mutationFn: requestItinerary,
  });
}

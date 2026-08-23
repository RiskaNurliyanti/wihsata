'use client';

import { useState } from 'react';
import type { AiPlannerOutput } from '@/types/database.types';

interface DownloadPdfParams {
  title: string;
  itinerary: AiPlannerOutput;
  travelersCount?: number;
}

/** Hook untuk trigger download PDF itinerary dari /api/trips/pdf. */
export function useDownloadPdf() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download({ title, itinerary, travelersCount }: DownloadPdfParams) {
    setIsDownloading(true);
    setError(null);

    try {
      const res = await fetch('/api/trips/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, itinerary, travelers_count: travelersCount }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'Gagal mengunduh PDF.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengunduh PDF.');
    } finally {
      setIsDownloading(false);
    }
  }

  return { download, isDownloading, error };
}

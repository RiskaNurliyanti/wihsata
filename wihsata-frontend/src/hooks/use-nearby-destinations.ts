'use client';

import { useQuery } from '@tanstack/react-query';
import type { Destination } from '@/types/database.types';

interface UseNearbyParams {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  enabled?: boolean;
}

async function fetchNearby({ latitude, longitude, radiusKm }: UseNearbyParams): Promise<Destination[]> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    radius: String(radiusKm),
  });

  const res = await fetch(`/api/nearby?${params.toString()}`);
  if (!res.ok) throw new Error('Gagal memuat destinasi terdekat.');

  const json = await res.json();
  return json.data ?? [];
}

/** Query destinasi terdekat berdasarkan koordinat pengguna, dengan caching TanStack Query. */
export function useNearbyDestinations({ latitude, longitude, radiusKm, enabled = true }: UseNearbyParams) {
  return useQuery({
    queryKey: ['nearby-destinations', latitude, longitude, radiusKm],
    queryFn: () => fetchNearby({ latitude, longitude, radiusKm }),
    enabled: enabled && latitude !== null && longitude !== null,
    staleTime: 5 * 60 * 1000, // 5 menit
  });
}

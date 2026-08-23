'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Leaflet bergantung pada `window`, sehingga MUST di-render client-only.
 * Gunakan komponen ini (bukan map-view.tsx langsung) di semua Server Component/page.
 */
export const MapViewDynamic = dynamic(() => import('./map-view').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

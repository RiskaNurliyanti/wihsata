import type { Metadata } from 'next';
import { apiFetch } from '@/lib/api/client';
import { MapsExplorer } from '@/components/explore/maps-explorer';
import type { Destination } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Maps Interaktif',
  description: 'Jelajahi semua destinasi wisata dalam satu peta interaktif berbasis OpenStreetMap.',
};

interface LaravelPaginated<T> {
  data: T[];
}

async function getAllDestinations(): Promise<Destination[]> {
  try {
    const res = await apiFetch<LaravelPaginated<Destination>>('/destinations?sort=rating&per_page=500', {
      skipAuth: true,
    });
    return res.data;
  } catch (error) {
    console.error('MapsPage: gagal memuat destinasi:', error);
    return [];
  }
}

export default async function MapsPage() {
  const destinations = await getAllDestinations();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="font-display text-xl font-bold text-foreground">Maps Interaktif</h1>
        <p className="text-sm text-muted-foreground">{destinations.length} destinasi tersedia di peta</p>
      </div>
      <div className="flex-1">
        <MapsExplorer destinations={destinations} />
      </div>
    </div>
  );
}

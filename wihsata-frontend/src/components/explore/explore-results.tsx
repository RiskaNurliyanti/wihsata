import { SearchX } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { DestinationCard } from '@/components/shared/destination-card';
import { EmptyState } from '@/components/shared/empty-state';
import type { Destination } from '@/types/database.types';

interface ExploreResultsProps {
  searchParams: {
    q?: string;
    category?: string;
    district?: string;
    sort?: string;
    page?: string;
  };
}

const PAGE_SIZE = 12;

interface LaravelPaginated<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
}

export async function ExploreResults({ searchParams }: ExploreResultsProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const query = new URLSearchParams({ page: String(page), per_page: String(PAGE_SIZE) });
  if (searchParams.q) query.set('q', searchParams.q);
  if (searchParams.category) query.set('category', searchParams.category);
  if (searchParams.district) query.set('district', searchParams.district);
  if (searchParams.sort) query.set('sort', searchParams.sort);

  let destinations: Destination[] = [];
  let total = 0;

  try {
    const res = await apiFetch<LaravelPaginated<Destination>>(`/destinations?${query.toString()}`, { skipAuth: true });
    destinations = res.data;
    total = res.total;
  } catch (error) {
    console.error('Explore query error:', error);
  }

  if (destinations.length === 0) {
    return (
      <EmptyState
        className="mt-10"
        icon={SearchX}
        title="Tidak ada destinasi ditemukan"
        description="Coba ubah kata kunci pencarian atau reset filter untuk melihat lebih banyak destinasi."
      />
    );
  }

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-muted-foreground">
        Menampilkan {destinations.length} dari {total || destinations.length} destinasi
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
        {destinations.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { apiFetch } from '@/lib/api/client';
import { ExploreFilters } from '@/components/explore/explore-filters';
import { ExploreResults } from '@/components/explore/explore-results';
import { DestinationCardSkeleton } from '@/components/shared/destination-card-skeleton';
import type { Category, District } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Explore Destinasi',
  description: 'Jelajahi ribuan destinasi wisata Indonesia. Cari berdasarkan kategori, kabupaten/kota, dan rating.',
};

interface ExplorePageProps {
  searchParams: {
    q?: string;
    category?: string;
    district?: string;
    sort?: string;
    page?: string;
  };
}

async function getFilterOptions() {
  try {
    const [categoriesRes, districtsRes] = await Promise.all([
      apiFetch<{ data: Category[] }>('/categories', { skipAuth: true }),
      apiFetch<{ data: District[] }>('/districts', { skipAuth: true }),
    ]);
    return { categories: categoriesRes.data, districts: districtsRes.data };
  } catch (error) {
    console.error('ExplorePage: gagal memuat filter:', error);
    return { categories: [] as Category[], districts: [] as District[] };
  }
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { categories, districts } = await getFilterOptions();

  return (
    <div className="container py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Explore Destinasi</h1>
        <p className="mt-2 text-muted-foreground">
          Temukan destinasi wisata sesuai kategori, lokasi, dan minatmu dari seluruh Indonesia.
        </p>
      </div>

      <ExploreFilters categories={categories} districts={districts} />

      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <DestinationCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ExploreResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

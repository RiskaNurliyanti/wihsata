import type { Metadata } from 'next';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { AdminTripsTable } from '@/components/admin/admin-trips-table';
import type { Trip } from '@/types/database.types';

export const metadata: Metadata = { title: 'Kelola Trip — Admin' };

interface TripWithOwner extends Trip {
  user: { full_name: string | null } | null;
}

async function getTrips(): Promise<{ trips: TripWithOwner[]; error: string | null }> {
  const token = getServerToken();
  if (!token) return { trips: [], error: 'Sesi tidak ditemukan.' };

  try {
    const res = await apiFetch<{ data: TripWithOwner[] }>('/admin/trips?per_page=200', { token });
    return { trips: res.data, error: null };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Gagal memuat data trip.';
    return { trips: [], error: message };
  }
}

export default async function AdminTripsPage() {
  const { trips, error } = await getTrips();

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Kelola Trip</h1>
        <p className="mt-1 text-sm text-muted-foreground">{trips.length} trip dibuat oleh seluruh pengguna.</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          Gagal memuat data: {error}. Pastikan Laravel API dapat diakses dan Anda login sebagai admin.
        </div>
      )}

      <AdminTripsTable trips={trips} />
    </div>
  );
}

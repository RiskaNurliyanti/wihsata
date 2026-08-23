import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { MyTripTabs } from '@/components/trip/my-trip-tabs';
import type { Trip, Destination } from '@/types/database.types';

export const metadata: Metadata = { title: 'My Trip' };

export default async function MyTripPage() {
  const token = getServerToken();
  if (!token) redirect('/auth/login?redirect=/my-trip');

  const [tripsRes, favoritesRes] = await Promise.all([
    apiFetch<{ data: Trip[] }>('/trips', { token }),
    apiFetch<{ data: Destination[] }>('/favorites', { token }),
  ]);

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold text-foreground">My Trip</h1>
      <p className="mt-2 text-muted-foreground">Kelola rencana perjalanan, riwayat, dan tempat favoritmu.</p>

      <div className="mt-8">
        <MyTripTabs trips={tripsRes.data} favorites={favoritesRes.data} />
      </div>
    </div>
  );
}

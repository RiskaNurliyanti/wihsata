import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { Card, CardContent } from '@/components/ui/card';
import { AdminTripForm } from '@/components/admin/trip-form';
import { toDateInputValue } from '@/lib/utils';
import type { ItineraryDay, ItineraryItem, Trip } from '@/types/database.types';

export const metadata: Metadata = { title: 'Edit Trip — Admin' };

interface TripWithOwner extends Trip {
  user: { full_name: string | null } | null;
}

export default async function EditTripPage({ params }: { params: { id: string } }) {
  const token = getServerToken();
  if (!token) notFound();

  let trip: TripWithOwner;
  try {
    const res = await apiFetch<{ data: TripWithOwner }>(`/trips/${params.id}`, { token });
    trip = res.data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Edit Trip</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Milik {trip.user?.full_name ?? 'pengguna tidak dikenal'}.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <AdminTripForm
              tripId={trip.id}
              defaultValues={{
                title: trip.title,
                status: trip.status,
                start_date: toDateInputValue(trip.start_date),
                end_date: toDateInputValue(trip.end_date),
                budget_estimate: trip.budget_estimate ?? undefined,
                is_public: trip.is_public,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-foreground">Itinerary (read-only)</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Itinerary dibuat oleh AI Planner. Untuk mengubah isinya, arahkan pengguna membuat ulang trip lewat AI
              Planner.
            </p>
            <div className="mt-4 max-h-[28rem] space-y-4 overflow-y-auto">
              {trip.itinerary?.length ? (
                (trip.itinerary as ItineraryDay[]).map((day, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-semibold text-foreground">Hari {day.day ?? i + 1}</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {day.items?.map((item: ItineraryItem, j: number) => (
                        <li key={j}>
                          • {item.time} — {item.destination_name} ({item.activity})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada itinerary tersimpan.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

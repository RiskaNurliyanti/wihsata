'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Calendar, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { AdminSearchBox } from '@/components/admin/admin-search-box';
import { DeleteTripButton } from '@/components/admin/delete-trip-button';
import { formatDateID, formatRupiah } from '@/lib/utils';
import type { Trip, TripStatus } from '@/types/database.types';

interface TripWithOwner extends Trip {
  user: { full_name: string | null } | null;
}

const STATUS_VARIANT: Record<TripStatus, 'success' | 'secondary' | 'outline' | 'warning'> = {
  upcoming: 'success',
  draft: 'secondary',
  completed: 'outline',
  archived: 'warning',
};

export function AdminTripsTable({ trips }: { trips: TripWithOwner[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return trips;
    const q = query.trim().toLowerCase();
    return trips.filter((t) => t.title.toLowerCase().includes(q) || t.user?.full_name?.toLowerCase().includes(q));
  }, [trips, query]);

  return (
    <>
      <AdminSearchBox value={query} onChange={setQuery} placeholder="Cari judul trip atau nama pemilik..." className="mt-4" />

      <Card className="mt-4">
        <CardContent className="p-0">
          <ResponsiveTable>
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium text-muted-foreground">Trip</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Pemilik</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Budget</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Publik</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      Tidak ada trip yang cocok dengan &quot;{query}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((trip) => (
                    <tr key={trip.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <span className="font-medium text-foreground">{trip.title}</span>
                        <p className="text-xs text-muted-foreground">{trip.itinerary?.length ?? 0} hari perjalanan</p>
                      </td>
                      <td className="p-4 text-muted-foreground">{trip.user?.full_name ?? '-'}</td>
                      <td className="p-4 text-muted-foreground">
                        {trip.start_date ? (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" /> {formatDateID(trip.start_date)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {trip.budget_estimate ? (
                          <span className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5" /> {formatRupiah(trip.budget_estimate)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={STATUS_VARIANT[trip.status]}>{trip.status}</Badge>
                      </td>
                      <td className="p-4">
                        {trip.is_public ? <Badge variant="success">Ya</Badge> : <Badge variant="secondary">Tidak</Badge>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/trips/${trip.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" /> Edit
                            </Button>
                          </Link>
                          <DeleteTripButton tripId={trip.id} tripTitle={trip.title} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </>
  );
}

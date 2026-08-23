'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Wallet, MapPin, Compass, Heart, Download, Share2, Loader2, Trash2, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DestinationCard } from '@/components/shared/destination-card';
import { EmptyState } from '@/components/shared/empty-state';
import { EditTripDialog } from '@/components/trip/edit-trip-dialog';
import { useDownloadPdf } from '@/hooks/use-download-pdf';
import { deleteOwnTripAction } from '@/lib/actions/trip.actions';
import { formatDateID, formatRupiah } from '@/lib/utils';
import type { Trip, Destination, TripStatus } from '@/types/database.types';

interface MyTripTabsProps {
  trips: Trip[];
  favorites: Destination[];
}

const STATUS_LABEL: Record<TripStatus, { label: string; variant: 'success' | 'secondary' | 'outline' | 'warning' }> = {
  upcoming: { label: 'Akan Datang', variant: 'success' },
  draft: { label: 'Draft', variant: 'secondary' },
  completed: { label: 'Selesai', variant: 'outline' },
  archived: { label: 'Diarsipkan', variant: 'warning' },
};

export function MyTripTabs({ trips, favorites }: MyTripTabsProps) {
  // Search trip & saved place — client-side, data user sendiri sudah dikirim penuh.
  const [tripQuery, setTripQuery] = useState('');
  const [favoriteQuery, setFavoriteQuery] = useState('');

  const filteredTrips = useMemo(() => {
    if (!tripQuery.trim()) return trips;
    const q = tripQuery.trim().toLowerCase();
    return trips.filter((t) => t.title.toLowerCase().includes(q));
  }, [trips, tripQuery]);

  const filteredFavorites = useMemo(() => {
    if (!favoriteQuery.trim()) return favorites;
    const q = favoriteQuery.trim().toLowerCase();
    return favorites.filter((d) => d.name.toLowerCase().includes(q));
  }, [favorites, favoriteQuery]);

  const upcoming = filteredTrips.filter((t) => t.status === 'upcoming' || t.status === 'draft');
  const history = filteredTrips.filter((t) => t.status === 'completed' || t.status === 'archived');

  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming Trip</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="favorites">Saved Place</TabsTrigger>
      </TabsList>

      {trips.length > 0 && (
        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={tripQuery}
            onChange={(e) => setTripQuery(e.target.value)}
            placeholder="Cari trip..."
            className="pl-9"
          />
        </div>
      )}

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={tripQuery ? 'Trip tidak ditemukan' : 'Belum ada trip mendatang'}
            description={
              tripQuery
                ? `Tidak ada trip mendatang yang cocok dengan "${tripQuery}".`
                : 'Buat itinerary baru dengan AI Planner untuk memulai perjalanan berikutnya.'
            }
            action={
              !tripQuery ? (
                <Link href="/ai-planner">
                  <Button variant="gradient">Buat Trip Baru</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {upcoming.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="history">
        {history.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={tripQuery ? 'Trip tidak ditemukan' : 'Belum ada riwayat perjalanan'}
            description={
              tripQuery
                ? `Tidak ada riwayat yang cocok dengan "${tripQuery}".`
                : 'Trip yang sudah selesai akan muncul di sini.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {history.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="favorites">
        {favorites.length > 0 && (
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={favoriteQuery}
              onChange={(e) => setFavoriteQuery(e.target.value)}
              placeholder="Cari tempat favorit..."
              className="pl-9"
            />
          </div>
        )}
        {filteredFavorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={favoriteQuery ? 'Tempat tidak ditemukan' : 'Belum ada tempat favorit'}
            description={
              favoriteQuery
                ? `Tidak ada tempat favorit yang cocok dengan "${favoriteQuery}".`
                : 'Simpan destinasi favoritmu dari halaman Explore untuk melihatnya di sini.'
            }
            action={
              !favoriteQuery ? (
                <Link href="/explore">
                  <Button variant="outline">
                    <Compass className="h-4 w-4" /> Jelajahi Destinasi
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {filteredFavorites.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const router = useRouter();
  const status = STATUS_LABEL[trip.status];
  const { download, isDownloading } = useDownloadPdf();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDownload() {
    download({
      title: trip.title,
      itinerary: {
        summary: trip.title,
        total_estimated_cost: trip.budget_estimate ?? 0,
        days: trip.itinerary,
        recommendations: [],
      },
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(`Hapus trip "${trip.title}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteOwnTripAction(trip.id);
      if (!result.error) router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground">{trip.title}</h3>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {trip.start_date && (
            <p className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateID(trip.start_date)} {trip.end_date && `— ${formatDateID(trip.end_date)}`}
            </p>
          )}
          {trip.budget_estimate && (
            <p className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" />
              {formatRupiah(trip.budget_estimate)}
            </p>
          )}
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            {trip.itinerary.length} hari perjalanan
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <EditTripDialog trip={trip} />
          <Button size="sm" variant="outline" onClick={handleDelete} disabled={isDeleting} className="text-destructive hover:bg-red-50 dark:hover:bg-red-950/30">
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Hapus
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            PDF
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-3.5 w-3.5" /> Bagikan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

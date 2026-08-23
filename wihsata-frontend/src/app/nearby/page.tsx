'use client';

import { useState } from 'react';
import { MapPin, Navigation, LocateFixed, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DestinationCard } from '@/components/shared/destination-card';
import { DestinationCardSkeleton } from '@/components/shared/destination-card-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MapViewDynamic } from '@/components/shared/map-view-dynamic';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useNearbyDestinations } from '@/hooks/use-nearby-destinations';
import { formatDistance } from '@/lib/utils';

export default function NearbyPage() {
  const { latitude, longitude, status, error, requestLocation } = useGeolocation();
  const [radiusKm, setRadiusKm] = useState(25);
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const { data: destinations, isLoading } = useNearbyDestinations({
    latitude,
    longitude,
    radiusKm,
    enabled: status === 'success',
  });

  return (
    <div className="container py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Wisata Terdekat</h1>
          <p className="mt-2 text-muted-foreground">
            Temukan destinasi wisata di sekitar lokasimu saat ini.
          </p>
        </div>

        <div className="flex gap-2 rounded-lg border border-border bg-muted p-1">
          <button
            onClick={() => setView('grid')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'grid' ? 'bg-card shadow-sm text-primary-700 dark:text-primary-400' : 'text-muted-foreground'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'map' ? 'bg-card shadow-sm text-primary-700 dark:text-primary-400' : 'text-muted-foreground'
            }`}
          >
            Peta
          </button>
        </div>
      </div>

      {status !== 'success' ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <LocateFixed className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold text-foreground">Izinkan Akses Lokasi</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Kami butuh izin lokasi untuk menampilkan wisata terdekat dari posisimu. Data lokasi tidak akan
            disimpan tanpa persetujuanmu.
          </p>

          {status === 'denied' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button className="mt-6" variant="gradient" onClick={requestLocation} disabled={status === 'loading'}>
            <MapPin className="h-4 w-4" />
            {status === 'loading' ? 'Mendeteksi lokasi...' : 'Deteksi Lokasi Saya'}
          </Button>
        </div>
      ) : (
        <>
          {/* Filter radius */}
          <div className="mb-8 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Navigation className="h-4 w-4 text-primary-600" />
                Radius pencarian
              </label>
              <span className="text-sm font-semibold text-primary-700">{formatDistance(radiusKm)}</span>
            </div>
            <Slider
              className="mt-4"
              value={[radiusKm]}
              min={5}
              max={100}
              step={5}
              onValueChange={([v]) => setRadiusKm(v)}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <DestinationCardSkeleton key={i} />
              ))}
            </div>
          ) : !destinations || destinations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="Tidak ada destinasi dalam radius ini"
              description="Coba perbesar radius pencarian untuk menemukan lebih banyak destinasi."
            />
          ) : view === 'grid' ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Ditemukan {destinations.length} destinasi dalam radius {formatDistance(radiusKm)}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} />
                ))}
              </div>
            </>
          ) : (
            <div className="h-[600px] overflow-hidden rounded-xl border border-border">
              <MapViewDynamic
                destinations={destinations}
                userLocation={latitude && longitude ? [latitude, longitude] : null}
                zoom={11}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

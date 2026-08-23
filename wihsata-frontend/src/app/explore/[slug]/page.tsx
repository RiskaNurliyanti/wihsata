import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ImageCarousel } from '@/components/shared/image-carousel';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  ExternalLink,
  Wallet,
  Ship,
} from 'lucide-react';
import { getFacilityIcon } from '@/lib/facility-presets';
import { apiFetch, ApiError } from '@/lib/api/client';
import { RatingStars } from '@/components/shared/rating-stars';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReviewSection } from '@/components/explore/review-section';
import { SaveTripButton } from '@/components/explore/save-trip-button';
import { MapViewDynamic } from '@/components/shared/map-view-dynamic';
import { formatRupiah } from '@/lib/utils';
import type { Destination, Review } from '@/types/database.types';

interface DestinationDetailPageProps {
  params: { slug: string };
}

async function getDestination(slug: string) {
  try {
    const res = await apiFetch<{ data: Destination }>(`/destinations/${slug}`, { skipAuth: true });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

async function getReviews(slug: string) {
  try {
    const res = await apiFetch<{ data: Review[] }>(`/destinations/${slug}/reviews`, { skipAuth: true });
    return res.data;
  } catch {
    return [] as Review[];
  }
}

export async function generateMetadata({ params }: DestinationDetailPageProps): Promise<Metadata> {
  const destination = await getDestination(params.slug);
  if (!destination) return { title: 'Destinasi Tidak Ditemukan' };

  return {
    title: destination.name,
    description: destination.description?.slice(0, 155) ?? `Jelajahi ${destination.name} di Wihsata.`,
    openGraph: {
      title: destination.name,
      images: destination.cover_image_url ? [{ url: destination.cover_image_url }] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const destination = await getDestination(params.slug);
  if (!destination) notFound();

  const reviews = await getReviews(destination.slug);

  return (
    <div className="container py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/explore" className="hover:text-primary-600">
          Explore
        </Link>
        <span>/</span>
        {destination.category?.name && (
          <>
            <Link href={`/explore?category=${destination.category.slug}`} className="hover:text-primary-600">
              {destination.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{destination.name}</span>
      </nav>

      {/* Gallery hero — carousel geser, mendukung banyak foto */}
      <ImageCarousel
        images={[destination.cover_image_url, ...(destination.gallery_urls ?? [])].filter(Boolean) as string[]}
        alt={destination.name}
        className="aspect-[16/9] w-full rounded-2xl sm:aspect-[21/9]"
      />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {destination.category?.name && <Badge variant="secondary">{destination.category.name}</Badge>}
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{destination.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <RatingStars rating={destination.rating} />
                <span className="text-sm text-muted-foreground">
                  {destination.rating.toFixed(1)} ({destination.review_count} ulasan)
                </span>
              </div>
            </div>
            <SaveTripButton destinationSlug={destination.slug} destinationId={destination.id} />
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{destination.description}</p>

          {(destination.access_type === 'kapal' || destination.access_type === 'kombinasi') && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/40">
              <Ship className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
              <div>
                <p className="font-semibold text-sky-900 dark:text-sky-300">
                  Destinasi ini {destination.access_type === 'kombinasi' ? 'perlu nyambung kapal' : 'wajib naik kapal'}
                </p>
                <div className="mt-1.5 space-y-1 text-sm text-sky-800 dark:text-sky-400">
                  {destination.departure_port && <p>Berangkat dari: {destination.departure_port}</p>}
                  {destination.crossing_duration_minutes && <p>Estimasi durasi penyeberangan: ±{destination.crossing_duration_minutes} menit</p>}
                  {destination.crossing_cost_estimate && <p>Estimasi biaya kapal: {formatRupiah(destination.crossing_cost_estimate)} /orang</p>}
                  {destination.crossing_notes && <p className="italic">{destination.crossing_notes}</p>}
                </div>
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Alamat" value={destination.address ?? '-'} />
            <InfoRow icon={Wallet} label="Harga Tiket" value={destination.price_range ?? 'Gratis'} />
            <OpeningHoursCard hours={destination.opening_hours} />
            {/* Blok ini tidak dirender kalau safety_score belum diisi admin. */}
            {destination.safety_score !== null && (
              <div className="flex items-start gap-3 rounded-lg border border-border p-3 sm:col-span-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Safety Score</p>
                  <p className="text-sm font-medium text-foreground">{destination.safety_score.toFixed(1)} / 5.0</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Sumber: {destination.safety_source ?? 'Tidak dicantumkan'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {destination.facilities && destination.facilities.length > 0 && (
            <>
              <Separator className="my-8" />
              <h3 className="font-display text-lg font-semibold text-foreground">Fasilitas</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {destination.facilities.map((f) => {
                  const FacilityIcon = getFacilityIcon(f);
                  return (
                    <Badge key={f} variant="outline" className="gap-1">
                      <FacilityIcon className="h-3 w-3" />
                      {f}
                    </Badge>
                  );
                })}
              </div>
            </>
          )}

          <Separator className="my-8" />
          <ReviewSection destinationSlug={destination.slug} reviews={reviews} />
        </div>

        {/* Sidebar: map + actions */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-64 w-full">
              <MapViewDynamic
                destinations={[destination]}
                center={[destination.latitude, destination.longitude]}
                zoom={14}
              />
            </div>
            <CardContent className="pt-4">
              {destination.google_maps_url && (
                <a href={destination.google_maps_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    Buka di Google Maps <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <Link href={`/ai-planner?destination=${destination.slug}`} className="mt-2 block">
                <Button variant="gradient" className="w-full">
                  Rencanakan Trip dengan AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-display font-semibold text-foreground">Butuh bantuan?</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Hubungi layanan darurat setempat jika terjadi kondisi mendesak selama perjalanan.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary-700">
                <Phone className="h-4 w-4" /> 112 (Nomor Darurat Nasional)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/** Jadwal operasional seminggu penuh, dengan hari ini ditandai. */
const WEEKDAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Senin' },
  { key: 'tue', label: 'Selasa' },
  { key: 'wed', label: 'Rabu' },
  { key: 'thu', label: 'Kamis' },
  { key: 'fri', label: 'Jumat' },
  { key: 'sat', label: 'Sabtu' },
  { key: 'sun', label: 'Minggu' },
];

function OpeningHoursCard({ hours }: { hours: Record<string, string> | null }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase().slice(0, 3);

  // Belum diisi admin sama sekali — tampilkan default umum seperti sebelumnya,
  // tapi tetap dalam format kartu yang sama (bukan cuma 1 baris teks).
  if (!hours || Object.keys(hours).length === 0) {
    return (
      <div className="rounded-lg border border-border p-3 sm:col-span-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-primary-600" />
          <p className="text-xs text-muted-foreground">Jam Operasional</p>
        </div>
        <p className="mt-1.5 text-sm font-medium text-foreground">Setiap hari 08:00 - 17:00</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-3 sm:col-span-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0 text-primary-600" />
        <p className="text-xs text-muted-foreground">Jam Operasional</p>
      </div>
      <div className="mt-2 space-y-1">
        {WEEKDAYS.map((day) => {
          const isToday = day.key === today;
          const value = hours[day.key];
          return (
            <div
              key={day.key}
              className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
                isToday ? 'bg-primary-50 font-semibold text-primary-700' : 'text-foreground'
              }`}
            >
              <span>
                {day.label}
                {isToday && <span className="ml-1.5 text-xs font-normal text-primary-600">(Hari ini)</span>}
              </span>
              <span className={value ? '' : 'text-muted-foreground'}>{value ?? 'Tidak ada info'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

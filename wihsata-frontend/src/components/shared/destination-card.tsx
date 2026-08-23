import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Navigation, Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from '@/lib/utils';
import type { Destination } from '@/types/database.types';

interface DestinationCardProps {
  destination: Destination;
  priority?: boolean;
}

/** Kartu destinasi yang dipakai konsisten di Explore, Nearby, dan Home. */
export function DestinationCard({ destination, priority = false }: DestinationCardProps) {
  return (
    <Link
      href={`/explore/${destination.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {destination.cover_image_url ? (
          <Image
            src={destination.cover_image_url}
            alt={destination.name}
            fill
            priority={priority}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {destination.is_featured && <Badge variant="pro">Featured</Badge>}
          {(destination.access_type === 'kapal' || destination.access_type === 'kombinasi') && (
            <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-400">
              <Ship className="h-3 w-3" /> Perlu Kapal
            </Badge>
          )}
        </div>

        {typeof destination.distance_km === 'number' && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Navigation className="h-3 w-3" />
            {formatDistance(destination.distance_km)}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-display text-base font-semibold text-foreground">{destination.name}</h3>
          <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-amber-600">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {destination.rating > 0 ? destination.rating.toFixed(1) : 'Baru'}
          </div>
        </div>

        {destination.category?.name && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-600">
            {destination.category.name}
          </p>
        )}

        {destination.address && (
          <p className="mt-2 line-clamp-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {destination.address}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-foreground">
            {destination.price_range && destination.price_range !== 'Gratis'
              ? destination.price_range
              : 'Gratis'}
          </span>
          <span className="text-xs text-muted-foreground">{destination.review_count} ulasan</span>
        </div>
      </div>
    </Link>
  );
}

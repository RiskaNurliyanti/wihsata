import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
}

/** Tampilkan rating 0-5 sebagai bintang (mendukung nilai desimal via fill 50%). */
export function RatingStars({ rating, size = 16, className }: RatingStarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating > i && rating < i + 1;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-muted-foreground/30" style={{ width: size, height: size }} />
            {(filled || half) && (
              <Star
                className="absolute inset-0 fill-amber-500 text-amber-500"
                style={{ width: size, height: size, clipPath: half ? 'inset(0 50% 0 0)' : undefined }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

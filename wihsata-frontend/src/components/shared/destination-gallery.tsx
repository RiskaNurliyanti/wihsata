'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DestinationGalleryProps {
  images: string[];
  name: string;
}

/** Galeri swipeable (drag/touch) untuk hero halaman detail destinasi. */
export function DestinationGallery({ images, name }: DestinationGalleryProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground sm:aspect-[21/9]">
        <MapPin className="h-10 w-10" />
      </div>
    );
  }

  function goTo(next: number) {
    setIndex((next + images.length) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      goTo(deltaX > 0 ? index - 1 : index + 1);
    }
    touchStartX.current = null;
  }

  return (
    <div className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl bg-muted sm:aspect-[21/9]">
      <div
        className="flex h-full w-full touch-pan-y transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((url, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <Image
              src={url}
              alt={`${name} ${i + 1}`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Gambar sebelumnya"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Gambar berikutnya"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ke gambar ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  'h-1.5 rounded-full bg-white/60 transition-all',
                  i === index ? 'w-6 bg-white' : 'w-1.5'
                )}
              />
            ))}
          </div>

          <div className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

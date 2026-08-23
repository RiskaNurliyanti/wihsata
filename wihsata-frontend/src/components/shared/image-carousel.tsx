'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

/** Galeri foto geser (carousel) untuk halaman detail destinasi — mendukung banyak foto. */
export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <MapPin className="h-10 w-10" />
      </div>
    );
  }

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  return (
    <div className={cn('group relative overflow-hidden bg-muted', className)}>
      {images.map((src, i) => (
        <div
          key={src + i}
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            i === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            priority={i === 0}
            quality={90}
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ke foto ${i + 1}`}
                className={cn('h-1.5 rounded-full transition-all', i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50')}
              />
            ))}
          </div>

          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
            {activeIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}

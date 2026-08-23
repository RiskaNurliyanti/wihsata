import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { CategoriesGrid } from '@/components/landing/categories-grid';
import { WhyChooseUs } from '@/components/landing/why-choose-us';
import { Testimonials } from '@/components/landing/testimonials';
import { CtaSection } from '@/components/landing/cta-section';
import { DestinationCard } from '@/components/shared/destination-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api/client';
import { MapPinOff } from 'lucide-react';
import type { Destination } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Wihsata — Rencanakan Perjalananmu dengan AI',
  description:
    'Temukan destinasi wisata terdekat, jelajahi ribuan tempat wisata Indonesia, dan buat itinerary otomatis dengan AI.',
};

interface LaravelPaginated<T> {
  data: T[];
}

async function getTrendingDestinations(): Promise<Destination[]> {
  try {
    const res = await apiFetch<LaravelPaginated<Destination>>('/destinations?is_featured=1&sort=rating&per_page=6', {
      skipAuth: true,
    });
    return res.data;
  } catch (error) {
    console.error('Failed to load trending destinations:', error);
    return [];
  }
}

export default async function HomePage() {
  const trending = await getTrendingDestinations();

  return (
    <>
      <Hero />

      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Trending" title="Destinasi paling banyak dikunjungi" />
          <Link href="/explore">
            <Button variant="ghost">
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {trending.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {trending.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} priority={i < 3} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            icon={MapPinOff}
            title="Belum ada destinasi trending"
            description="Data akan muncul setelah destinasi ditambahkan melalui admin dashboard atau seed database."
            action={
              <Link href="/explore">
                <Button variant="outline">Jelajahi Semua Destinasi</Button>
              </Link>
            }
          />
        )}
      </section>

      <CategoriesGrid />
      <Features />
      <WhyChooseUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}

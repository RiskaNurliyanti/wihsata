'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QUICK_SEARCHES = ['Pantai', 'Air Terjun', 'Kuliner Malam', 'Camping', 'Wisata Budaya'];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-primary-950/40 dark:via-background dark:to-background">
      {/* Dekorasi blob */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            Ditenagai AI — Rencanakan trip dalam hitungan detik
          </span>

          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Jelajahi Indonesia,{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
              Direncanakan oleh AI
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            Temukan destinasi terdekat, jelajahi ribuan tempat wisata, dan biarkan AI menyusun itinerary
            perjalanan sempurna sesuai budget dan minatmu.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari destinasi, kota, atau aktivitas..."
                className="h-12 pl-10 text-base shadow-elevated"
              />
            </div>
            <Button type="submit" size="lg" variant="gradient">
              Cari Destinasi
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> Populer:
            </span>
            {QUICK_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/explore?q=${encodeURIComponent(tag)}`)}
                className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-400"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" size="sm" onClick={() => router.push('/nearby')}>
              <MapPin className="h-4 w-4" />
              Gunakan lokasi saya untuk cari wisata terdekat
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Waves, Mountain, Droplets, Utensils, Landmark, Trees } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

const CATEGORIES = [
  { slug: 'pantai', name: 'Pantai', icon: Waves, color: 'bg-sky-50 text-sky-600' },
  { slug: 'gunung', name: 'Gunung', icon: Mountain, color: 'bg-emerald-50 text-emerald-600' },
  { slug: 'air-terjun', name: 'Air Terjun', icon: Droplets, color: 'bg-cyan-50 text-cyan-600' },
  { slug: 'kuliner', name: 'Kuliner', icon: Utensils, color: 'bg-orange-50 text-orange-600' },
  { slug: 'budaya-sejarah', name: 'Budaya & Sejarah', icon: Landmark, color: 'bg-amber-50 text-amber-600' },
  { slug: 'taman-hutan', name: 'Taman & Hutan', icon: Trees, color: 'bg-lime-50 text-lime-600' },
];

export function CategoriesGrid() {
  return (
    <section className="container py-20">
      <SectionHeading eyebrow="Kategori" title="Jelajahi berdasarkan minatmu" align="center" className="mx-auto" />

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/explore?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-hover"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${cat.color}`}>
              <cat.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-foreground">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

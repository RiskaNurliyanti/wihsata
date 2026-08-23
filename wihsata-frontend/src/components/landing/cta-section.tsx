import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
          Siap merencanakan trip berikutnya?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-primary-100">
          Daftar gratis dan mulai buat itinerary AI pertamamu hari ini. Upgrade ke Pro kapan saja untuk fitur tanpa batas.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
              Daftar Gratis Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              Lihat Demo vs Pro
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

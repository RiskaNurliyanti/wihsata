import { CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

const REASONS = [
  'Rekomendasi dipersonalisasi berdasarkan minat & budget kamu',
  'Data destinasi terverifikasi komunitas, bukan iklan berbayar',
  'Peta & rute real-time berbasis OpenStreetMap yang akurat',
  'Fitur AI Planner tersedia gratis (2x/hari) untuk semua pengguna',
  'Tanpa iklan mengganggu di paket Pro',
];

export function WhyChooseUs() {
  return (
    <section className="container py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Kenapa Wihsata" title="Dibangun untuk traveler Indonesia yang cerdas" />
          <ul className="mt-8 space-y-4">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span className="text-muted-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent/20 shadow-elevated dark:from-primary-950/60 dark:to-accent/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 p-8">
              {[
                { value: '2.500+', label: 'Destinasi' },
                { value: '15rb+', label: 'Traveler' },
                { value: '98%', label: 'Kepuasan' },
                { value: '4.7/5', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-card/90 p-5 text-center shadow-soft backdrop-blur">
                  <p className="font-display text-2xl font-bold text-primary-700">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

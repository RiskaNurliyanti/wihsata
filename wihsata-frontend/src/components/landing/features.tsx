'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, Wallet, Map as MapIcon, Users, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Deteksi Lokasi Otomatis',
    description: 'Temukan wisata terdekat dari posisimu saat ini, lengkap dengan filter radius dan kategori.',
  },
  {
    icon: Sparkles,
    title: 'AI Trip Planner',
    description: 'Cukup masukkan preferensi — AI menyusun itinerary lengkap dengan rute, waktu, dan estimasi biaya.',
  },
  {
    icon: Wallet,
    title: 'Kalkulator Budget',
    description: 'Hitung total biaya perjalanan: transportasi, tiket masuk, makan, hingga penginapan dalam satu tempat.',
  },
  {
    icon: MapIcon,
    title: 'Peta Interaktif',
    description: 'Jelajahi semua destinasi dalam peta interaktif berbasis OpenStreetMap dengan navigasi rute.',
  },
  {
    icon: Users,
    title: 'Komunitas Traveler',
    description: 'Bagikan pengalaman, unggah foto, dan dapatkan rekomendasi dari sesama traveler.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Score',
    description: 'Setiap destinasi dilengkapi skor keamanan berbasis ulasan komunitas dan data lokasi.',
  },
];

export function Features() {
  return (
    <section className="container py-20">
      <SectionHeading
        eyebrow="Fitur Utama"
        title="Semua yang kamu butuhkan untuk trip sempurna"
        description="Dari pencarian hingga eksekusi perjalanan, Wihsata mendampingi setiap langkahmu."
        align="center"
        className="mx-auto"
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-hover"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

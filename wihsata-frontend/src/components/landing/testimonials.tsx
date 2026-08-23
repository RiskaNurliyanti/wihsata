'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

const TESTIMONIALS = [
  {
    name: 'Dita Ayu',
    role: 'Solo Traveler',
    quote:
      'AI Planner-nya bikin trip 3 hari ke Yogyakarta beres direncanakan cuma dalam 5 menit. Rute efisien dan budget pas.',
    rating: 5,
  },
  {
    name: 'Reza Pratama',
    role: 'Family Trip Organizer',
    quote:
      'Fitur Nearby sangat membantu waktu jalan-jalan mendadak sekeluarga. Langsung ketemu wisata terdekat dari lokasi.',
    rating: 5,
  },
  {
    name: 'Sinta Wulandari',
    role: 'Travel Blogger',
    quote: 'Komunitasnya aktif, banyak insight hidden gem yang nggak ada di platform lain.',
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="bg-primary-950 py-20">
      <div className="container">
        <SectionHeading
          eyebrow="Testimoni"
          title="Dipercaya ribuan traveler Indonesia"
          align="center"
          className="mx-auto [&_h2]:text-white [&_span]:text-primary-300"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-primary-900 bg-primary-900/40 p-6 backdrop-blur-sm"
            >
              <Quote className="h-6 w-6 text-primary-500" />
              <p className="mt-4 text-sm leading-relaxed text-primary-100">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-primary-400">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-primary-700'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

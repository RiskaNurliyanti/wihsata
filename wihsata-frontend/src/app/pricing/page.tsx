import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/shared/section-heading';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { formatRupiah } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Demo vs Pro — Pilih Paket yang Tepat',
  description: 'Bandingkan fitur paket Demo (gratis) dan Pro Wihsata. Upgrade kapan saja untuk fitur AI tanpa batas.',
};

const COMPARISON_ROWS: { feature: string; demo: string | boolean; pro: string | boolean }[] = [
  { feature: 'Nearby & Explore Destinasi', demo: true, pro: true },
  { feature: 'Detail Destinasi Lengkap', demo: true, pro: true },
  { feature: 'AI Trip Planner', demo: '2x / hari', pro: 'Unlimited' },
  { feature: 'Simpan Trip', demo: 'Maks. 3 trip', pro: 'Unlimited' },
  { feature: 'Download Itinerary PDF', demo: false, pro: true },
  { feature: 'Offline Guide', demo: false, pro: true },
  { feature: 'Hidden Gem Finder', demo: false, pro: true },
  { feature: 'Extra AI Tools (Packing List, dll)', demo: false, pro: true },
  { feature: 'Bebas Iklan', demo: false, pro: true },
];

const FAQ = [
  {
    q: 'Apakah saya bisa membatalkan langganan Pro kapan saja?',
    a: 'Ya, Anda bisa membatalkan langganan Pro kapan saja melalui halaman pengaturan akun. Akses Pro tetap aktif hingga akhir periode yang sudah dibayar.',
  },
  {
    q: 'Apa yang terjadi jika kuota AI Planner Demo habis?',
    a: 'Kuota akan direset otomatis setiap hari pukul 00:00 WIB. Anda juga bisa upgrade ke Pro untuk generate tanpa batas.',
  },
  {
    q: 'Apakah data trip saya hilang jika downgrade dari Pro ke Demo?',
    a: 'Tidak. Trip yang sudah tersimpan tetap ada, namun Anda hanya bisa membuat trip baru sesuai batas paket Demo.',
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Harga"
        title="Pilih paket yang sesuai kebutuhanmu"
        description="Mulai gratis dengan paket Demo, upgrade ke Pro kapan saja untuk pengalaman tanpa batas."
        align="center"
        className="mx-auto"
      />

      {/* Pricing cards */}
      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-8">
            <h3 className="font-display text-xl font-bold text-foreground">Demo</h3>
            <p className="mt-1 text-sm text-muted-foreground">Untuk kamu yang ingin mencoba fitur inti secara gratis.</p>
            <p className="mt-6 font-display text-4xl font-bold text-foreground">Rp 0</p>
            <p className="text-sm text-muted-foreground">selamanya gratis</p>

            <ul className="mt-6 space-y-3 text-sm">
              <FeatureItem included>Nearby & Explore destinasi</FeatureItem>
              <FeatureItem included>AI Planner 2x/hari</FeatureItem>
              <FeatureItem included>Simpan maks. 3 trip</FeatureItem>
              <FeatureItem>Download PDF</FeatureItem>
              <FeatureItem>Offline guide & hidden gems</FeatureItem>
            </ul>

            <Link href="/auth/register" className="mt-8 block">
              <Button variant="outline" className="w-full">
                Mulai Gratis
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative border-primary-300 shadow-elevated">
          <Badge variant="pro" className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Sparkles className="h-3 w-3" /> Paling Populer
          </Badge>
          <CardContent className="pt-8">
            <h3 className="font-display text-xl font-bold text-foreground">Pro</h3>
            <p className="mt-1 text-sm text-muted-foreground">Untuk traveler aktif yang butuh fitur tanpa batas.</p>
            <p className="mt-6 font-display text-4xl font-bold text-foreground">{formatRupiah(49000)}</p>
            <p className="text-sm text-muted-foreground">per bulan</p>

            <ul className="mt-6 space-y-3 text-sm">
              <FeatureItem included>Semua fitur Demo</FeatureItem>
              <FeatureItem included>AI Planner unlimited</FeatureItem>
              <FeatureItem included>Simpan trip unlimited</FeatureItem>
              <FeatureItem included>Download itinerary PDF</FeatureItem>
              <FeatureItem included>Offline guide & hidden gem finder</FeatureItem>
              <FeatureItem included>Bebas iklan</FeatureItem>
            </ul>

            <Link href="/auth/register?plan=pro" className="mt-8 block">
              <Button variant="gradient" className="w-full">
                Upgrade ke Pro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Comparison table */}
      <div className="mx-auto mt-20 max-w-4xl">
        <h2 className="text-center font-display text-2xl font-bold text-foreground">Perbandingan Fitur Lengkap</h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <ResponsiveTable>
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">Fitur</th>
                  <th className="p-4 text-center font-semibold text-foreground">Demo</th>
                  <th className="p-4 text-center font-semibold text-primary-700">Pro</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/40'}>
                    <td className="p-4 text-foreground">{row.feature}</td>
                    <td className="p-4 text-center">
                      <CellValue value={row.demo} />
                    </td>
                    <td className="p-4 text-center">
                      <CellValue value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTable>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="text-center font-display text-2xl font-bold text-foreground">Pertanyaan Umum</h2>
        <div className="mt-8 space-y-4">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border p-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">{item.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {included ? <Check className="h-4 w-4 shrink-0 text-primary-600" /> : <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />}
      <span className={included ? 'text-foreground' : 'text-muted-foreground/60 line-through'}>{children}</span>
    </li>
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? <Check className="mx-auto h-4 w-4 text-primary-600" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  }
  return <span className="font-medium text-foreground">{value}</span>;
}

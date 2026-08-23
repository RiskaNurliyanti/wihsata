import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MaintenanceGate } from '@/components/shared/maintenance-gate';
import { apiFetch } from '@/lib/api/client';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wihsata.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Wihsata — Rencanakan Perjalananmu dengan AI',
    template: '%s | Wihsata',
  },
  description:
    'Temukan destinasi wisata terdekat, jelajahi ribuan tempat wisata Indonesia, dan buat itinerary perjalanan otomatis dengan bantuan AI. Gratis untuk memulai.',
  keywords: ['wisata', 'travel planner', 'ai itinerary', 'destinasi wisata indonesia', 'trip planner ai'],
  authors: [{ name: 'Wihsata' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'Wihsata',
    title: 'Wihsata — Rencanakan Perjalananmu dengan AI',
    description: 'Temukan, rencanakan, dan jelajahi destinasi wisata terbaik dengan bantuan AI.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Wihsata' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wihsata — Rencanakan Perjalananmu dengan AI',
    description: 'Temukan, rencanakan, dan jelajahi destinasi wisata terbaik dengan bantuan AI.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#19775b',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Cek status maintenance di server tiap request halaman. Kalau API tidak
  // bisa dihubungi, fallback ke "tidak maintenance" agar situs tidak ikut
  // terkunci akibat error jaringan.
  let maintenanceEnabled = false;
  let maintenanceMessage = '';
  try {
    const res = await apiFetch<{ data: { enabled: boolean; message: string } }>('/maintenance-status', {
      skipAuth: true,
    });
    maintenanceEnabled = res.data.enabled;
    maintenanceMessage = res.data.message;
  } catch (error) {
    console.error('RootLayout: gagal memuat status maintenance:', error);
  }

  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">
            <MaintenanceGate maintenanceEnabled={maintenanceEnabled} maintenanceMessage={maintenanceMessage}>
              {children}
            </MaintenanceGate>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

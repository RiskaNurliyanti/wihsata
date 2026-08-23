import type { Metadata } from 'next';
import { MapPin, Users, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export const metadata: Metadata = { title: 'Admin Dashboard' };

interface AdminStats {
  destinations: number;
  users: number;
  reviews: number;
  trips: number;
}

async function getStats(): Promise<AdminStats> {
  const token = getServerToken();
  if (!token) return { destinations: 0, users: 0, reviews: 0, trips: 0 };

  try {
    const res = await apiFetch<{ data: AdminStats }>('/admin/stats', { token });
    return { destinations: res.data.destinations, users: res.data.users, reviews: res.data.reviews, trips: res.data.trips };
  } catch {
    return { destinations: 0, users: 0, reviews: 0, trips: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Destinasi', value: stats.destinations, icon: MapPin, color: 'text-primary-600 bg-primary-50' },
    { label: 'Total Pengguna', value: stats.users, icon: Users, color: 'text-sky-600 bg-sky-50' },
    { label: 'Total Ulasan', value: stats.reviews, icon: Star, color: 'text-amber-600 bg-amber-50' },
    { label: 'Trip Dibuat', value: stats.trips, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ringkasan aktivitas platform Wihsata.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString('id-ID')}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Langkah Selanjutnya</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Kelola data destinasi di menu <strong>Destinasi</strong> — tambah, edit, atau hapus.</li>
            <li>Pantau pertumbuhan pengguna dan konversi Pro di menu <strong>Analitik</strong>.</li>
            <li>Moderasi konten komunitas & ulasan yang dilaporkan pengguna.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

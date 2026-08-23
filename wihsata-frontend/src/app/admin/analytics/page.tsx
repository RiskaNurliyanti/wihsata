import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export const metadata: Metadata = { title: 'Analitik — Admin' };

interface TopDestination {
  name: string;
  rating: number;
  review_count: number;
}

interface AdminAnalyticsStats {
  subscriptions_by_tier: { demo: number; pro: number };
  top_destinations: TopDestination[];
}

async function getAnalytics() {
  const token = getServerToken();
  if (!token) return { demoCount: 0, proCount: 0, topDestinations: [] as TopDestination[] };

  try {
    const res = await apiFetch<{ data: AdminAnalyticsStats }>('/admin/stats', { token });
    return {
      demoCount: res.data.subscriptions_by_tier.demo,
      proCount: res.data.subscriptions_by_tier.pro,
      topDestinations: res.data.top_destinations,
    };
  } catch {
    return { demoCount: 0, proCount: 0, topDestinations: [] as TopDestination[] };
  }
}

export default async function AdminAnalyticsPage() {
  const { demoCount, proCount, topDestinations } = await getAnalytics();
  const total = demoCount + proCount || 1;
  const conversionRate = ((proCount / total) * 100).toFixed(1);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Analitik</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ringkasan konversi dan performa destinasi.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Konversi Demo → Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold text-primary-700">{conversionRate}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {proCount} pengguna Pro dari total {total} pengguna berlangganan.
            </p>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary-600" style={{ width: `${conversionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinasi Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topDestinations.map((dest, i) => (
                <li key={dest.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                      {i + 1}
                    </span>
                    {dest.name}
                  </span>
                  <span className="text-muted-foreground">{dest.review_count} ulasan</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import type { MetadataRoute } from 'next';
import { apiFetch } from '@/lib/api/client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wihsata.com';

interface LaravelPaginated<T> {
  data: T[];
}

/** Sitemap dinamis — menyertakan seluruh destinasi & artikel yang published. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${APP_URL}/explore`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/nearby`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${APP_URL}/ai-planner`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${APP_URL}/maps`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${APP_URL}/community`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${APP_URL}/blog`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${APP_URL}/pricing`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  let destinations: { slug: string; updated_at: string }[] = [];
  let articles: { slug: string; published_at: string | null }[] = [];

  try {
    const [destRes, articleRes] = await Promise.all([
      apiFetch<LaravelPaginated<{ slug: string; updated_at: string }>>('/destinations?per_page=5000', {
        skipAuth: true,
      }),
      apiFetch<LaravelPaginated<{ slug: string; published_at: string | null }>>('/articles?per_page=1000', {
        skipAuth: true,
      }),
    ]);
    destinations = destRes.data;
    articles = articleRes.data;
  } catch (error) {
    console.error('sitemap: gagal memuat data dinamis:', error);
  }

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${APP_URL}/explore/${d.slug}`,
    lastModified: d.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${APP_URL}/blog/${a.slug}`,
    lastModified: a.published_at ?? undefined,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...destinationRoutes, ...articleRoutes];
}

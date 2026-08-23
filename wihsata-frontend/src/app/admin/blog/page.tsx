import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { Button } from '@/components/ui/button';
import { AdminArticlesTable } from '@/components/admin/admin-articles-table';
import type { Article } from '@/types/database.types';

export const metadata: Metadata = { title: 'Kelola Blog — Admin' };

async function getArticles(): Promise<Article[]> {
  const token = getServerToken();
  if (!token) return [];

  try {
    const res = await apiFetch<{ data: Article[] }>('/admin/articles', { token });
    return res.data;
  } catch {
    return [];
  }
}

export default async function AdminBlogPage() {
  const articles = await getArticles();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Kelola Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">{articles.length} artikel tersimpan.</p>
        </div>
        <Link href="/admin/blog/new" className="w-full sm:w-auto">
          <Button variant="gradient" className="w-full sm:w-auto">
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Button>
        </Link>
      </div>

      <AdminArticlesTable articles={articles} />
    </div>
  );
}

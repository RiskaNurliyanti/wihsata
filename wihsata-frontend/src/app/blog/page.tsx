import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, PenLine, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { EmptyState } from '@/components/shared/empty-state';
import { BlogSearchBar } from '@/components/shared/blog-search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateID, estimateReadingTime } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import type { Article } from '@/types/database.types';

export const metadata: Metadata = {
  title: 'Blog Travel',
  description: 'Tips travel, panduan solo travel, budget travel, dan cerita perjalanan dari komunitas Wihsata.',
};

export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  const token = getServerToken();
  const isLoggedIn = !!token;
  const searchQuery = searchParams.q ?? '';

  let articles: Article[] = [];
  try {
    const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
    const res = await apiFetch<{ data: Article[] }>(`/articles?per_page=30${qParam}`, { skipAuth: true });
    articles = res.data;
  } catch (error) {
    console.error('BlogPage: gagal memuat artikel:', error);
  }

  return (
    <div className="container py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Blog Travel</h1>
        <p className="mt-2 text-muted-foreground">
          Tips, panduan, dan cerita perjalanan untuk membantumu merencanakan trip terbaik — ditulis oleh tim & komunitas Wihsata.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {isLoggedIn ? (
            <>
              <Link href="/blog/write">
                <Button variant="gradient">
                  <PenLine className="h-4 w-4" /> Tulis Artikel
                </Button>
              </Link>
              <Link href="/blog/mine">
                <Button variant="outline">
                  <FileText className="h-4 w-4" /> Artikel Saya
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/login?redirect=/blog/write">
              <Button variant="outline">
                <PenLine className="h-4 w-4" /> Masuk untuk Menulis
              </Button>
            </Link>
          )}
        </div>

        <BlogSearchBar />
      </div>

      {articles.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={BookOpen}
          title={searchQuery ? 'Artikel tidak ditemukan' : 'Belum ada artikel'}
          description={
            searchQuery
              ? `Tidak ada artikel yang cocok dengan "${searchQuery}".`
              : 'Artikel akan tampil di sini setelah dipublikasikan.'
          }
        />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="relative aspect-[16/9] w-full bg-muted">
                {article.cover_image_url && (
                  <Image src={article.cover_image_url} alt={article.title} fill quality={90} className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                {article.category && <Badge variant="secondary">{article.category}</Badge>}
                <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold text-foreground">{article.title}</h3>
                {article.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>}
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {article.published_at && <span>{formatDateID(article.published_at)}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {estimateReadingTime(article.content)} menit baca
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

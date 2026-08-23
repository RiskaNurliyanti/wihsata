import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { formatDateID, estimateReadingTime } from '@/lib/utils';
import { BlogComments } from '@/components/shared/blog-comments';
import type { Article } from '@/types/database.types';

interface BlogDetailPageProps {
  params: { slug: string };
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    // skipAuth: true — perilaku dipertahankan sama seperti sebelumnya
    // (filter `is_published=true`), draft TIDAK ditampilkan di halaman publik
    // ini sekalipun yang mengakses adalah penulisnya sendiri.
    const res = await apiFetch<{ data: Article }>(`/articles/${slug}`, { skipAuth: true });
    return res.data.is_published ? res.data : null;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Artikel Tidak Ditemukan' };
  return {
    title: article.title,
    description: article.excerpt ?? article.title,
    openGraph: { images: article.cover_image_url ? [{ url: article.cover_image_url }] : [] },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="container max-w-3xl py-10 sm:py-14">
      {article.category && <Badge variant="secondary">{article.category}</Badge>}
      <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{article.title}</h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {article.published_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {formatDateID(article.published_at)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {estimateReadingTime(article.content)} menit baca
        </span>
      </div>

      {article.cover_image_url && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={article.cover_image_url} alt={article.title} fill quality={90} className="object-cover" priority />
        </div>
      )}

      {/* Konten artikel — disimpan sebagai plain text/markdown sederhana di DB.
          Untuk rich-text penuh, integrasikan renderer MDX/markdown di sini. */}
      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-foreground dark:prose-invert">{article.content}</div>

      <BlogComments articleSlug={article.slug} />
    </article>
  );
}

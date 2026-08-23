import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { ArticleForm } from '@/components/admin/article-form';
import { updateArticleAction } from '@/lib/actions/blog.actions';
import type { Article } from '@/types/database.types';

export const metadata: Metadata = { title: 'Edit Artikel — Admin' };

interface EditArticlePageProps {
  // Param dipertahankan `id` tapi isinya SLUG — samakan dengan route model
  // binding {article:slug} di Laravel.
  params: { id: string };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const token = getServerToken();
  if (!token) notFound();

  let article: Article;
  try {
    const res = await apiFetch<{ data: Article }>(`/articles/${params.id}`, { token });
    article = res.data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const updateActionWithId = updateArticleAction.bind(null, article.slug);

  return (
    <div>
      <Link href="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar artikel
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Edit Artikel</h1>
      <p className="mt-1 text-sm text-muted-foreground">{article.title}</p>

      <div className="mt-6 max-w-2xl">
        <ArticleForm action={updateActionWithId} article={article} submitLabel="Simpan Perubahan" />
      </div>
    </div>
  );
}

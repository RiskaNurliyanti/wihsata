import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { ArticleForm } from '@/components/admin/article-form';
import { updateArticleAction } from '@/lib/actions/blog.actions';
import type { Article } from '@/types/database.types';

export const metadata: Metadata = { title: 'Edit Artikel Saya' };

interface EditMyArticlePageProps {
  // Param dipertahankan `id` tapi isinya SLUG — samakan dengan route model
  // binding {article:slug} di Laravel.
  params: { id: string };
}

export default async function EditMyArticlePage({ params }: EditMyArticlePageProps) {
  const token = getServerToken();
  if (!token) redirect('/auth/login?redirect=/blog/mine');

  let article: Article;
  try {
    // Otorisasi (pemilik atau admin) sudah dijamin ArticlePolicy di Laravel
    // untuk view MAUPUN update — tidak perlu dicek manual lagi di frontend.
    const res = await apiFetch<{ data: Article }>(`/articles/${params.id}`, { token });
    article = res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    if (error instanceof ApiError && error.status === 403) redirect('/blog/mine');
    throw error;
  }

  const updateActionWithId = updateArticleAction.bind(null, article.slug);

  return (
    <div className="container max-w-2xl py-10 sm:py-14">
      <Link href="/blog/mine" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel Saya
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground">Edit Artikel</h1>
      <p className="mt-2 text-muted-foreground">{article.title}</p>

      <div className="mt-6">
        <ArticleForm action={updateActionWithId} article={article} submitLabel="Simpan Perubahan" redirectTo="/blog/mine" />
      </div>
    </div>
  );
}

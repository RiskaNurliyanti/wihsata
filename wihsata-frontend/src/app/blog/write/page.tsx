import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerToken } from '@/lib/api/session';
import { ArticleForm } from '@/components/admin/article-form';
import { createArticleAction } from '@/lib/actions/blog.actions';

export const metadata: Metadata = { title: 'Tulis Artikel' };

export default async function WriteArticlePage() {
  const token = getServerToken();
  if (!token) redirect('/auth/login?redirect=/blog/write');

  return (
    <div className="container max-w-2xl py-10 sm:py-14">
      <Link href="/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground">Tulis Artikel Baru</h1>
      <p className="mt-2 text-muted-foreground">Bagikan tips, cerita, atau panduan perjalananmu ke komunitas Wihsata.</p>

      <div className="mt-6">
        <ArticleForm action={createArticleAction} submitLabel="Publikasikan" redirectTo="/blog/mine" />
      </div>
    </div>
  );
}

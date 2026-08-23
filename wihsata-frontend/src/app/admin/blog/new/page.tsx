import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArticleForm } from '@/components/admin/article-form';
import { createArticleAction } from '@/lib/actions/blog.actions';

export const metadata: Metadata = { title: 'Tulis Artikel — Admin' };

export default function NewArticlePage() {
  return (
    <div>
      <Link href="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar artikel
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Tulis Artikel Baru</h1>
      <p className="mt-1 text-sm text-muted-foreground">Buat konten blog untuk pembaca Wihsata.</p>

      <div className="mt-6 max-w-2xl">
        <ArticleForm action={createArticleAction} submitLabel="Publikasikan" />
      </div>
    </div>
  );
}

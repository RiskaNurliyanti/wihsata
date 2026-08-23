import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Eye } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { DeleteArticleButton } from '@/components/admin/delete-article-button';
import { formatDateID } from '@/lib/utils';
import { PenLine } from 'lucide-react';
import type { Article } from '@/types/database.types';

export const metadata: Metadata = { title: 'Artikel Saya' };

export default async function MyArticlesPage() {
  const token = getServerToken();
  if (!token) redirect('/auth/login?redirect=/blog/mine');

  const res = await apiFetch<{ data: Article[] }>('/articles-mine', { token });
  const list = res.data;

  return (
    <div className="container py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Artikel Saya</h1>
          <p className="mt-2 text-muted-foreground">Kelola artikel yang sudah kamu tulis, termasuk draft yang belum dipublikasikan.</p>
        </div>
        <Link href="/blog/write">
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tulis Artikel Baru
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={PenLine}
          title="Belum ada artikel"
          description="Mulai tulis artikel pertamamu dan bagikan ke komunitas Wihsata."
          action={
            <Link href="/blog/write">
              <Button variant="gradient">Tulis Sekarang</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="relative aspect-[16/9] w-full bg-muted">
                {article.cover_image_url && <Image src={article.cover_image_url} alt={article.title} fill className="object-cover" />}
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {article.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                  {article.category && <Badge variant="outline">{article.category}</Badge>}
                </div>
                <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold text-foreground">{article.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateID(article.created_at)}</p>

                <div className="mt-3 flex gap-2">
                  {article.is_published && (
                    <Link href={`/blog/${article.slug}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        <Eye className="h-3.5 w-3.5" /> Baca
                      </Button>
                    </Link>
                  )}
                  <Link href={`/blog/mine/${article.slug}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <DeleteArticleButton articleId={article.slug} articleTitle={article.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

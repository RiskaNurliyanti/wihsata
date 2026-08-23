'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { AdminSearchBox } from '@/components/admin/admin-search-box';
import { DeleteArticleButton } from '@/components/admin/delete-article-button';
import { formatDateID } from '@/lib/utils';
import type { Article } from '@/types/database.types';

export function AdminArticlesTable({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.trim().toLowerCase();
    return articles.filter((a) => a.title.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q));
  }, [articles, query]);

  return (
    <>
      <AdminSearchBox value={query} onChange={setQuery} placeholder="Cari judul artikel atau kategori..." className="mt-4" />

      <Card className="mt-4">
        <CardContent className="p-0">
          <ResponsiveTable>
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium text-muted-foreground">Judul</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Kategori</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Dibuat</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      Tidak ada artikel yang cocok dengan &quot;{query}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((article) => (
                    <tr key={article.id} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium text-foreground">{article.title}</td>
                      <td className="p-4 text-muted-foreground">{article.category ?? '-'}</td>
                      <td className="p-4">
                        {article.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDateID(article.created_at)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/blog/${article.slug}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" /> Edit
                            </Button>
                          </Link>
                          <DeleteArticleButton articleId={article.slug} articleTitle={article.title} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </>
  );
}

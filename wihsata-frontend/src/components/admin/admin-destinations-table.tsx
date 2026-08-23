'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { AdminSearchBox } from '@/components/admin/admin-search-box';
import { DeleteDestinationButton } from '@/components/admin/delete-destination-button';
import type { Destination } from '@/types/database.types';

export function AdminDestinationsTable({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return destinations;
    const q = query.trim().toLowerCase();
    return destinations.filter(
      (d) => d.name.toLowerCase().includes(q) || d.category?.name?.toLowerCase().includes(q)
    );
  }, [destinations, query]);

  return (
    <>
      <AdminSearchBox
        value={query}
        onChange={setQuery}
        placeholder="Cari nama destinasi atau kategori..."
        className="mt-4"
      />

      <Card className="mt-4">
        <CardContent className="p-0">
          <ResponsiveTable>
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium text-muted-foreground">Destinasi</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Kategori</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Rating</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Featured</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      Tidak ada destinasi yang cocok dengan &quot;{query}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((dest) => (
                    <tr key={dest.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {dest.cover_image_url && (
                              <Image src={dest.cover_image_url} alt={dest.name} fill className="object-cover" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{dest.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{dest.category?.name ?? '-'}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> {dest.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        {dest.is_featured ? <Badge variant="success">Ya</Badge> : <Badge variant="secondary">Tidak</Badge>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/destinations/${dest.slug}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" /> Edit
                            </Button>
                          </Link>
                          <DeleteDestinationButton destinationId={dest.slug} destinationName={dest.name} />
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

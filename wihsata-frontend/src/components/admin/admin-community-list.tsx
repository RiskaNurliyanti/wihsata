'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminSearchBox } from '@/components/admin/admin-search-box';
import { AdminDeletePostButton } from '@/components/admin/admin-delete-post-button';
import { formatDateID } from '@/lib/utils';
import type { CommunityPost } from '@/types/database.types';

export function AdminCommunityList({ posts }: { posts: CommunityPost[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) => p.caption?.toLowerCase().includes(q) || p.user?.full_name?.toLowerCase().includes(q)
    );
  }, [posts, query]);

  return (
    <>
      <AdminSearchBox value={query} onChange={setQuery} placeholder="Cari caption atau nama pengguna..." className="mt-4" />

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Tidak ada postingan yang cocok dengan &quot;{query}&quot;.
          </p>
        ) : (
          filtered.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={post.user?.avatar_url ?? undefined} />
                    <AvatarFallback>{post.user?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.user?.full_name ?? 'Pengguna'}</p>
                    <p className="text-xs text-muted-foreground">{formatDateID(post.created_at)}</p>
                    {post.caption && <p className="mt-1.5 text-sm text-foreground">{post.caption}</p>}
                    {post.image_urls?.[0] && (
                      <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-lg">
                        <Image src={post.image_urls[0]} alt="Post" fill quality={90} className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <AdminDeletePostButton postId={post.id} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, MapPin, ImagePlus, MoreHorizontal, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/shared/empty-state';
import { CreatePostForm } from '@/components/shared/create-post-form';
import { PostComments } from '@/components/shared/post-comments';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';
import { updatePostAction, deletePostAction } from '@/lib/actions/community.actions';
import { formatDateID } from '@/lib/utils';
import type { CommunityPost } from '@/types/database.types';

interface CommunityFeedProps {
  initialPosts: CommunityPost[];
}

export function CommunityFeed({ initialPosts }: CommunityFeedProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  // Search caption postingan — client-side, konsisten dengan state feed yang dikelola lokal.
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    if (!getClientToken()) return;

    (async () => {
      try {
        const res = await apiFetch<{ data: { user: { id: string; role: string } } }>('/auth/me');
        setCurrentUserId(res.data.user.id);
        setIsAdmin(res.data.user.role === 'admin' || res.data.user.role === 'super_admin');
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('CommunityFeed: gagal memuat sesi pengguna:', error);
        }
      }
    })();
  }, []);

  async function handleLike(postId: string) {
    if (!getClientToken()) {
      router.push('/auth/login');
      return;
    }

    const alreadyLiked = likedIds.has(postId);

    try {
      const res = await apiFetch<{ data: { liked: boolean; like_count: number } }>(`/community/posts/${postId}/like`, {
        method: 'POST',
      });

      setLikedIds((prev) => {
        const next = new Set(prev);
        if (res.data.liked) next.add(postId);
        else next.delete(postId);
        return next;
      });
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, like_count: res.data.like_count } : p)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push('/auth/login');
        return;
      }
      // best-effort UI fallback kalau gagal, jangan ubah state
      void alreadyLiked;
    }
  }

  function toggleComments(postId: string) {
    setOpenComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }

  function startEdit(post: CommunityPost) {
    setEditingId(post.id);
    setEditValue(post.caption ?? '');
  }

  function saveEdit(postId: string) {
    startTransition(async () => {
      const result = await updatePostAction(postId, editValue);
      if (!result.error) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, caption: editValue } : p)));
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function handleDeletePost(postId: string) {
    const confirmed = window.confirm('Hapus postingan ini? Tindakan tidak dapat dibatalkan.');
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (!result.error) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        router.refresh();
      }
    });
  }

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.trim().toLowerCase();
    return posts.filter(
      (p) => p.caption?.toLowerCase().includes(q) || p.destination?.name.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  return (
    <div>
      {currentUserId && <CreatePostForm />}

      {posts.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari postingan atau destinasi..."
            className="pl-9"
          />
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={ImagePlus}
          title={searchQuery ? 'Postingan tidak ditemukan' : 'Belum ada postingan'}
          description={
            searchQuery
              ? `Tidak ada postingan yang cocok dengan "${searchQuery}".`
              : 'Jadilah yang pertama membagikan momen perjalananmu ke komunitas.'
          }
        />
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const canManage = currentUserId === post.user_id || isAdmin;
            return (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.user?.avatar_url ?? undefined} />
                        <AvatarFallback>{post.user?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          {post.user?.full_name ?? 'Traveler'}
                          {isAdmin && currentUserId !== post.user_id && (
                            <Badge variant="secondary" className="text-[10px]">
                              Moderasi
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDateID(post.created_at)}</p>
                      </div>
                    </div>

                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-full p-1.5 hover:bg-muted" aria-label="Menu postingan">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(post)}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {editingId === post.id ? (
                    <div className="mt-3 space-y-2">
                      <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={3} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(post.id)} disabled={isPending}>
                          <Check className="h-3.5 w-3.5" /> Simpan
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-3.5 w-3.5" /> Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    post.caption && <p className="mt-3 text-sm text-foreground">{post.caption}</p>
                  )}

                  {post.destination && (
                    <Link
                      href={`/explore/${post.destination.slug}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
                    >
                      <MapPin className="h-3 w-3" />
                      {post.destination.name}
                    </Link>
                  )}

                  {post.image_urls?.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 overflow-hidden rounded-lg">
                      {post.image_urls.slice(0, 4).map((url, i) => (
                        <div key={i} className="relative aspect-square">
                          <Image src={url} alt={`Post ${i + 1}`} fill quality={90} className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-600"
                    >
                      <Heart className={`h-4 w-4 ${likedIds.has(post.id) ? 'fill-red-600 text-red-600' : ''}`} />
                      {post.like_count}
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Komentar
                    </button>
                  </div>

                  {openComments.has(post.id) && (
                    <PostComments postId={post.id} currentUserId={currentUserId} isAdmin={isAdmin} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

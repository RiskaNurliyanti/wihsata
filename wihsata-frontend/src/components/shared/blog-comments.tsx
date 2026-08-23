'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Trash2, Pencil, Check, X, Loader2, MessageSquareText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';
import { createArticleCommentAction, updateArticleCommentAction, deleteArticleCommentAction } from '@/lib/actions/blog.actions';
import { formatDateID } from '@/lib/utils';
import type { Article, ArticleComment } from '@/types/database.types';

interface BlogCommentsProps {
  /** SLUG artikel — endpoint komentar Laravel pakai route model binding by slug. */
  articleSlug: string;
}

export function BlogComments({ articleSlug }: BlogCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPending, startTransition] = useTransition();
  // State mode edit inline per komentar.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Komentar artikel tidak punya endpoint list terpisah — ikut dimuat
  // bareng detail artikel (`Article::load('comments.user')` di Laravel).
  async function loadComments() {
    try {
      const res = await apiFetch<{ data: Article & { comments: ArticleComment[] } }>(`/articles/${articleSlug}`);
      setComments(res.data.comments ?? []);
    } catch {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (getClientToken()) {
        try {
          const res = await apiFetch<{ data: { user: { id: string; role: string } } }>('/auth/me');
          setCurrentUserId(res.data.user.id);
          setIsAdmin(res.data.user.role === 'admin' || res.data.user.role === 'super_admin');
        } catch (error) {
          if (!(error instanceof ApiError && error.status === 401)) {
            console.error('BlogComments: gagal memuat sesi pengguna:', error);
          }
        }
      }
      await loadComments();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    startTransition(async () => {
      const result = await createArticleCommentAction(articleSlug, newComment);
      if (!result.error) {
        setNewComment('');
        await loadComments();
        router.refresh();
      }
    });
  }

  function startEdit(comment: ArticleComment) {
    setEditingId(comment.id);
    setEditValue(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue('');
  }

  function handleUpdate(commentId: string) {
    if (!editValue.trim()) return;

    startTransition(async () => {
      const result = await updateArticleCommentAction(commentId, editValue);
      if (!result.error) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, content: editValue.trim() } : c))
        );
        setEditingId(null);
        setEditValue('');
        router.refresh();
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      const result = await deleteArticleCommentAction(commentId);
      if (!result.error) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h3 className="font-display text-lg font-semibold text-foreground">Diskusi ({comments.length})</h3>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Bagikan pendapatmu tentang artikel ini..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Kirim
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          <a href="/auth/login" className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Masuk
          </a>{' '}
          untuk ikut berdiskusi.
        </p>
      )}

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Memuat diskusi...</p>
      ) : comments.length === 0 ? (
        <EmptyState className="mt-6" icon={MessageSquareText} title="Belum ada diskusi" description="Jadilah yang pertama berkomentar." />
      ) : (
        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar_url ?? undefined} />
                <AvatarFallback>{comment.user?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{comment.user?.full_name ?? 'Pengguna'}</p>
                  <span className="text-xs text-muted-foreground">{formatDateID(comment.created_at)}</span>
                </div>
                {editingId === comment.id ? (
                  <div className="mt-1.5 space-y-2">
                    <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={2} autoFocus />
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={cancelEdit} disabled={isPending}>
                        <X className="h-3.5 w-3.5" /> Batal
                      </Button>
                      <Button type="button" size="sm" onClick={() => handleUpdate(comment.id)} disabled={isPending}>
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Simpan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm text-muted-foreground">{comment.content}</p>
                )}
              </div>
              {editingId !== comment.id && currentUserId === comment.user_id && (
                <button
                  onClick={() => startEdit(comment)}
                  disabled={isPending}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Edit komentar"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {editingId !== comment.id && (currentUserId === comment.user_id || isAdmin) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Hapus komentar"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

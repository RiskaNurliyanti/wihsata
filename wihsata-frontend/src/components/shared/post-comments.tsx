'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api/client';
import { createCommentAction, updateCommentAction, deleteCommentAction } from '@/lib/actions/community.actions';
import { formatDateID } from '@/lib/utils';
import type { PostComment } from '@/types/database.types';

interface PostCommentsProps {
  postId: string;
  currentUserId?: string;
  isAdmin: boolean;
}

async function fetchComments(postId: string) {
  const res = await apiFetch<{ data: PostComment[] }>(`/community/posts/${postId}/comments`);
  return res.data;
}

export function PostComments({ postId, currentUserId, isAdmin }: PostCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    let mounted = true;

    fetchComments(postId)
      .then((data) => {
        if (mounted) setComments(data);
      })
      .catch(() => {
        if (mounted) setComments([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId]);

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    startTransition(async () => {
      const result = await createCommentAction(postId, newComment);
      if (!result.error) {
        setNewComment('');
        router.refresh();
        // refresh lokal juga agar komentar baru langsung terlihat tanpa reload penuh
        try {
          setComments(await fetchComments(postId));
        } catch {
          // diamkan — router.refresh() di atas tetap memuat ulang data server
        }
      }
    });
  }

  function startEdit(comment: PostComment) {
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
      const result = await updateCommentAction(commentId, editValue);
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
      const result = await deleteCommentAction(commentId);
      if (!result.error) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-3 space-y-3 border-t border-border pt-3">
      {isLoading ? (
        <p className="text-xs text-muted-foreground">Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={comment.user?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{comment.user?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 rounded-lg bg-muted px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">{comment.user?.full_name ?? 'Pengguna'}</p>
                <span className="text-[10px] text-muted-foreground">{formatDateID(comment.created_at)}</span>
              </div>
              {editingId === comment.id ? (
                <div className="mt-1 space-y-1.5">
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={2}
                    className="text-sm"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5">
                    <Button type="button" size="sm" variant="ghost" onClick={cancelEdit} disabled={isPending}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" onClick={() => handleUpdate(comment.id)} disabled={isPending}>
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-0.5 text-sm text-foreground">{comment.content}</p>
              )}
            </div>
            {editingId !== comment.id && currentUserId === comment.user_id && (
              <button
                onClick={() => startEdit(comment)}
                disabled={isPending}
                className="mt-1.5 shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Edit komentar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {editingId !== comment.id && (currentUserId === comment.user_id || isAdmin) && (
              <button
                onClick={() => handleDelete(comment.id)}
                disabled={isPending}
                className="mt-1.5 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Hapus komentar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))
      )}

      {currentUserId && (
        <form onSubmit={handleAddComment} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            className="h-9 text-sm"
          />
          <Button type="submit" size="icon" variant="outline" className="h-9 w-9 shrink-0" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      )}
    </div>
  );
}

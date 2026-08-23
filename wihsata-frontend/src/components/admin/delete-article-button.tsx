'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteArticleAction } from '@/lib/actions/blog.actions';

export function DeleteArticleButton({ articleId, articleTitle }: { articleId: string; articleTitle: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus artikel "${articleTitle}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    startTransition(async () => {
      await deleteArticleAction(articleId);
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="text-destructive hover:bg-red-50 dark:hover:bg-red-950/30">
      <Trash2 className="h-4 w-4" />
      {isPending ? 'Menghapus...' : 'Hapus'}
    </Button>
  );
}

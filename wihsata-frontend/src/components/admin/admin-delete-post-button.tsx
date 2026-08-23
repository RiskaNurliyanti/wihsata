'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deletePostAction } from '@/lib/actions/community.actions';

export function AdminDeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm('Hapus postingan ini dari komunitas?');
    if (!confirmed) return;

    startTransition(async () => {
      await deletePostAction(postId);
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="shrink-0 text-destructive hover:bg-red-50 dark:hover:bg-red-950/30">
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Hapus
    </Button>
  );
}

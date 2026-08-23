'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteDestinationAction } from '@/lib/actions/admin.actions';

interface DeleteDestinationButtonProps {
  destinationId: string;
  destinationName: string;
}

export function DeleteDestinationButton({ destinationId, destinationName }: DeleteDestinationButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus destinasi "${destinationName}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    startTransition(async () => {
      await deleteDestinationAction(destinationId);
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="text-destructive hover:bg-red-50">
      <Trash2 className="h-4 w-4" />
      {isPending ? 'Menghapus...' : 'Hapus'}
    </Button>
  );
}

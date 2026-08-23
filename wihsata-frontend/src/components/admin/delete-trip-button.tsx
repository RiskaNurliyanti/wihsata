'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteTripAction } from '@/lib/actions/admin.actions';

interface DeleteTripButtonProps {
  tripId: string;
  tripTitle: string;
}

export function DeleteTripButton({ tripId, tripTitle }: DeleteTripButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(`Hapus trip "${tripTitle}"? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;

    startTransition(async () => {
      await deleteTripAction(tripId);
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending} className="text-destructive hover:bg-red-50 dark:hover:bg-red-950/40">
      <Trash2 className="h-4 w-4" />
      {isPending ? 'Menghapus...' : 'Hapus'}
    </Button>
  );
}

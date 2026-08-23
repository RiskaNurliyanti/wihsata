'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';

interface SaveTripButtonProps {
  /** SLUG destinasi — endpoint favorit Laravel pakai route model binding by slug. */
  destinationSlug: string;
  /** UUID destinasi — dipakai untuk cocokkan status favorit dari GET /favorites. */
  destinationId: string;
}

/** Tombol simpan/hapus destinasi ke favorit pengguna (tabel `favorites`). */
export function SaveTripButton({ destinationSlug, destinationId }: SaveTripButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!getClientToken()) return;

    (async () => {
      try {
        const res = await apiFetch<{ data: { id: string }[] }>('/favorites');
        setIsSaved(res.data.some((d) => d.id === destinationId));
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('SaveTripButton: gagal cek status favorit:', error);
        }
      }
    })();
  }, [destinationId]);

  function toggleSave() {
    startTransition(async () => {
      if (!getClientToken()) {
        router.push(`/auth/login?redirect=/explore`);
        return;
      }

      try {
        const res = await apiFetch<{ data: { saved: boolean } }>(`/destinations/${destinationSlug}/favorite`, {
          method: 'POST',
        });
        setIsSaved(res.data.saved);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          router.push(`/auth/login?redirect=/explore`);
        }
      }
    });
  }

  return (
    <Button variant={isSaved ? 'default' : 'outline'} size="sm" onClick={toggleSave} disabled={isPending}>
      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved ? 'Tersimpan' : 'Simpan'}
    </Button>
  );
}

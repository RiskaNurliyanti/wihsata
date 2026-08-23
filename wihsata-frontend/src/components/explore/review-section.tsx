'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, MessageSquareText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/shared/empty-state';
import { apiFetch, ApiError, getClientToken } from '@/lib/api/client';
import { reviewSchema, type ReviewFormValues } from '@/lib/validations/auth.schema';
import { formatDateID } from '@/lib/utils';
import type { Review } from '@/types/database.types';

interface ReviewSectionProps {
  /** SLUG destinasi — endpoint review Laravel pakai route model binding by slug. */
  destinationSlug: string;
  reviews: Review[];
}

export function ReviewSection({ destinationSlug, reviews }: ReviewSectionProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  function onSubmit(values: ReviewFormValues) {
    setErrorMsg(null);

    if (!getClientToken()) {
      setErrorMsg('Silakan login terlebih dahulu untuk menulis ulasan.');
      return;
    }

    startTransition(async () => {
      try {
        await apiFetch(`/destinations/${destinationSlug}/reviews`, {
          method: 'PUT',
          json: { rating, comment: values.comment },
        });
      } catch (error) {
        setErrorMsg(error instanceof ApiError ? error.firstFieldError() ?? error.message : 'Gagal mengirim ulasan.');
        return;
      }

      reset();
      router.refresh();
    });
  }

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-foreground">Ulasan Pengunjung ({reviews.length})</h3>

      {/* Form ulasan */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 rounded-xl border border-border p-4">
        <p className="text-sm font-medium text-foreground">Beri rating</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              aria-label={`Beri rating ${i + 1}`}
            >
              <Star className={`h-6 w-6 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} />
            </button>
          ))}
        </div>

        <Textarea
          {...register('comment')}
          placeholder="Bagikan pengalamanmu di destinasi ini..."
          className="mt-3"
          rows={3}
        />
        {errors.comment && <p className="mt-1 text-xs text-destructive">{errors.comment.message}</p>}
        {errorMsg && <p className="mt-1 text-xs text-destructive">{errorMsg}</p>}

        <Button type="submit" size="sm" className="mt-3" disabled={isPending}>
          {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
        </Button>
      </form>

      {/* List ulasan */}
      {reviews.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={MessageSquareText}
          title="Belum ada ulasan"
          description="Jadilah yang pertama memberi ulasan untuk destinasi ini."
        />
      ) : (
        <div className="mt-6 space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <Avatar>
                <AvatarImage src={review.user?.avatar_url ?? undefined} />
                <AvatarFallback>{review.user?.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{review.user?.full_name ?? 'Pengguna'}</p>
                  <span className="text-xs text-muted-foreground">{formatDateID(review.created_at)}</span>
                </div>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                {review.comment && <p className="mt-1.5 text-sm text-muted-foreground">{review.comment}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['destination_id', 'user_id', 'rating', 'comment', 'photo_urls'];

    protected function casts(): array
    {
        return ['photo_urls' => 'array'];
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        // Pengganti trigger Postgres `recompute_destination_rating` di Supabase —
        // di Laravel logic ini ditulis di sini supaya lebih mudah dibaca/di-debug
        // dibanding trigger SQL yang "tersembunyi" di database.
        static::created(fn (Review $review) => static::recomputeRating($review->destination_id));
        static::updated(fn (Review $review) => static::recomputeRating($review->destination_id));
        static::deleted(fn (Review $review) => static::recomputeRating($review->destination_id));
    }

    protected static function recomputeRating(string $destinationId): void
    {
        $stats = static::query()
            ->where('destination_id', $destinationId)
            ->selectRaw('ROUND(AVG(rating)::numeric, 1) as avg_rating, COUNT(*) as total')
            ->first();

        Destination::whereKey($destinationId)->update([
            'rating' => $stats->avg_rating ?? 0,
            'review_count' => $stats->total ?? 0,
        ]);
    }
}

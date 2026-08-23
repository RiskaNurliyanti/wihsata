<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'tier', 'status', 'current_period_end',
        'ai_generation_count_today', 'ai_generation_reset_at', 'trips_saved_count',
    ];

    protected function casts(): array
    {
        return [
            'current_period_end' => 'datetime',
            'ai_generation_reset_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

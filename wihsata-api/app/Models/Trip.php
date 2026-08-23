<?php

namespace App\Models;

use App\Enums\TripStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trip extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'user_id', 'title', 'start_date', 'end_date', 'status',
        'budget_estimate', 'preferences', 'itinerary', 'cover_image_url', 'is_public',
    ];

    protected function casts(): array
    {
        return [
            // Format eksplisit Y-m-d supaya kompatibel dengan <input type="date"> di frontend.
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'status' => TripStatus::class,
            'budget_estimate' => 'float',
            'preferences' => 'array',
            'itinerary' => 'array',
            'is_public' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

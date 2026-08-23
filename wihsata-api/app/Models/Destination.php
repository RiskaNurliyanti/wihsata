<?php

namespace App\Models;

use App\Enums\DestinationAccessType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Destination extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'slug', 'name', 'description', 'category_id', 'district_id',
        'latitude', 'longitude', 'address', 'price_range',
        'opening_hours', 'facilities', 'gallery_urls',
        'cover_image_url', 'google_maps_url', 'rating', 'review_count',
        'safety_score', 'safety_source', 'is_featured', 'access_type', 'departure_port',
        'crossing_duration_minutes', 'crossing_cost_estimate', 'crossing_notes',
        'road_time_multiplier', 'road_condition_note',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'opening_hours' => 'array',
            'facilities' => 'array',
            'gallery_urls' => 'array',
            'rating' => 'float',
            'safety_score' => 'float',
            'is_featured' => 'boolean',
            'access_type' => DestinationAccessType::class,
            'crossing_cost_estimate' => 'float',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** Route model binding pakai slug (mis. /api/destinations/pulau-kaniungan), bukan UUID. */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Query destinasi dalam radius tertentu dari sebuah titik, diurutkan dari
     * yang paling dekat — versi PHP dari RPC `nearby_destinations` di Supabase.
     * Dipakai oleh fitur Nearby dan AI Planner clustering.
     */
    public function scopeNearby(Builder $query, float $lat, float $lng, float $radiusKm = 25): Builder
    {
        $point = 'ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography';

        return $query
            ->select('destinations.*')
            ->selectRaw("ROUND((ST_Distance(geo_location, {$point}) / 1000)::numeric, 2) as distance_km", [$lng, $lat])
            ->whereRaw("ST_DWithin(geo_location, {$point}, ?)", [$lng, $lat, $radiusKm * 1000])
            ->orderBy('distance_km');
    }
}

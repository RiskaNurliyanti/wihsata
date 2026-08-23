<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{
    /** Ubah nama daerah jadi koordinat via Nominatim. Return null kalau gagal (best-effort). */
    public function geocode(string $query): ?array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => config('app.name').'/1.0',
            ])->get(config('services.nominatim.url', 'https://nominatim.openstreetmap.org').'/search', [
                'q' => $query,
                'format' => 'json',
                'limit' => 1,
                'countrycodes' => 'id',
            ]);

            if (! $response->successful()) {
                Log::warning('[AiPlanner] Geocoding gagal', ['status' => $response->status()]);

                return null;
            }

            $results = $response->json();

            if (empty($results)) {
                return null;
            }

            return [
                'latitude' => (float) $results[0]['lat'],
                'longitude' => (float) $results[0]['lon'],
            ];
        } catch (\Throwable $e) {
            Log::error('[AiPlanner] Geocoding exception', ['message' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Reverse geocoding: koordinat -> alamat, via Nominatim. Padanan Laravel
     * untuk proxy Node lama (src/app/api/geocode/route.ts). Return null
     * kalau gagal (best-effort, dipanggil dari controller publik).
     */
    public function reverseGeocode(float $lat, float $lon): ?array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => config('app.name').'/1.0',
            ])->get(config('services.nominatim.url', 'https://nominatim.openstreetmap.org').'/reverse', [
                'lat' => $lat,
                'lon' => $lon,
                'format' => 'json',
                'addressdetails' => 1,
            ]);

            if (! $response->successful()) {
                Log::warning('[Geocode] Reverse geocoding gagal', ['status' => $response->status()]);

                return null;
            }

            return $response->json();
        } catch (\Throwable $e) {
            Log::error('[Geocode] Reverse geocoding exception', ['message' => $e->getMessage()]);

            return null;
        }
    }
}

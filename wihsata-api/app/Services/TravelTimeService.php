<?php

namespace App\Services;

use App\Models\Destination;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Estimasi jarak & waktu tempuh REALISTIS untuk AI Planner.
 *
 * MASALAH YANG DISELESAIKAN: 100km bisa ditempuh 2 jam atau 4 jam tergantung
 * kondisi jalan — rumus "jarak ÷ kecepatan rata-rata" TIDAK bisa membedakan
 * itu. Solusinya (didiskusikan & disepakati sebagai Opsi C):
 *
 * 1. LAPISAN UTAMA — OSRM (routing jaringan jalan sungguhan, bukan garis
 *    lurus): otomatis mempertimbangkan kelas & bentuk jalan sesuai data
 *    OpenStreetMap, jadi jauh lebih akurat dari haversine+asumsi kecepatan.
 * 2. LAPISAN OVERRIDE — kalau destinasi tujuan sudah diisi admin
 *    `road_time_multiplier` (mis. jalan rusak yang belum tertangkap baik di
 *    data OSM), angka OSRM dikali faktor itu. Pola sama seperti
 *    `crossing_duration_minutes` untuk penyeberangan kapal.
 * 3. FALLBACK — kalau OSRM tidak bisa dihubungi (network/timeout), turun ke
 *    estimasi haversine + kecepatan rata-rata per moda transportasi
 *    (approksimasi kasar, cuma dipakai saat OSRM benar-benar gagal).
 *
 * Moda transportasi (`TransportMode`) mempengaruhi hasil:
 * - private_vehicle (kendaraan pribadi): durasi OSRM apa adanya.
 * - rental_vehicle (kendaraan sewa): +10% buffer (belum hafal medan/rute).
 * - public_transport (transportasi umum): ×1.6 (transit, ganti kendaraan,
 *   waktu tunggu — heuristik karena OSRM tidak me-routing transportasi
 *   umum; didokumentasikan sebagai keterbatasan, bukan angka presisi).
 */
class TravelTimeService
{
    private const FALLBACK_SPEED_KMH = [
        'private_vehicle' => 40,
        'rental_vehicle' => 35,
        'public_transport' => 25,
    ];

    private const MODE_DURATION_FACTOR = [
        'private_vehicle' => 1.0,
        'rental_vehicle' => 1.1,
        'public_transport' => 1.6,
    ];

    /**
     * @return array{distance_km: float, travel_time_minutes: int, source: string}
     */
    public function estimate(
        float $fromLat,
        float $fromLng,
        float $toLat,
        float $toLng,
        string $transportMode,
        ?Destination $toDestination = null,
    ): array {
        $osrm = $this->queryOsrm($fromLat, $fromLng, $toLat, $toLng);

        $modeFactor = self::MODE_DURATION_FACTOR[$transportMode] ?? 1.0;

        if ($osrm !== null) {
            $distanceKm = $osrm['distance_km'];
            $minutes = $osrm['duration_minutes'] * $modeFactor;
            $source = 'osrm';
        } else {
            $distanceKm = $this->haversineKm($fromLat, $fromLng, $toLat, $toLng);
            $speedKmh = self::FALLBACK_SPEED_KMH[$transportMode] ?? 35;
            $minutes = ($distanceKm / max($speedKmh, 1)) * 60;
            $source = 'fallback_haversine';
        }

        // Lapisan override manual (kondisi jalan buruk yang diisi admin).
        if ($toDestination?->road_time_multiplier) {
            $minutes *= (float) $toDestination->road_time_multiplier;
            $source .= '+manual_override';
        }

        return [
            'distance_km' => round($distanceKm, 1),
            'travel_time_minutes' => (int) round($minutes),
            'source' => $source,
        ];
    }

    /**
     * @return array{distance_km: float, duration_minutes: float}|null null kalau OSRM gagal/tidak tersedia.
     */
    private function queryOsrm(float $fromLat, float $fromLng, float $toLat, float $toLng): ?array
    {
        try {
            $baseUrl = config('services.osrm.url', 'https://router.project-osrm.org');
            $coords = "{$fromLng},{$fromLat};{$toLng},{$toLat}";

            $response = Http::timeout(8)->get("{$baseUrl}/route/v1/driving/{$coords}", [
                'overview' => 'false',
            ]);

            if (! $response->successful()) {
                return null;
            }

            $route = $response->json('routes.0');

            if (! $route) {
                return null;
            }

            return [
                'distance_km' => $route['distance'] / 1000,
                'duration_minutes' => $route['duration'] / 60,
            ];
        } catch (\Throwable $e) {
            Log::warning('[TravelTimeService] OSRM gagal, pakai fallback haversine', ['message' => $e->getMessage()]);

            return null;
        }
    }

    private function haversineKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadiusKm = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return 2 * $earthRadiusKm * asin(sqrt($a));
    }
}

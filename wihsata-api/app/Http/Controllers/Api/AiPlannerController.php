<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Services\DestinationClusterService;
use App\Services\GeocodingService;
use App\Services\OpenRouterException;
use App\Services\OpenRouterService;
use App\Services\TravelTimeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiPlannerController extends Controller
{
    private const SEARCH_RADIUS_KM = 120;

    private const CLUSTER_RADIUS_KM = 70;

    /** Waktu tempuh riil (OSRM) maksimum untuk kandidat destinasi, dalam menit. */
    private const MAX_CANDIDATE_TRAVEL_MINUTES = 90;

    public function __construct(
        private readonly GeocodingService $geocoding,
        private readonly DestinationClusterService $cluster,
        private readonly OpenRouterService $openRouter,
        private readonly TravelTimeService $travelTime,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        // Generate AI bisa memakan waktu lama; batas eksekusi dinaikkan agar
        // tidak dihentikan sebelum request ke OpenRouter selesai.
        set_time_limit(300);

        $validated = $request->validate([
            'origin_location' => ['required', 'string', 'min:2', 'max:100'],
            'destination_area' => ['required', 'string', 'min:3', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'departure_time' => ['required', 'date_format:H:i'],
            'return_time' => ['required', 'date_format:H:i'],
            'travelers_count' => ['required', 'integer', 'min:1', 'max:30'],
            'budget_total' => ['required', 'numeric', 'min:50000'],
            'interests' => ['required', 'array', 'min:1'],
            'travel_pace' => ['required', 'in:santai,normal,padat'],
            'transport_mode' => ['required', 'in:private_vehicle,rental_vehicle,public_transport'],
            'notes' => ['nullable', 'string', 'max:500'],
        ], [
            'transport_mode.required' => 'Moda transportasi wajib dipilih.',
            'origin_location.required' => 'Kota/titik keberangkatan wajib diisi.',
            'departure_time.required' => 'Jam keberangkatan wajib diisi.',
            'return_time.required' => 'Jam kepulangan wajib diisi.',
        ]);

        $user = $request->user();
        $subscription = $user->subscription;
        $isAdmin = $user->isAdmin();

        $limits = ['demo' => 2, 'pro' => PHP_INT_MAX];
        $tier = $isAdmin ? 'pro' : ($subscription?->tier ?? 'demo');
        $limit = $limits[$tier] ?? 2;

        $today = now()->toDateString();
        $isNewDay = $subscription?->ai_generation_reset_at?->toDateString() !== $today;
        $currentCount = $isNewDay ? 0 : ($subscription?->ai_generation_count_today ?? 0);

        if (! $isAdmin && $currentCount >= $limit) {
            return response()->json([
                'message' => "Kuota AI Planner harian Anda ({$limit}x) sudah habis. Upgrade ke Pro untuk generate tanpa batas.",
                'code' => 'QUOTA_EXCEEDED',
            ], 429);
        }

        // ── Cari destinasi nyata + cluster terdekat (best-effort) ──────────
        $clusterData = [];
        $originCoords = null;

        try {
            if (! empty($validated['origin_location'])) {
                $originCoords = $this->geocoding->geocode("{$validated['origin_location']}, Indonesia");
            }

            $areaCoords = $this->geocoding->geocode("{$validated['destination_area']}, Indonesia");
            Log::info('[AiPlanner] Geocode', ['area' => $validated['destination_area'], 'coords' => $areaCoords]);

            if ($areaCoords) {
                $nearby = Destination::query()
                    ->nearby($areaCoords['latitude'], $areaCoords['longitude'], self::SEARCH_RADIUS_KM)
                    ->with('category:id,name')
                    ->limit(25)
                    ->get();

                Log::info('[AiPlanner] Kandidat ditemukan', ['count' => $nearby->count()]);

                if ($nearby->isNotEmpty()) {
                    // Jarak/waktu tempuh tiap kandidat dihitung dari AREA TUJUAN
                    // (bukan kota asal) — trip berpusat di sana untuk seluruh
                    // durasi, bukan cuma hari pertama.
                    $referenceLat = $areaCoords['latitude'];
                    $referenceLng = $areaCoords['longitude'];

                    $destinationsArray = $nearby->map(function ($d) use ($referenceLat, $referenceLng, $validated) {
                        $travel = $this->travelTime->estimate(
                            $referenceLat, $referenceLng,
                            $d->latitude, $d->longitude,
                            $validated['transport_mode'],
                            $d,
                        );

                        return [
                            'id' => $d->id,
                            'name' => $d->name,
                            'latitude' => $d->latitude,
                            'longitude' => $d->longitude,
                            'price_range' => $d->price_range,
                            'access_type' => $d->access_type?->value ?? 'darat',
                            'departure_port' => $d->departure_port,
                            'crossing_duration_minutes' => $d->crossing_duration_minutes,
                            'crossing_cost_estimate' => $d->crossing_cost_estimate,
                            'crossing_notes' => $d->crossing_notes,
                            'cover_image_url' => $d->cover_image_url,
                            'category_name' => $d->category?->name,
                            'distance_km' => $travel['distance_km'],
                            'travel_time_minutes' => $travel['travel_time_minutes'],
                        ];
                    })->all();

                    $clusterData = $this->cluster->closestCluster(
                        $destinationsArray,
                        $areaCoords['latitude'],
                        $areaCoords['longitude'],
                        self::CLUSTER_RADIUS_KM
                    );

                    // Lapis kedua: saring kandidat berdasarkan waktu tempuh riil
                    // (bukan garis lurus). Fallback ke cluster asli kalau hasil
                    // filter kosong, supaya AI tetap punya data untuk dipakai.
                    $filteredByTravelTime = array_values(array_filter(
                        $clusterData,
                        fn ($d) => ($d['travel_time_minutes'] ?? 0) <= self::MAX_CANDIDATE_TRAVEL_MINUTES
                    ));

                    if (! empty($filteredByTravelTime)) {
                        $clusterData = $filteredByTravelTime;
                    }

                    Log::info('[AiPlanner] Cluster dipakai', ['names' => array_column($clusterData, 'name')]);
                }
            }
        } catch (\Throwable $e) {
            Log::error('[AiPlanner] Gagal ambil destinasi nyata (non-fatal)', ['message' => $e->getMessage()]);
        }

        // ── Panggil AI ──────────────────────────────────────────────────────
        try {
            $itinerary = $this->openRouter->generateItinerary($validated, $clusterData);

            // Lookup model Destination (buat cek road_time_multiplier override)
            // tanpa query DB berulang — pakai koleksi $nearby yang sudah dimuat.
            $destinationModelsById = isset($nearby) ? $nearby->keyBy('id') : collect();

            // Titik "sebelumnya" untuk hitung waktu tempuh antar-destinasi —
            // dimulai dari kota asal (kalau ada geocoding-nya), lalu berpindah
            // ke destinasi terakhir yang berhasil dicocokkan tiap kali maju.
            $prevLat = $originCoords['latitude'] ?? null;
            $prevLng = $originCoords['longitude'] ?? null;

            // Normalisasi struktur itinerary sebelum di-iterasi by-reference.
            if (! isset($itinerary['days']) || ! is_array($itinerary['days'])) {
                $itinerary['days'] = [];
            }

            foreach ($itinerary['days'] as &$day) {
                if (! isset($day['items']) || ! is_array($day['items'])) {
                    $day['items'] = [];
                }

                $dayTravelMinutes = 0;

                foreach ($day['items'] as &$item) {
                    $matched = null;

                    // Normalisasi nama (buang spasi & karakter non-alfanumerik)
                    // sebelum dibandingkan, supaya variasi penulisan nama
                    // destinasi dari AI tetap cocok dengan data kandidat.
                    $normalize = fn (string $s): string => preg_replace('/[^a-z0-9]/', '', mb_strtolower(trim($s)));
                    $nameNormalized = $normalize($item['destination_name'] ?? '');

                    if ($nameNormalized !== '') {
                        foreach ($clusterData as $candidate) {
                            $candidateNormalized = $normalize($candidate['name']);
                            if ($candidateNormalized !== '' && (
                                str_contains($candidateNormalized, $nameNormalized)
                                || str_contains($nameNormalized, $candidateNormalized)
                            )) {
                                $matched = $candidate;
                                break;
                            }
                        }
                    }

                    if ($matched) {
                        $item['destination_id'] = $matched['id'];
                        if ($matched['cover_image_url']) {
                            $item['image_url'] = $matched['cover_image_url'];
                        }

                        // Waktu tempuh dari titik sebelumnya ke destinasi ini,
                        // dihitung dari rute jalan sungguhan (TravelTimeService).
                        if ($prevLat !== null && $prevLng !== null) {
                            $travel = $this->travelTime->estimate(
                                $prevLat, $prevLng,
                                $matched['latitude'], $matched['longitude'],
                                $validated['transport_mode'],
                                $destinationModelsById->get($matched['id']),
                            );

                            $item['distance_km'] = $travel['distance_km'];
                            $item['travel_time_minutes'] = $travel['travel_time_minutes'];
                            $dayTravelMinutes += $travel['travel_time_minutes'];
                        }

                        $item['transport_mode'] = $validated['transport_mode'];
                        $prevLat = $matched['latitude'];
                        $prevLng = $matched['longitude'];
                    }
                }
                unset($item);

                $day['total_travel_time_minutes'] = $dayTravelMinutes;
            }
            unset($day);

            // Estimasi perjalanan kembali ke kota asal (kalau diisi & ada
            // minimal 1 destinasi yang berhasil dicocokkan koordinatnya).
            if ($originCoords && $prevLat !== null && $prevLng !== null) {
                $returnTravel = $this->travelTime->estimate(
                    $prevLat, $prevLng,
                    $originCoords['latitude'], $originCoords['longitude'],
                    $validated['transport_mode'],
                );

                $itinerary['return_trip_estimate'] = [
                    'distance_km' => $returnTravel['distance_km'],
                    'travel_time_minutes' => $returnTravel['travel_time_minutes'],
                ];
            }

            $itinerary['transport_mode'] = $validated['transport_mode'];

            if (! $isAdmin) {
                if ($subscription) {
                    $subscription->update([
                        'ai_generation_count_today' => $currentCount + 1,
                        'ai_generation_reset_at' => $today,
                    ]);
                }
            }

            return response()->json(['data' => $itinerary]);
        } catch (OpenRouterException $e) {
            return response()->json(['message' => $e->getMessage()], 502);
        } catch (\Throwable $e) {
            Log::error('[AiPlanner] Unexpected error', ['message' => $e->getMessage()]);

            return response()->json(['message' => 'Terjadi kesalahan tak terduga. Coba lagi.'], 500);
        }
    }
}

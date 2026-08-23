<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Padanan Laravel dari proxy Node lama (src/app/api/weather/route.ts).
 * Proxy sederhana ke Open-Meteo (API publik, tidak butuh key). Kontrak
 * response disamakan persis: { data: {...} } / { error: "..." }.
 */
class WeatherController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric'],
            'lon' => ['required', 'numeric'],
        ], [
            'lat.required' => 'Parameter lat dan lon wajib diisi.',
            'lon.required' => 'Parameter lat dan lon wajib diisi.',
        ]);

        try {
            $response = Http::get(config('services.open_meteo.url', 'https://api.open-meteo.com/v1').'/forecast', [
                'latitude' => $validated['lat'],
                'longitude' => $validated['lon'],
                'daily' => 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                'timezone' => 'Asia/Jakarta',
                'forecast_days' => 7,
            ]);

            if (! $response->successful()) {
                return response()->json(['error' => 'Gagal mengambil data cuaca.'], $response->status());
            }

            return response()->json(['data' => $response->json()]);
        } catch (\Throwable $e) {
            Log::error('[Weather] proxy exception', ['message' => $e->getMessage()]);

            return response()->json(['error' => 'Layanan cuaca sedang tidak tersedia.'], 502);
        }
    }
}

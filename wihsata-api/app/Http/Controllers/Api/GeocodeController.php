<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeocodingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Padanan Laravel dari proxy Node lama (src/app/api/geocode/route.ts).
 * Kontrak response sengaja disamakan persis: { data: {...} } / { error: "..." }
 * supaya kode frontend yang sudah ada tidak perlu diubah bentuk parsing-nya.
 */
class GeocodeController extends Controller
{
    public function __construct(private readonly GeocodingService $geocoding) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric'],
            'lon' => ['required', 'numeric'],
        ], [
            'lat.required' => 'Parameter lat dan lon wajib diisi.',
            'lon.required' => 'Parameter lat dan lon wajib diisi.',
        ]);

        $data = $this->geocoding->reverseGeocode((float) $validated['lat'], (float) $validated['lon']);

        if ($data === null) {
            return response()->json(['error' => 'Gagal mengambil data lokasi.'], 502);
        }

        return response()->json(['data' => $data]);
    }
}

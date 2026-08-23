<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    /** GET /api/trips — trip milik user yang login (untuk halaman My Trip). */
    public function index(Request $request): JsonResponse
    {
        $trips = Trip::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $trips]);
    }

    /** POST /api/trips — simpan trip baru (dari hasil AI Planner atau manual). */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget_estimate' => ['nullable', 'numeric', 'min:0'],
            'preferences' => ['nullable', 'array'],
            'itinerary' => ['nullable', 'array'],
            'cover_image_url' => ['nullable', 'url'],
            'is_public' => ['boolean'],
        ]);

        $trip = Trip::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'upcoming',
        ]);

        return response()->json(['data' => $trip, 'message' => 'Trip berhasil disimpan.'], 201);
    }

    /** GET /api/trips/{trip} */
    public function show(Request $request, Trip $trip): JsonResponse
    {
        $this->authorize('view', $trip);

        $trip->loadMissing('user:id,full_name');

        return response()->json(['data' => $trip]);
    }

    /** PATCH /api/trips/{trip} — update trip milik sendiri. */
    public function update(Request $request, Trip $trip): JsonResponse
    {
        $this->authorize('update', $trip);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'in:draft,upcoming,completed,archived'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date'],
            'budget_estimate' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'is_public' => ['sometimes', 'boolean'],
        ]);

        // Kalau start_date berubah dan itinerary sudah ada, geser label "date"
        // per hari mengikuti offset hari ke-N — destinasi/aktivitas tidak diubah.
        if (array_key_exists('start_date', $validated) && $validated['start_date'] && is_array($trip->itinerary) && count($trip->itinerary) > 0) {
            $newStart = \Carbon\Carbon::parse($validated['start_date']);
            $shiftedItinerary = array_map(function (array $day) use ($newStart) {
                $dayNumber = $day['day'] ?? null;
                if ($dayNumber !== null && is_numeric($dayNumber)) {
                    $day['date'] = $newStart->copy()->addDays(((int) $dayNumber) - 1)->format('Y-m-d');
                }

                return $day;
            }, $trip->itinerary);

            $validated['itinerary'] = $shiftedItinerary;
        }

        $trip->update($validated);

        return response()->json(['data' => $trip->fresh(), 'message' => 'Trip berhasil diperbarui.']);
    }

    /** DELETE /api/trips/{trip} — hapus trip milik sendiri (atau admin). */
    public function destroy(Request $request, Trip $trip): JsonResponse
    {
        $this->authorize('delete', $trip);

        $trip->delete();

        return response()->json(['message' => 'Trip berhasil dihapus.']);
    }
}

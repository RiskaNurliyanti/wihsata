<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Endpoint di sini dilindungi middleware 'role:admin,super_admin' di routes/api.php. */
class TripManagementController extends Controller
{
    /** GET /api/admin/trips — semua trip dari seluruh pengguna. */
    public function index(Request $request): JsonResponse
    {
        $trips = Trip::query()
            ->with('user:id,full_name,email')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 50));

        return response()->json($trips);
    }

    /** PATCH /api/admin/trips/{trip} — admin edit trip siapa pun. */
    public function update(Request $request, Trip $trip): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'in:draft,upcoming,completed,archived'],
            'start_date' => ['sometimes', 'nullable', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date'],
            'budget_estimate' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'is_public' => ['sometimes', 'boolean'],
        ]);

        $trip->update($validated);

        return response()->json(['data' => $trip->fresh(), 'message' => 'Trip berhasil diperbarui.']);
    }

    /** DELETE /api/admin/trips/{trip} — admin hapus trip siapa pun. */
    public function destroy(Trip $trip): JsonResponse
    {
        $trip->delete();

        return response()->json(['message' => 'Trip berhasil dihapus.']);
    }
}

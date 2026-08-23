<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Destination\DestinationRequest;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /** GET /api/destinations — list + filter (dipakai halaman Explore). */
    public function index(Request $request): JsonResponse
    {
        $query = Destination::query()->with(['category', 'district']);

        if ($search = $request->string('q')->trim()->value()) {
            $query->where('name', 'ilike', "%{$search}%");
        }

        if ($categorySlug = $request->string('category')->value()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($districtId = $request->string('district')->value()) {
            $query->where('district_id', $districtId);
        }

        if ($request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        match ($request->string('sort')->value()) {
            'newest' => $query->orderByDesc('created_at'),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc('rating'),
        };

        $destinations = $query->paginate($request->integer('per_page', 12));

        return response()->json($destinations);
    }

    /** GET /api/destinations/{destination} — detail (by slug lewat route model binding). */
    public function show(Destination $destination): JsonResponse
    {
        $destination->load(['category', 'district']);

        return response()->json(['data' => $destination]);
    }

    /**
     * GET /api/destinations/nearby?lat=..&lng=..&radius=..
     * Dipakai halaman Nearby dan AI Planner untuk cari destinasi terdekat.
     */
    public function nearby(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius' => ['nullable', 'numeric', 'min:1', 'max:500'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $destinations = Destination::query()
            ->nearby($validated['lat'], $validated['lng'], $validated['radius'] ?? 25)
            ->with(['category'])
            ->limit($validated['limit'] ?? 50)
            ->get();

        return response()->json(['data' => $destinations]);
    }

    /** POST /api/admin/destinations — hanya admin/super_admin (lihat routes/api.php). */
    public function store(DestinationRequest $request): JsonResponse
    {
        $destination = Destination::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return response()->json(['data' => $destination, 'message' => 'Destinasi berhasil ditambahkan.'], 201);
    }

    /** PUT/PATCH /api/admin/destinations/{destination} — hanya admin/super_admin. */
    public function update(DestinationRequest $request, Destination $destination): JsonResponse
    {
        $destination->update($request->validated());

        return response()->json(['data' => $destination->fresh(), 'message' => 'Destinasi berhasil diperbarui.']);
    }

    /** DELETE /api/admin/destinations/{destination} — hanya admin/super_admin. */
    public function destroy(Destination $destination): JsonResponse
    {
        $destination->delete();

        return response()->json(['message' => 'Destinasi berhasil dihapus.']);
    }
}

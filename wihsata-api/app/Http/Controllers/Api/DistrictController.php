<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    /** GET /api/districts — publik, dipakai filter Explore & form Admin Destinasi. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => District::query()->orderBy('name')->get()]);
    }

    /** POST /api/admin/districts — hanya admin/super_admin. */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'province' => ['required', 'string', 'max:150'],
        ], [
            'name.required' => 'Nama kabupaten/kota wajib diisi.',
            'province.required' => 'Nama provinsi wajib diisi.',
        ]);

        $district = District::create($validated);

        return response()->json(['data' => $district, 'message' => 'Kabupaten/Kota berhasil ditambahkan.'], 201);
    }

    /** DELETE /api/admin/districts/{district} — hanya admin/super_admin. */
    public function destroy(District $district): JsonResponse
    {
        $district->delete();

        return response()->json(['message' => 'Kabupaten/Kota berhasil dihapus.']);
    }
}

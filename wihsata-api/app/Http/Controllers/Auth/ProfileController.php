<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /** GET /api/auth/me — dipakai frontend untuk cek status login & data user. */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'user' => $user,
                'effective_tier' => $user->effectiveTier(),
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
        ]);
    }

    /** PATCH /api/auth/me — update profil sendiri. */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => ['sometimes', 'string', 'min:2', 'max:100'],
            'username' => ['sometimes', 'nullable', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9_]+$/', 'unique:users,username,'.$user->id],
            'bio' => ['sometimes', 'nullable', 'string', 'max:300'],
            'home_city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'avatar_url' => ['sometimes', 'nullable', 'url'],
        ], [
            'username.regex' => 'Username hanya boleh huruf kecil, angka, dan underscore.',
            'username.unique' => 'Username sudah dipakai orang lain.',
            'avatar_url.url' => 'URL avatar tidak valid.',
        ]);

        $user->update($validated);

        return response()->json(['data' => $user->fresh(), 'message' => 'Profil berhasil diperbarui.']);
    }
}

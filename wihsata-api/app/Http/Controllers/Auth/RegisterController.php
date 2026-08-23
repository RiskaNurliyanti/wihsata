<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * FIX (bug sama seperti LoginController): API register stateless, tidak
     * boleh menyentuh guard 'web'/session — `Auth::login()` +
     * `$request->session()->regenerate()` dihapus. Registrasi cukup buat
     * user lalu langsung terbitkan Sanctum token.
     */
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            // role SENGAJA tidak diambil dari input user — selalu default 'user'.
            // Menaikkan jadi admin/super_admin hanya boleh lewat endpoint
            // Super Admin (lihat Admin\UserManagementController), tidak pernah
            // langsung dari form registrasi publik.
        ]);

        event(new Registered($user));

        $token = $user->createToken('wihsata-web')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'Registrasi berhasil.',
        ], 201);
    }
}
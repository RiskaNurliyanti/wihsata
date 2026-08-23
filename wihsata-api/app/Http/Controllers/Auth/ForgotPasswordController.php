<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        // Sengaja SELALU balas sukses meski email tidak terdaftar di database
        // (mencegah orang lain menebak-nebak email mana yang punya akun di
        // Wihsata — praktik keamanan standar untuk fitur lupa password).
        if ($status !== Password::RESET_LINK_SENT && $status !== Password::INVALID_USER) {
            throw ValidationException::withMessages([
                'email' => ['Gagal mengirim link reset. Coba lagi beberapa saat lagi.'],
            ]);
        }

        return response()->json([
            'message' => 'Kalau email tersebut terdaftar, link reset password sudah kami kirim.',
        ]);
    }
}

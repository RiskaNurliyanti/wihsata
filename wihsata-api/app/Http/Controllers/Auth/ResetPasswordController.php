<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ], [
            'token.required' => 'Token reset tidak valid.',
            'email.required' => 'Email wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 8 karakter.',
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Cabut semua token API lama supaya sesi lama otomatis logout
                // di semua device setelah password diganti — praktik keamanan
                // standar untuk fitur reset password.
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [$this->translateStatus($status)],
            ]);
        }

        return response()->json([
            'message' => 'Password berhasil direset. Silakan masuk dengan password baru Anda.',
        ]);
    }

    private function translateStatus(string $status): string
    {
        return match ($status) {
            Password::INVALID_TOKEN => 'Link reset password sudah kedaluwarsa atau tidak valid. Minta link baru.',
            Password::INVALID_USER => 'Email tidak ditemukan.',
            default => 'Gagal mereset password. Coba lagi.',
        };
    }
}

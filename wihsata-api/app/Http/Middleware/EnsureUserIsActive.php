<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lapisan pengaman tambahan selain pencabutan token saat nonaktifkan akun
 * (lihat UserManagementController::updateStatus) — kalau karena alasan apa
 * pun ada token yang masih tersisa untuk akun nonaktif, request tetap
 * ditolak di sini.
 */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->is_active) {
            return response()->json([
                'message' => 'Akun ini telah dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.',
            ], 403);
        }

        return $next($request);
    }
}

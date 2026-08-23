<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Memblokir akses API saat mode maintenance aktif, kecuali untuk endpoint
 * publik tertentu (login, cek status maintenance) dan admin/super_admin
 * yang sudah login.
 */
class CheckMaintenanceMode
{
    /** Path (relatif, tanpa leading slash) yang tetap bisa diakses saat maintenance. */
    private const ALWAYS_ALLOWED_PATHS = [
        'api/maintenance-status',
        'api/admin/maintenance',
        'api/auth/login',
        'api/auth/me',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (SiteSetting::get('maintenance_enabled', '0') !== '1') {
            return $next($request);
        }

        if (in_array($request->path(), self::ALWAYS_ALLOWED_PATHS, true)) {
            return $next($request);
        }

        // Resolve user dari Bearer token tanpa mewajibkan route ini pakai
        // middleware auth:sanctum.
        $user = Auth::guard('sanctum')->user();

        if ($user && $user->isAdmin()) {
            return $next($request);
        }

        return response()->json([
            'maintenance' => true,
            'message' => SiteSetting::get(
                'maintenance_message',
                "Website sedang dalam pemeliharaan\n\nKami sedang melakukan pembaruan dan perbaikan sistem. Silakan kembali beberapa saat lagi."
            ),
        ], 503);
    }
}

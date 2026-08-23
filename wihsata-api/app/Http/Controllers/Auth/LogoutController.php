<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    /**
     * FIX (bug sama seperti Login/RegisterController): API logout stateless,
     * tidak pernah login ke guard 'web'/session sejak awal, jadi
     * `Auth::guard('web')->logout()` + `$request->session()->invalidate()`
     * + `regenerateToken()` dihapus — selain tidak perlu, baris session
     * tersebut yang melempar "Session store not set on request.". Cukup
     * cabut token Sanctum yang sedang dipakai request ini.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()?->delete();
        }

        return response()->json(['message' => 'Berhasil keluar.']);
    }
}
<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Contoh pemakaian di routes: ->middleware('role:admin')
     * atau ->middleware('role:super_admin') — bisa lebih dari satu role
     * dipisah koma, mis. 'role:admin,super_admin'.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $allowedRoles = array_map(
            fn (string $role) => UserRole::from($role),
            $roles
        );

        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json([
                'message' => 'Anda tidak punya izin untuk mengakses resource ini.',
            ], 403);
        }

        return $next($request);
    }
}

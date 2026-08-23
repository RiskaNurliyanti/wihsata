<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    /** GET /api/favorites — destinasi favorit user login (untuk halaman My Trip). */
    public function index(Request $request): JsonResponse
    {
        $destinations = Destination::query()
            ->join('favorites', 'favorites.destination_id', '=', 'destinations.id')
            ->where('favorites.user_id', $request->user()->id)
            ->orderByDesc('favorites.created_at')
            ->select('destinations.*')
            ->get();

        return response()->json(['data' => $destinations]);
    }

    /** POST /api/destinations/{destination}/favorite — toggle simpan/hapus. */
    public function toggle(Request $request, Destination $destination): JsonResponse
    {
        $userId = $request->user()->id;

        $exists = DB::table('favorites')
            ->where('user_id', $userId)
            ->where('destination_id', $destination->id)
            ->exists();

        if ($exists) {
            DB::table('favorites')->where('user_id', $userId)->where('destination_id', $destination->id)->delete();
            $saved = false;
        } else {
            DB::table('favorites')->insert([
                'user_id' => $userId,
                'destination_id' => $destination->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $saved = true;
        }

        return response()->json(['data' => ['saved' => $saved]]);
    }
}

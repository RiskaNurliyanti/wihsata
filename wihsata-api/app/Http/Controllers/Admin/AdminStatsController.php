<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Review;
use App\Models\Subscription;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/admin/stats — ringkasan angka untuk Dashboard & Analitik admin
 * (pengganti beberapa query count()/select() terpisah yang dulu langsung
 * ke Supabase dari frontend). Dilindungi middleware 'role:admin,super_admin'
 * di routes/api.php.
 */
class AdminStatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['data' => [
            'destinations' => Destination::count(),
            'users' => User::count(),
            'reviews' => Review::count(),
            'trips' => Trip::count(),
            'subscriptions_by_tier' => [
                'demo' => Subscription::where('tier', 'demo')->count(),
                'pro' => Subscription::where('tier', 'pro')->count(),
            ],
            'top_destinations' => Destination::query()
                ->select(['name', 'rating', 'review_count'])
                ->orderByDesc('review_count')
                ->limit(5)
                ->get(),
        ]]);
    }
}

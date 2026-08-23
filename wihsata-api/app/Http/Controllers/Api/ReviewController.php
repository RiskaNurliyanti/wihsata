<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /** GET /api/destinations/{destination}/reviews */
    public function index(Destination $destination): JsonResponse
    {
        $reviews = $destination->reviews()
            ->with('user:id,full_name,avatar_url')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json(['data' => $reviews]);
    }

    /**
     * PUT /api/destinations/{destination}/reviews — upsert (satu user
     * cuma boleh 1 review per destinasi, sama seperti constraint di Supabase).
     */
    public function upsert(Request $request, Destination $destination): JsonResponse
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ], [
            'rating.required' => 'Rating wajib diisi.',
        ]);

        $review = Review::updateOrCreate(
            ['destination_id' => $destination->id, 'user_id' => $request->user()->id],
            $validated
        );

        $review->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $review, 'message' => 'Ulasan berhasil dikirim.'], 201);
    }

    /** DELETE /api/reviews/{review} — pemilik atau admin. */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        $user = $request->user();
        if ($review->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Anda tidak punya izin menghapus ulasan ini.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Ulasan berhasil dihapus.']);
    }
}

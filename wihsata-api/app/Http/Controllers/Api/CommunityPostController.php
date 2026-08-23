<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityPostController extends Controller
{
    /** GET /api/community/posts — publik, feed komunitas. */
    public function index(Request $request): JsonResponse
    {
        $query = CommunityPost::query()
            ->with(['user:id,full_name,avatar_url', 'destination:id,name,slug']);

        // Search caption postingan.
        if ($search = $request->string('q')->trim()->value()) {
            $query->where('caption', 'ilike', "%{$search}%");
        }

        $posts = $query->orderByDesc('created_at')->paginate($request->integer('per_page', 30));

        return response()->json($posts);
    }

    /** POST /api/community/posts — semua user login boleh posting. */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'caption' => ['nullable', 'string', 'max:1000'],
            'destination_id' => ['nullable', 'uuid', 'exists:destinations,id'],
            'image_urls' => ['nullable', 'array'],
            'image_urls.*' => ['url'],
        ]);

        if (empty($validated['caption']) && empty($validated['image_urls'])) {
            return response()->json(['message' => 'Isi caption atau tambahkan foto terlebih dahulu.'], 422);
        }

        $post = CommunityPost::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'image_urls' => $validated['image_urls'] ?? [],
        ]);

        $post->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $post, 'message' => 'Postingan berhasil dibuat.'], 201);
    }

    /** PATCH /api/community/posts/{post} — pemilik atau admin. */
    public function update(Request $request, CommunityPost $post): JsonResponse
    {
        $user = $request->user();
        if ($post->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Anda tidak punya izin mengubah postingan ini.'], 403);
        }

        $validated = $request->validate(['caption' => ['required', 'string', 'max:1000']]);
        $post->update($validated);

        return response()->json(['data' => $post->fresh(), 'message' => 'Postingan berhasil diperbarui.']);
    }

    /** DELETE /api/community/posts/{post} — pemilik atau admin (moderasi). */
    public function destroy(Request $request, CommunityPost $post): JsonResponse
    {
        $user = $request->user();
        if ($post->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Anda tidak punya izin menghapus postingan ini.'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Postingan berhasil dihapus.']);
    }

    /** POST /api/community/posts/{post}/like — toggle like. */
    public function toggleLike(Request $request, CommunityPost $post): JsonResponse
    {
        $user = $request->user();
        $alreadyLiked = $post->likedBy()->where('user_id', $user->id)->exists();

        if ($alreadyLiked) {
            $post->likedBy()->detach($user->id);
            $post->decrement('like_count');
            $liked = false;
        } else {
            $post->likedBy()->attach($user->id);
            $post->increment('like_count');
            $liked = true;
        }

        return response()->json(['data' => ['liked' => $liked, 'like_count' => $post->fresh()->like_count]]);
    }
}

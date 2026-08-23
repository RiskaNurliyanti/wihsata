<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\PostComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostCommentController extends Controller
{
    /** GET /api/community/posts/{post}/comments */
    public function index(CommunityPost $post): JsonResponse
    {
        $comments = $post->comments()->with('user:id,full_name,avatar_url')->orderBy('created_at')->get();

        return response()->json(['data' => $comments]);
    }

    /** POST /api/community/posts/{post}/comments */
    public function store(Request $request, CommunityPost $post): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
        ]);

        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        $comment->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $comment, 'message' => 'Komentar berhasil dikirim.'], 201);
    }

    /** PATCH /api/post-comments/{comment} — hanya pemilik komentar. */
    public function update(Request $request, PostComment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => 'Anda hanya bisa mengubah komentar milik sendiri.'], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
        ]);

        $comment->update($validated);
        $comment->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $comment, 'message' => 'Komentar berhasil diperbarui.']);
    }

    /**
     * DELETE /api/post-comments/{comment} — pemilik komentar, PEMILIK
     * POSTINGAN (moderasi komentar di postingannya sendiri), atau admin.
     */
    public function destroy(Request $request, PostComment $comment): JsonResponse
    {
        $user = $request->user();
        $comment->loadMissing('post:id,user_id');

        $isCommentOwner = $comment->user_id === $user->id;
        $isPostOwner = $comment->post?->user_id === $user->id;

        if (! $isCommentOwner && ! $isPostOwner && ! $user->isAdmin()) {
            return response()->json(['message' => 'Anda tidak punya izin menghapus komentar ini.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Komentar berhasil dihapus.']);
    }
}

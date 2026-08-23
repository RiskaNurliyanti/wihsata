<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleCommentController extends Controller
{
    /** POST /api/articles/{article}/comments — semua user login boleh komentar. */
    public function store(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
        ]);

        $comment = ArticleComment::create([
            'article_id' => $article->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        $comment->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $comment, 'message' => 'Komentar berhasil dikirim.'], 201);
    }

    /** PATCH /api/article-comments/{comment} — hanya pemilik komentar. */
    public function update(Request $request, ArticleComment $comment): JsonResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id) {
            return response()->json(['message' => 'Anda hanya bisa mengubah komentar milik sendiri.'], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ], [
            'content.required' => 'Komentar tidak boleh kosong.',
        ]);

        $comment->update($validated);
        $comment->load('user:id,full_name,avatar_url');

        return response()->json(['data' => $comment, 'message' => 'Komentar berhasil diperbarui.']);
    }

    /**
     * DELETE /api/article-comments/{comment} — pemilik komentar, PEMILIK
     * ARTIKEL (moderasi komentar di tulisannya sendiri), atau admin.
     */
    public function destroy(Request $request, ArticleComment $comment): JsonResponse
    {
        $user = $request->user();
        $comment->loadMissing('article:id,author_id');

        $isCommentOwner = $comment->user_id === $user->id;
        $isArticleOwner = $comment->article?->author_id === $user->id;

        if (! $isCommentOwner && ! $isArticleOwner && ! $user->isAdmin()) {
            return response()->json(['message' => 'Anda tidak punya izin menghapus komentar ini.'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Komentar berhasil dihapus.']);
    }
}

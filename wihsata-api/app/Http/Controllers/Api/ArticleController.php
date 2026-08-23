<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ArticleController extends Controller
{
    /** GET /api/articles — publik, hanya yang published (untuk halaman Blog). */
    public function index(Request $request): JsonResponse
    {
        $query = Article::query()->where('is_published', true)->with('author:id,full_name,avatar_url');

        // Search judul/ringkasan artikel.
        if ($search = $request->string('q')->trim()->value()) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%");
            });
        }

        if ($category = $request->string('category')->value()) {
            $query->where('category', $category);
        }

        $articles = $query->orderByDesc('published_at')->paginate($request->integer('per_page', 12));

        return response()->json($articles);
    }

    /**
     * GET /api/admin/articles — SEMUA artikel dari SEMUA penulis, termasuk
     * draft (published + belum) — dipakai halaman Kelola Blog admin.
     * Dilindungi middleware 'role:admin,super_admin' di routes/api.php.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $articles = Article::query()
            ->with('author:id,full_name,avatar_url')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 100));

        return response()->json($articles);
    }

    /** GET /api/articles/mine — artikel milik user login sendiri (published + draft). */
    public function mine(Request $request): JsonResponse
    {
        $articles = Article::query()
            ->where('author_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $articles]);
    }

    /** GET /api/articles/{article} — detail (route binding pakai slug). */
    public function show(Request $request, Article $article): JsonResponse
    {
        $this->authorize('view', $article);
        $article->load(['author:id,full_name,avatar_url', 'comments.user:id,full_name,avatar_url']);

        return response()->json(['data' => $article]);
    }

    /** POST /api/articles — SEMUA user login boleh nulis artikel, bukan cuma admin. */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:articles,slug'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'cover_image_url' => ['nullable', 'url'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_published' => ['boolean'],
        ], [
            'title.required' => 'Judul artikel wajib diisi.',
            'slug.unique' => 'Slug sudah dipakai artikel lain.',
            'content.required' => 'Konten artikel wajib diisi.',
        ]);

        $article = Article::create([
            ...$validated,
            'author_id' => $request->user()->id,
            'published_at' => ($validated['is_published'] ?? false) ? now() : null,
        ]);

        return response()->json(['data' => $article, 'message' => 'Artikel berhasil dibuat.'], 201);
    }

    /** PATCH /api/articles/{article} — pemilik artikel atau admin. */
    public function update(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('articles', 'slug')->ignore($article->id)],
            'excerpt' => ['sometimes', 'nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'string'],
            'cover_image_url' => ['sometimes', 'nullable', 'url'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('is_published', $validated)) {
            $validated['published_at'] = $validated['is_published'] ? now() : null;
        }

        $article->update($validated);

        return response()->json(['data' => $article->fresh(), 'message' => 'Artikel berhasil diperbarui.']);
    }

    /** DELETE /api/articles/{article} — pemilik artikel atau admin. */
    public function destroy(Article $article): JsonResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        return response()->json(['message' => 'Artikel berhasil dihapus.']);
    }
}

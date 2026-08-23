<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /** GET /api/categories — publik, dipakai filter Explore & AI Planner. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Category::query()->orderBy('name')->get()]);
    }

    /** POST /api/admin/categories — hanya admin/super_admin. */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'icon' => ['nullable', 'string', 'max:100'],
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique' => 'Nama kategori sudah dipakai.',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'] ?? null,
        ]);

        return response()->json(['data' => $category, 'message' => 'Kategori berhasil ditambahkan.'], 201);
    }

    /** PATCH /api/admin/categories/{category} — hanya admin/super_admin. */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('categories', 'name')->ignore($category->id)],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $category->update($validated);

        return response()->json(['data' => $category->fresh(), 'message' => 'Kategori berhasil diperbarui.']);
    }

    /** DELETE /api/admin/categories/{category} — hanya admin/super_admin. */
    public function destroy(Category $category): JsonResponse
    {
        // Destinasi yang pakai kategori ini otomatis category_id jadi null
        // (lihat foreign key nullOnDelete di migration destinations).
        $category->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }
}

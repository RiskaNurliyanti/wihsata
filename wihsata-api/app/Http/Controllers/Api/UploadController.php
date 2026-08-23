<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Endpoint upload file gambar generik, dipakai form destinasi, artikel,
 * komunitas, dan profil. File asli disimpan tanpa resize/compress agar
 * kualitas tetap terjaga.
 */
class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:10240'],
        ], [
            'file.required' => 'File gambar wajib diunggah.',
            'file.image' => 'File harus berupa gambar (jpg, png, webp, dll).',
            'file.max' => 'Ukuran gambar maksimal 10MB.',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $filename = Str::uuid().'.'.$extension;
        $directory = 'uploads/'.date('Y/m');

        // Disk penyimpanan dapat dikonfigurasi lewat env UPLOAD_DISK
        // (default 'public'). Set ke 'b2' setelah setup Backblaze B2 agar
        // file tidak hilang saat container di-redeploy pada hosting cloud.
        $disk = config('filesystems.upload_disk', 'public');

        $path = $file->storeAs($directory, $filename, $disk);

        return response()->json([
            'data' => [
                'path' => $path,
                'url' => Storage::disk($disk)->url($path),
            ],
            'message' => 'File berhasil diunggah.',
        ], 201);
    }
}

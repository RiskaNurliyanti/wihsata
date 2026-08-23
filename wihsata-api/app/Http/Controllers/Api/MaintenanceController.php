<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Mengelola mode maintenance website.
 *
 * GET /api/maintenance-status — publik, dipakai frontend untuk menampilkan
 * halaman pemberitahuan ke user biasa saat maintenance aktif.
 * PATCH /api/admin/maintenance — hanya admin/super_admin.
 */
class MaintenanceController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => [
                'enabled' => SiteSetting::get('maintenance_enabled', '0') === '1',
                'message' => SiteSetting::get(
                    'maintenance_message',
                    "Website sedang dalam pemeliharaan\n\nKami sedang melakukan pembaruan dan perbaikan sistem. Silakan kembali beberapa saat lagi."
                ),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        SiteSetting::set('maintenance_enabled', $validated['enabled'] ? '1' : '0');

        if (array_key_exists('message', $validated) && $validated['message'] !== null && $validated['message'] !== '') {
            SiteSetting::set('maintenance_message', $validated['message']);
        }

        return response()->json([
            'data' => [
                'enabled' => SiteSetting::get('maintenance_enabled') === '1',
                'message' => SiteSetting::get('maintenance_message'),
            ],
            'message' => $validated['enabled'] ? 'Mode maintenance diaktifkan.' : 'Mode maintenance dinonaktifkan.',
        ]);
    }
}

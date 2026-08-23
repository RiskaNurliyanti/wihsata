<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Semua endpoint di sini WAJIB dilindungi middleware 'role:super_admin'
 * di routes/api.php — jangan pernah dipasang tanpa proteksi itu, karena
 * controller ini bisa mengubah role pengguna lain jadi admin.
 */
class UserManagementController extends Controller
{
    /** List semua pengguna — untuk halaman Kelola Pengguna admin. */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'full_name', 'username', 'email', 'avatar_url', 'role', 'is_active', 'created_at'])
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 50));

        return response()->json($users);
    }

    /**
     * Ubah role pengguna — HANYA bisa dipanggil Super Admin (dijamin ganda:
     * middleware route + Gate di dalam sini).
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $this->authorize('manage-roles');

        $validated = $request->validate([
            'role' => ['required', Rule::enum(UserRole::class)],
        ], [
            'role.required' => 'Role wajib dipilih.',
        ]);

        // Cegah Super Admin terakhir menurunkan role dirinya sendiri secara
        // tidak sengaja sampai tidak ada Super Admin tersisa di sistem.
        if ($user->id === $request->user()->id && $validated['role'] !== UserRole::SuperAdmin->value) {
            $remainingSuperAdmins = User::where('role', UserRole::SuperAdmin->value)
                ->where('id', '!=', $user->id)
                ->count();

            if ($remainingSuperAdmins === 0) {
                return response()->json([
                    'message' => 'Tidak bisa menurunkan role diri sendiri — Anda adalah satu-satunya Super Admin yang tersisa.',
                ], 422);
            }
        }

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'data' => $user->fresh(),
            'message' => "Role {$user->full_name} berhasil diubah jadi ".UserRole::from($validated['role'])->label().'.',
        ]);
    }

    /**
     * Aktifkan / nonaktifkan akun pengguna — HANYA Super Admin. Saat
     * dinonaktifkan, semua token API aktif milik user tsb langsung dicabut
     * supaya sesi yang sedang berjalan pun ikut terputus, bukan cuma
     * mencegah login berikutnya.
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $this->authorize('manage-roles');

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ], [
            'is_active.required' => 'Status aktif wajib diisi.',
        ]);

        // Cegah Super Admin menonaktifkan dirinya sendiri sampai terkunci
        // dari sistem tanpa ada Super Admin aktif lain yang bisa mengaktifkan
        // kembali.
        if ($user->id === $request->user()->id && ! $validated['is_active']) {
            $remainingActiveSuperAdmins = User::where('role', UserRole::SuperAdmin->value)
                ->where('is_active', true)
                ->where('id', '!=', $user->id)
                ->count();

            if ($remainingActiveSuperAdmins === 0) {
                return response()->json([
                    'message' => 'Tidak bisa menonaktifkan akun sendiri — tidak ada Super Admin aktif lain yang tersisa.',
                ], 422);
            }
        }

        $user->update(['is_active' => $validated['is_active']]);

        if (! $validated['is_active']) {
            $user->tokens()->delete();
        }

        return response()->json([
            'data' => $user->fresh(),
            'message' => $validated['is_active']
                ? "Akun {$user->full_name} berhasil diaktifkan."
                : "Akun {$user->full_name} berhasil dinonaktifkan.",
        ]);
    }
}

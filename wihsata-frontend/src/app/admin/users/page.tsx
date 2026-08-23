import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken, getSession } from '@/lib/api/session';
import { UserManagementTable, type AdminUserRow } from '@/components/admin/user-management-table';

export const metadata: Metadata = { title: 'Kelola Pengguna — Admin' };

async function getUsers() {
  const token = getServerToken();
  if (!token) return { users: [] as AdminUserRow[], error: 'Sesi tidak ditemukan.' };

  try {
    const res = await apiFetch<{ data: AdminUserRow[] }>('/admin/users?per_page=100', { token });
    return { users: res.data, error: null as string | null };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Gagal memuat data pengguna.';
    return { users: [] as AdminUserRow[], error: message };
  }
}

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login?redirect=/admin/users');

  const { users, error } = await getUsers();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Kelola Pengguna</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {users.length} pengguna terdaftar.
        {session.is_super_admin
          ? ' Sebagai Super Admin, Anda bisa ubah role dan aktifkan/nonaktifkan akun.'
          : ' Hanya Super Admin yang bisa ubah role atau status akun.'}
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          Gagal memuat data: {error}. Pastikan Laravel API dapat diakses.
        </div>
      )}

      <div className="mt-6">
        <UserManagementTable initialUsers={users} canManage={session.is_super_admin} currentUserId={session.user.id} />
      </div>
    </div>
  );
}

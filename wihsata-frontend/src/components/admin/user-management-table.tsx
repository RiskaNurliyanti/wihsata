'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { AdminSearchBox } from '@/components/admin/admin-search-box';
import { formatDateID } from '@/lib/utils';
import { updateUserRoleAction, updateUserStatusAction } from '@/lib/actions/admin.actions';
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react';

export interface AdminUserRow {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

const roleBadge: Record<AdminUserRow['role'], { label: string; variant: 'pro' | 'warning' | 'outline' }> = {
  super_admin: { label: 'Super Admin', variant: 'pro' },
  admin: { label: 'Admin', variant: 'warning' },
  user: { label: 'User', variant: 'outline' },
};

const ROLE_OPTIONS: { value: AdminUserRow['role']; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

interface UserManagementTableProps {
  initialUsers: AdminUserRow[];
  /** Hanya Super Admin yang boleh ubah role/status — user lain (mis. Admin biasa) cuma lihat tabel read-only. */
  canManage: boolean;
  currentUserId: string;
}

export function UserManagementTable({ initialUsers, canManage, currentUserId }: UserManagementTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  // Search kelola pengguna — client-side (daftar diambil penuh, tanpa pagination).
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  function handleRoleChange(userId: string, role: AdminUserRow['role']) {
    setError(null);
    setPendingId(userId);
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, role);
      setPendingId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      router.refresh();
    });
  }

  function handleToggleStatus(userId: string, currentlyActive: boolean) {
    setError(null);
    setPendingId(userId);
    startTransition(async () => {
      const result = await updateUserStatusAction(userId, !currentlyActive);
      setPendingId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: !currentlyActive } : u)));
      router.refresh();
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <AdminSearchBox value={query} onChange={setQuery} placeholder="Cari nama, username, atau email..." className="mb-4" />

      <Card>
        <CardContent className="p-0">
          <ResponsiveTable>
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium text-muted-foreground">Pengguna</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Role</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Bergabung</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                  {canManage && <th className="p-4 text-right font-medium text-muted-foreground">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 5 : 4} className="p-6 text-center text-muted-foreground">
                      Tidak ada pengguna yang cocok dengan &quot;{query}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                  const badge = roleBadge[u.role];
                  const isSelf = u.id === currentUserId;
                  const isPending = pendingId === u.id;

                  return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar_url ?? undefined} />
                            <AvatarFallback>{u.full_name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-foreground">{u.full_name ?? 'Tanpa Nama'}</span>
                            {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(Anda)</span>}
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {canManage ? (
                          <select
                            value={u.role}
                            disabled={isPending}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUserRow['role'])}
                            className="rounded-md border border-border bg-background px-2 py-1 text-sm disabled:opacity-50"
                          >
                            {ROLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDateID(u.created_at)}</td>
                      <td className="p-4">
                        <Badge variant={u.is_active ? 'secondary' : 'destructive'}>
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      {canManage && (
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending || isSelf}
                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                            title={isSelf ? 'Tidak bisa menonaktifkan akun sendiri' : undefined}
                          >
                            {isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : u.is_active ? (
                              <ShieldOff className="h-3.5 w-3.5" />
                            ) : (
                              <ShieldCheck className="h-3.5 w-3.5" />
                            )}
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
}

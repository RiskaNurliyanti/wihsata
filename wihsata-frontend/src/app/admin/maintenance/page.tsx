import type { Metadata } from 'next';
import { apiFetch } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { MaintenanceToggle } from '@/components/admin/maintenance-toggle';

export const metadata: Metadata = { title: 'Maintenance — Admin' };

export default async function AdminMaintenancePage() {
  const token = getServerToken();
  const res = await apiFetch<{ data: { enabled: boolean; message: string } }>('/maintenance-status', { token });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Maintenance Website</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Nonaktifkan sementara akses website untuk pengguna biasa saat ada update, perbaikan database, atau deployment.
        Admin & Super Admin tetap bisa login dan mengelola panel ini walau maintenance aktif.
      </p>

      <div className="mt-6">
        <MaintenanceToggle initialEnabled={res.data.enabled} initialMessage={res.data.message} />
      </div>
    </div>
  );
}

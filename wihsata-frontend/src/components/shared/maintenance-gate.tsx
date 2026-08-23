'use client';

/**
 * Gate maintenance mode — dipasang di root layout, membungkus seluruh
 * konten halaman. Kalau maintenance aktif: halaman /auth/* dan /admin/*
 * tetap bisa diakses (supaya admin bisa login & mematikan maintenance),
 * user dengan role admin/super_admin tetap lihat halaman normal, selain
 * itu ditampilkan halaman pemberitahuan.
 */

import { usePathname } from 'next/navigation';
import { useCurrentProfile } from '@/hooks/use-current-profile';
import { MaintenancePage } from '@/components/shared/maintenance-page';

interface MaintenanceGateProps {
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
  children: React.ReactNode;
}

export function MaintenanceGate({ maintenanceEnabled, maintenanceMessage, children }: MaintenanceGateProps) {
  const pathname = usePathname();
  const { role, isLoading } = useCurrentProfile();

  if (!maintenanceEnabled) {
    return <>{children}</>;
  }

  // Rute yang wajib tetap bisa diakses siapa pun selama maintenance:
  // halaman login/auth (supaya admin bisa masuk) & panel admin itu sendiri.
  const isExemptRoute = pathname?.startsWith('/auth') || pathname?.startsWith('/admin');
  if (isExemptRoute) {
    return <>{children}</>;
  }

  // Selagi status login masih dicek, jangan langsung tampilkan halaman
  // maintenance ke admin yang sebenarnya sudah login (hindari flash salah).
  if (isLoading) {
    return null;
  }

  if (role === 'admin' || role === 'super_admin') {
    return <>{children}</>;
  }

  return <MaintenancePage message={maintenanceMessage} />;
}

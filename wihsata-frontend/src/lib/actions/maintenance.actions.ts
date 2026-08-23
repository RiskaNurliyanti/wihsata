'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export interface MaintenanceActionState {
  error: string | null;
  success: boolean;
}

const err = (error: string): MaintenanceActionState => ({ error, success: false });

/** Toggle maintenance on/off + set pesan (hanya admin/super_admin — ditegakkan backend). */
export async function updateMaintenanceAction(enabled: boolean, message: string): Promise<MaintenanceActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch('/admin/maintenance', {
      method: 'PATCH',
      token,
      json: { enabled, message: message.trim() || undefined },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal mengubah status maintenance.');
  }

  // Revalidate semua halaman (root layout membaca status maintenance) —
  // tanpa ini, perubahan baru terlihat setelah cache Next.js kedaluwarsa.
  revalidatePath('/', 'layout');
  return { error: null, success: true };
}

'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import type { TripStatus } from '@/types/database.types';

export interface OwnTripActionState {
  error: string | null;
  success: boolean;
}

const err = (error: string): OwnTripActionState => ({ error, success: false });

/**
 * Update trip milik user sendiri. Keamanan kepemilikan sekarang dijamin
 * TripPolicy di Laravel (Gate::policy(Trip::class, TripPolicy::class)) —
 * penggantinya RLS `trips_update_own` yang dulu di Supabase.
 */
export async function updateOwnTripAction(
  tripId: string,
  values: {
    title: string;
    status: TripStatus;
    start_date: string | null;
    end_date: string | null;
    budget_estimate: number | null;
  }
): Promise<OwnTripActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');
  if (!values.title.trim()) return err('Judul trip wajib diisi.');

  try {
    await apiFetch(`/trips/${tripId}`, {
      method: 'PATCH',
      token,
      json: {
        title: values.title.trim(),
        status: values.status,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
        budget_estimate: values.budget_estimate,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal memperbarui trip. Coba lagi.');
  }

  revalidatePath('/my-trip');
  return { error: null, success: true };
}

/** Hapus trip milik user sendiri. */
export async function deleteOwnTripAction(tripId: string): Promise<OwnTripActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/trips/${tripId}`, { method: 'DELETE', token });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menghapus trip. Coba lagi.');
  }

  revalidatePath('/my-trip');
  return { error: null, success: true };
}

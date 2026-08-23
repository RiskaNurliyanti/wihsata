'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';
import { adminTripSchema, type AdminTripFormValues } from '@/lib/validations/trip.schema';

export interface DestinationFormState {
  error: string | null;
}

function requireToken(): string {
  const token = getServerToken();
  if (!token) throw new Error('Unauthorized');
  return token;
}

function parseDestinationForm(formData: FormData) {
  const galleryRaw = (formData.get('gallery_urls') as string) ?? '';
  const gallery_urls = galleryRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const facilitiesRaw = (formData.get('facilities') as string) ?? '';
  const facilities = facilitiesRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const accessType = (formData.get('access_type') as string) || 'darat';
  const crossingDurationRaw = formData.get('crossing_duration_minutes') as string;
  const crossingCostRaw = formData.get('crossing_cost_estimate') as string;
  // Field kosong dikirim sebagai null (bukan 0), supaya backend tidak
  // menganggapnya "sudah dinilai 0". safety_source ikut null kalau score kosong.
  const safetyScoreRaw = (formData.get('safety_score') as string)?.trim();
  const safetyScore = safetyScoreRaw ? Number(safetyScoreRaw) : null;
  const safetySource = safetyScore !== null ? (formData.get('safety_source') as string)?.trim() || null : null;

  // Jam operasional dikirim sebagai JSON string dari hidden input (lihat
  // destination-form.tsx), di-parse balik jadi object di sini.
  const openingHoursRaw = (formData.get('opening_hours') as string) ?? '';
  let opening_hours: Record<string, string> | null = null;
  try {
    const parsed = openingHoursRaw ? JSON.parse(openingHoursRaw) : {};
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      opening_hours = parsed;
    }
  } catch {
    opening_hours = null;
  }

  return {
    name: (formData.get('name') as string)?.trim(),
    slug: (formData.get('slug') as string)?.trim(),
    description: (formData.get('description') as string)?.trim() || null,
    category_id: (formData.get('category_id') as string) || null,
    district_id: (formData.get('district_id') as string) || null,
    latitude: Number(formData.get('latitude')),
    longitude: Number(formData.get('longitude')),
    address: (formData.get('address') as string)?.trim() || null,
    safety_score: safetyScore,
    safety_source: safetySource,
    opening_hours,
    price_range: (formData.get('price_range') as string)?.trim() || null,
    cover_image_url: (formData.get('cover_image_url') as string)?.trim() || null,
    gallery_urls,
    facilities,
    google_maps_url: (formData.get('google_maps_url') as string)?.trim() || null,
    is_featured: formData.get('is_featured') === 'on',
    access_type: accessType,
    departure_port: accessType === 'darat' ? null : (formData.get('departure_port') as string)?.trim() || null,
    crossing_duration_minutes: accessType === 'darat' || !crossingDurationRaw ? null : Number(crossingDurationRaw),
    crossing_cost_estimate: accessType === 'darat' || !crossingCostRaw ? null : Number(crossingCostRaw),
    crossing_notes: accessType === 'darat' ? null : (formData.get('crossing_notes') as string)?.trim() || null,
  };
}

export async function createDestinationAction(
  _prev: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  let token: string;
  try {
    token = requireToken();
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unauthorized' };
  }

  const data = parseDestinationForm(formData);
  if (!data.name || !data.slug || Number.isNaN(data.latitude) || Number.isNaN(data.longitude)) {
    return { error: 'Nama, slug, latitude, dan longitude wajib diisi dengan benar.' };
  }

  try {
    await apiFetch('/admin/destinations', { method: 'POST', token, json: data });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message };
    return { error: 'Terjadi kesalahan.' };
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/explore');
  redirect('/admin/destinations');
}

/**
 * `destinationSlug` — endpoint Laravel pakai route-model-binding by slug
 * (Route::match(['put','patch'], '/destinations/{destination:slug}', ...)),
 * BUKAN UUID. Pemanggil (admin/destinations/[id]/edit/page.tsx) di-bind
 * dengan `destination.slug`, bukan `destination.id` lagi.
 */
export async function updateDestinationAction(
  destinationSlug: string,
  _prev: DestinationFormState,
  formData: FormData
): Promise<DestinationFormState> {
  let token: string;
  try {
    token = requireToken();
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unauthorized' };
  }

  const data = parseDestinationForm(formData);
  if (!data.name || !data.slug || Number.isNaN(data.latitude) || Number.isNaN(data.longitude)) {
    return { error: 'Nama, slug, latitude, dan longitude wajib diisi dengan benar.' };
  }

  try {
    await apiFetch(`/admin/destinations/${destinationSlug}`, { method: 'PATCH', token, json: data });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message };
    return { error: 'Terjadi kesalahan.' };
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/explore');
  redirect('/admin/destinations');
}

/** Hapus destinasi — hanya admin/super_admin (dicek middleware role Laravel). `destinationSlug`, bukan id. */
export async function deleteDestinationAction(destinationSlug: string) {
  const token = requireToken();

  try {
    await apiFetch(`/admin/destinations/${destinationSlug}`, { method: 'DELETE', token });
  } catch (error) {
    throw new Error(error instanceof ApiError ? error.message : 'Gagal menghapus destinasi.');
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/explore');
}

export async function deleteTripAction(tripId: string) {
  const token = requireToken();

  try {
    await apiFetch(`/admin/trips/${tripId}`, { method: 'DELETE', token });
  } catch (error) {
    throw new Error(error instanceof ApiError ? error.message : 'Gagal menghapus trip.');
  }

  // CATATAN (dipertahankan dari versi Supabase lama — masih relevan):
  // TIDAK pakai redirect() di sini karena fungsi ini dipanggil langsung dari
  // Client Component lewat startTransition(), bukan lewat <form action={...}>.
  // Cukup revalidatePath, sudah otomatis memicu refresh data.
  revalidatePath('/admin/trips');
  revalidatePath('/my-trip');
}

export async function updateTripAction(tripId: string, values: AdminTripFormValues) {
  let token: string;
  try {
    token = requireToken();
  } catch (e) {
    return { error: { _form: [e instanceof Error ? e.message : 'Unauthorized'] } };
  }

  const parsed = adminTripSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await apiFetch(`/admin/trips/${tripId}`, {
      method: 'PATCH',
      token,
      json: {
        title: parsed.data.title,
        status: parsed.data.status,
        start_date: parsed.data.start_date || null,
        end_date: parsed.data.end_date || null,
        budget_estimate: parsed.data.budget_estimate ?? null,
        is_public: parsed.data.is_public,
      },
    });
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Terjadi kesalahan.';
    return { error: { _form: [message] } };
  }

  revalidatePath('/admin/trips');
  revalidatePath(`/admin/trips/${tripId}/edit`);

  return { success: true };
}

// ── Kelola kategori & role user — Super Admin (requirement tambahan Fase 4) ──

export interface UserActionState {
  error: string | null;
  success: boolean;
}

/** Ubah role user — HANYA super_admin (dicek middleware role Laravel). */
export async function updateUserRoleAction(userId: string, role: 'user' | 'admin' | 'super_admin'): Promise<UserActionState> {
  const token = requireToken();

  try {
    await apiFetch(`/admin/users/${userId}/role`, { method: 'PATCH', token, json: { role } });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message, success: false };
    return { error: 'Gagal mengubah role.', success: false };
  }

  revalidatePath('/admin/users');
  return { error: null, success: true };
}

/** Aktifkan/nonaktifkan akun user — HANYA super_admin. */
export async function updateUserStatusAction(userId: string, isActive: boolean): Promise<UserActionState> {
  const token = requireToken();

  try {
    await apiFetch(`/admin/users/${userId}/status`, { method: 'PATCH', token, json: { is_active: isActive } });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message, success: false };
    return { error: 'Gagal mengubah status akun.', success: false };
  }

  revalidatePath('/admin/users');
  return { error: null, success: true };
}

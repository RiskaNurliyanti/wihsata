'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export interface CategoryActionState {
  error: string | null;
  success: boolean;
}

const err = (error: string): CategoryActionState => ({ error, success: false });

/**
 * Signature dipertahankan `(name, icon, slug)` supaya tidak perlu mengubah
 * pemanggil di UI (category-manager.tsx) — parameter `slug` sekarang
 * diabaikan karena Laravel men-generate slug otomatis dari nama
 * (CategoryController::store, konsisten & tidak bisa berbeda dari nama).
 */
export async function createCategoryAction(name: string, icon: string, _slug: string): Promise<CategoryActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');
  if (!name.trim()) return err('Nama dan slug kategori wajib diisi.');

  try {
    await apiFetch('/admin/categories', {
      method: 'POST',
      token,
      json: { name: name.trim(), icon: icon.trim() || null },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menambahkan kategori.');
  }

  revalidatePath('/admin/categories');
  revalidatePath('/explore');
  return { error: null, success: true };
}

export async function updateCategoryAction(categoryId: string, name: string, icon: string): Promise<CategoryActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');
  if (!name.trim()) return err('Nama kategori wajib diisi.');

  try {
    await apiFetch(`/admin/categories/${categoryId}`, {
      method: 'PATCH',
      token,
      json: { name: name.trim(), icon: icon.trim() || null },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal memperbarui kategori.');
  }

  revalidatePath('/admin/categories');
  revalidatePath('/explore');
  return { error: null, success: true };
}

export async function deleteCategoryAction(categoryId: string): Promise<CategoryActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/admin/categories/${categoryId}`, { method: 'DELETE', token });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menghapus kategori.');
  }

  revalidatePath('/admin/categories');
  revalidatePath('/explore');
  return { error: null, success: true };
}

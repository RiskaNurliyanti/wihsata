'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export interface CommunityActionState {
  error: string | null;
  success: boolean;
}

const err = (error: string): CommunityActionState => ({ error, success: false });

/** Buat postingan komunitas baru. */
export async function createPostAction(
  _prevState: CommunityActionState,
  formData: FormData
): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login untuk memposting.');

  const caption = (formData.get('caption') as string)?.trim();
  const imageUrlRaw = (formData.get('image_url') as string)?.trim();

  if (!caption && !imageUrlRaw) {
    return err('Isi caption atau tambahkan foto terlebih dahulu.');
  }

  try {
    await apiFetch('/community/posts', {
      method: 'POST',
      token,
      json: { caption: caption || null, image_urls: imageUrlRaw ? [imageUrlRaw] : [] },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal membuat postingan.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

/** Update caption postingan milik sendiri (atau admin — otorisasi dicek di Laravel). */
export async function updatePostAction(postId: string, caption: string): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/community/posts/${postId}`, { method: 'PATCH', token, json: { caption } });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal memperbarui postingan.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

/** Hapus postingan milik sendiri (atau admin untuk moderasi). */
export async function deletePostAction(postId: string): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/community/posts/${postId}`, { method: 'DELETE', token });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menghapus postingan.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

/** Tambah komentar ke postingan. */
export async function createCommentAction(postId: string, content: string): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login untuk berkomentar.');
  if (!content.trim()) return err('Komentar tidak boleh kosong.');

  try {
    await apiFetch(`/community/posts/${postId}/comments`, {
      method: 'POST',
      token,
      json: { content: content.trim() },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal mengirim komentar.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

/** Hapus komentar milik sendiri (atau admin). */
export async function deleteCommentAction(commentId: string): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/post-comments/${commentId}`, { method: 'DELETE', token });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menghapus komentar.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

/** Update komentar milik sendiri. */
export async function updateCommentAction(commentId: string, content: string): Promise<CommunityActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');
  if (!content.trim()) return err('Komentar tidak boleh kosong.');

  try {
    await apiFetch(`/post-comments/${commentId}`, {
      method: 'PATCH',
      token,
      json: { content: content.trim() },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal memperbarui komentar.');
  }

  revalidatePath('/community');
  return { error: null, success: true };
}

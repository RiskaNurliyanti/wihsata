'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api/client';
import { getServerToken } from '@/lib/api/session';

export interface BlogActionState {
  error: string | null;
  success: boolean;
}

const err = (error: string): BlogActionState => ({ error, success: false });

// ── Komentar artikel (semua user login) ────────────────────────────
// Catatan: parameter `articleSlug` — endpoint Laravel pakai route-model-binding
// by slug (Route::post('/articles/{article:slug}/comments', ...)), bukan UUID.

export async function createArticleCommentAction(articleSlug: string, content: string): Promise<BlogActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login untuk berkomentar.');
  if (!content.trim()) return err('Komentar tidak boleh kosong.');

  try {
    await apiFetch(`/articles/${articleSlug}/comments`, {
      method: 'POST',
      token,
      json: { content: content.trim() },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal mengirim komentar.');
  }

  revalidatePath('/blog');
  return { error: null, success: true };
}

export async function updateArticleCommentAction(commentId: string, content: string): Promise<BlogActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');
  if (!content.trim()) return err('Komentar tidak boleh kosong.');

  try {
    await apiFetch(`/article-comments/${commentId}`, {
      method: 'PATCH',
      token,
      json: { content: content.trim() },
    });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal memperbarui komentar.');
  }

  revalidatePath('/blog');
  return { error: null, success: true };
}

export async function deleteArticleCommentAction(commentId: string): Promise<BlogActionState> {
  const token = getServerToken();
  if (!token) return err('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/article-comments/${commentId}`, { method: 'DELETE', token });
  } catch (error) {
    if (error instanceof ApiError) return err(error.firstFieldError() ?? error.message);
    return err('Gagal menghapus komentar.');
  }

  revalidatePath('/blog');
  return { error: null, success: true };
}

// ── CRUD artikel — SEMUA user login boleh nulis. Pemilik/admin dijamin
// otorisasinya oleh ArticlePolicy di Laravel (bukan lagi dicek manual di sini).

export interface ArticleFormState {
  error: string | null;
  success: boolean;
}

function readArticleForm(formData: FormData) {
  return {
    title: (formData.get('title') as string)?.trim(),
    slug: (formData.get('slug') as string)?.trim(),
    excerpt: (formData.get('excerpt') as string)?.trim() || null,
    content: (formData.get('content') as string)?.trim(),
    category: (formData.get('category') as string)?.trim() || null,
    cover_image_url: (formData.get('cover_image_url') as string)?.trim() || null,
    is_published: formData.get('is_published') === 'on',
  };
}

export async function createArticleAction(_prev: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const token = getServerToken();
  if (!token) return { error: 'Silakan login terlebih dahulu.', success: false };

  const values = readArticleForm(formData);
  if (!values.title || !values.slug || !values.content) {
    return { error: 'Judul, slug, dan konten wajib diisi.', success: false };
  }

  try {
    await apiFetch('/articles', { method: 'POST', token, json: values });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message, success: false };
    return { error: 'Gagal membuat artikel.', success: false };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/blog/mine');
  return { error: null, success: true };
}

export async function updateArticleAction(
  articleSlug: string,
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const token = getServerToken();
  if (!token) return { error: 'Silakan login terlebih dahulu.', success: false };

  const values = readArticleForm(formData);

  try {
    await apiFetch(`/articles/${articleSlug}`, { method: 'PATCH', token, json: values });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.firstFieldError() ?? error.message, success: false };
    return { error: 'Gagal memperbarui artikel.', success: false };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/blog/mine');
  return { error: null, success: true };
}

export async function deleteArticleAction(articleSlug: string) {
  const token = getServerToken();
  if (!token) throw new Error('Silakan login terlebih dahulu.');

  try {
    await apiFetch(`/articles/${articleSlug}`, { method: 'DELETE', token });
  } catch (error) {
    throw new Error(error instanceof ApiError ? error.message : 'Gagal menghapus artikel.');
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/blog/mine');
}

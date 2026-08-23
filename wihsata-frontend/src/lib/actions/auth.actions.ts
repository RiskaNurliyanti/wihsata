'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { apiFetch, ApiError, TOKEN_COOKIE } from '@/lib/api/client';

export interface AuthActionState {
  error: string | null;
  /** Opsional — dipakai forgotPasswordAction untuk beri tahu form request berhasil terkirim (tanpa redirect). */
  success?: boolean;
}

function setTokenCookie(token: string) {
  // SameSite=lax, Secure di production — bukan httpOnly, lihat catatan di
  // src/lib/api/client.ts kenapa Client Component perlu baca cookie ini.
  cookies().set(TOKEN_COOKIE, token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
  });
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/my-trip';

  try {
    const res = await apiFetch<{ data: { token: string } }>('/auth/login', {
      method: 'POST',
      json: { email, password },
      skipAuth: true,
    });

    setTokenCookie(res.data.token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.firstFieldError() ?? error.message };
    }
    return { error: 'Gagal masuk. Coba lagi beberapa saat lagi.' };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function registerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  try {
    await apiFetch<{ data: { token: string } }>('/auth/register', {
      method: 'POST',
      json: {
        full_name: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      },
      skipAuth: true,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.firstFieldError() ?? error.message };
    }
    return { error: 'Gagal mendaftar. Coba lagi beberapa saat lagi.' };
  }

  revalidatePath('/', 'layout');
  redirect('/auth/login?registered=true');
}

export async function logoutAction() {
  const token = cookies().get(TOKEN_COOKIE)?.value;

  if (token) {
    try {
      await apiFetch('/auth/logout', { method: 'POST', token });
    } catch {
      // Token sudah tidak valid/expired — tetap lanjut hapus cookie di bawah.
    }
  }

  cookies().delete(TOKEN_COOKIE);
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email') as string;

  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      json: { email },
      skipAuth: true,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.firstFieldError() ?? error.message };
    }
    return { error: 'Gagal mengirim link reset. Coba lagi beberapa saat lagi.' };
  }

  return { error: null, success: true };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const token = formData.get('token') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  try {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      json: { token, email, password, password_confirmation: confirmPassword },
      skipAuth: true,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.firstFieldError() ?? error.message };
    }
    return { error: 'Gagal mereset password. Coba lagi beberapa saat lagi.' };
  }

  redirect('/auth/login?reset=true');
}
import { cookies } from 'next/headers';
import { apiFetch, ApiError, TOKEN_COOKIE } from './client';

export interface SessionUser {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  home_city: string | null;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
}

export interface SessionData {
  user: SessionUser;
  effective_tier: string;
  is_admin: boolean;
  is_super_admin: boolean;
}

/** Ambil token dari cookie request saat ini — dipakai Server Component/Action/Route Handler. */
export function getServerToken(): string | null {
  return cookies().get(TOKEN_COOKIE)?.value ?? null;
}

/**
 * Ambil sesi user saat ini dari Laravel (`GET /api/auth/me`). Return `null`
 * kalau belum login / token tidak valid — pola sama seperti
 * `supabase.auth.getUser()` yang sebelumnya dipakai di banyak Server
 * Component (admin/layout.tsx, profile/page.tsx, dll).
 */
export async function getSession(): Promise<SessionData | null> {
  const token = getServerToken();
  if (!token) return null;

  try {
    const res = await apiFetch<{ data: SessionData }>('/auth/me', { token });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

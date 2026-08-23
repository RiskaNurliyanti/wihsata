'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { Profile, SubscriptionTier } from '@/types/database.types';

export type UserRole = 'user' | 'admin' | 'super_admin';

interface CurrentProfileState {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  /** Role asli dari backend — dipakai buat bedakan Admin vs Super Admin di UI. */
  role: UserRole | null;
  /** Tier efektif — admin otomatis diperlakukan sebagai 'pro' tanpa perlu bayar. */
  effectiveTier: SubscriptionTier;
  isLoading: boolean;
}

const INITIAL_STATE: CurrentProfileState = {
  user: null,
  profile: null,
  role: null,
  effectiveTier: 'demo',
  isLoading: true,
};

interface MeResponse {
  data: {
    user: {
      id: string;
      full_name: string | null;
      username: string | null;
      email: string;
      avatar_url: string | null;
      bio: string | null;
      home_city: string | null;
      role: UserRole;
    };
    effective_tier: SubscriptionTier;
  };
}

/**
 * Hook client-side untuk mengambil data user + profile + tier efektif.
 * Admin selalu mendapat akses setara Pro secara gratis — lihat `effectiveTier`
 * (dihitung server-side oleh Laravel di endpoint `/auth/me`).
 *
 * `pathname` dimasukkan ke dependency array supaya status auth ter-refresh
 * setiap kali navigasi terjadi (termasuk redirect setelah login/logout),
 * karena redirect() dari Server Action adalah client-side transition dan
 * tidak me-remount komponen yang persist di root layout.
 */
export function useCurrentProfile() {
  const [state, setState] = useState<CurrentProfileState>(INITIAL_STATE);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await apiFetch<MeResponse>('/auth/me');

        if (!isMounted) return;

        const { user, effective_tier } = res.data;
        setState({
          user: { id: user.id, email: user.email },
          profile: {
            id: user.id,
            full_name: user.full_name,
            username: user.username,
            avatar_url: user.avatar_url,
            bio: user.bio,
            home_city: user.home_city,
            is_admin: user.role === 'admin' || user.role === 'super_admin',
            created_at: '',
            updated_at: '',
          },
          role: user.role,
          effectiveTier: effective_tier,
          isLoading: false,
        });
      } catch (error) {
        if (!isMounted) return;

        // Hanya 401 (token tidak valid/expired) yang dianggap logout — error
        // lain (jaringan, 5xx, CORS) mempertahankan status login terakhir
        // supaya tidak ada flicker seolah-olah logout saat request gagal sesaat.
        const isUnauthenticated = error instanceof ApiError && error.status === 401;

        if (!(error instanceof ApiError && (error.status === 401 || error.status === 403))) {
          console.error('useCurrentProfile: gagal memuat sesi/profil pengguna:', error);
        }

        setState((prev) =>
          isUnauthenticated ? { ...INITIAL_STATE, isLoading: false } : { ...prev, isLoading: false }
        );
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return state;
}

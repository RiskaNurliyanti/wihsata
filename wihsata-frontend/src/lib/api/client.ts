/**
 * Client HTTP ke Laravel API — pengganti Supabase client (Fase 5 migrasi).
 *
 * Auth model: LoginController/RegisterController Laravel mengembalikan
 * Sanctum token (`data.token`) langsung di body JSON — jadi frontend pakai
 * token-based auth (Authorization: Bearer), BUKAN cookie session Sanctum SPA.
 * Token disimpan di cookie bernama TOKEN_COOKIE. Cookie ini SENGAJA tidak
 * httpOnly supaya Client Component ('use client') bisa langsung memanggil
 * Laravel API tanpa perlu proxy Route Handler tambahan untuk setiap aksi
 * (favorit, review, like, komentar) — pola ini setara dengan Supabase
 * browser SDK sebelumnya yang juga menyimpan access token di sisi client.
 * Cookie tetap diset Secure + SameSite=Lax untuk mitigasi risiko standar.
 */

export const TOKEN_COOKIE = 'wihsata_token';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** Ambil pesan error field pertama — dipakai dipakai form yang cuma butuh 1 pesan ringkas. */
  firstFieldError(): string | null {
    if (!this.errors) return null;
    const firstKey = Object.keys(this.errors)[0];
    return firstKey ? this.errors[firstKey][0] : null;
  }
}

export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_LARAVEL_API_URL belum diset di .env');
  }
  return url.replace(/\/$/, '');
}

/** Baca token dari cookie — otomatis pilih cara sesuai environment (browser vs server). */
export function getClientToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setClientToken(token: string, maxAgeSeconds = 60 * 60 * 24 * 30) {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  invalidateGetCache();
}

export function clearClientToken() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  invalidateGetCache();
}

/**
 * Single-flight cache singkat (TTL 3 detik) untuk request GET — mencegah
 * beberapa komponen yang mount bersamaan (Navbar, komentar, dsb) memicu
 * request identik secara paralel. Request mutasi (POST/PATCH/DELETE)
 * tidak di-cache. Cache dibersihkan otomatis saat token berubah.
 */
const getCache = new Map<string, { promise: Promise<unknown>; timestamp: number }>();
const GET_CACHE_TTL_MS = 3000;

function invalidateGetCache() {
  getCache.clear();
}

type ApiFetchOptions = RequestInit & {
  token?: string | null;
  json?: unknown;
  /** Kirim tanpa token walau ada di cookie (dipakai endpoint publik). */
  skipAuth?: boolean;
};

/**
 * `RequestInit` penuh (bukan Omit<RequestInit, 'body'>) supaya `rest.body`
 * tetap tersedia sebagai fallback untuk request non-JSON seperti FormData.
 */
export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, json, skipAuth, headers, ...rest } = options;

  const resolvedToken = skipAuth ? null : token ?? getClientToken();
  const method = (rest.method ?? 'GET').toUpperCase();

  async function doFetch(): Promise<T> {
    const finalHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...(headers as Record<string, string> | undefined),
    };

    const res = await fetch(`${getApiUrl()}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
      cache: rest.cache ?? 'no-store',
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      throw new ApiError(
        payload?.message ?? `Request gagal (${res.status}).`,
        res.status,
        payload?.errors
      );
    }

    return payload as T;
  }

  // Hanya dedupe GET (aksi baca) — lihat catatan single-flight cache di atas.
  if (method === 'GET') {
    const cacheKey = `${resolvedToken ?? 'anon'}::${path}`;
    const cached = getCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < GET_CACHE_TTL_MS) {
      return cached.promise as Promise<T>;
    }

    const promise = doFetch().catch((err) => {
      // Jangan cache hasil GAGAL — supaya request berikutnya tetap retry fresh.
      getCache.delete(cacheKey);
      throw err;
    });

    getCache.set(cacheKey, { promise, timestamp: now });
    return promise;
  }

  return doFetch();
}
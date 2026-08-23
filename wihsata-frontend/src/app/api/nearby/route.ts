import { NextResponse } from 'next/server';
import { apiFetch, ApiError } from '@/lib/api/client';
import type { Destination } from '@/types/database.types';

export const runtime = 'nodejs';

/**
 * Proxy Next.js dipertahankan (hook `use-nearby-destinations.ts` memanggil
 * route lokal ini) tapi sekarang diteruskan ke Laravel
 * `GET /api/destinations/nearby` (PostGIS langsung), bukan lagi RPC Supabase.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const radiusKm = Number(searchParams.get('radius') ?? 25);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'Parameter lat dan lng wajib berupa angka.' }, { status: 400 });
  }

  try {
    const res = await apiFetch<{ data: Destination[] }>(
      `/destinations/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}&limit=50`,
      { skipAuth: true }
    );
    return NextResponse.json({ data: res.data });
  } catch (error) {
    console.error('Nearby proxy error:', error);
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json({ error: 'Gagal mengambil destinasi terdekat.' }, { status });
  }
}

import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { apiFetch, ApiError, TOKEN_COOKIE } from '@/lib/api/client';
import { ItineraryPdfDocument } from '@/lib/pdf/itinerary-document';
import type { AiPlannerOutput } from '@/types/database.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PdfRequestBody {
  title: string;
  itinerary: AiPlannerOutput;
  travelers_count?: number;
}

interface MeResponse {
  data: { effective_tier: 'demo' | 'pro'; is_admin: boolean };
}

/**
 * Generate PDF itinerary — fitur khusus tier Pro (admin otomatis dapat akses
 * gratis). Dipanggil dari tombol "Download PDF" baik di hasil AI Planner
 * maupun di kartu trip tersimpan.
 *
 * Fase 5: pengecekan sesi/tier sekarang lewat Laravel `/auth/me`, bukan lagi
 * Supabase. Isi PDF (itinerary) tetap dikirim langsung dari client di body
 * request — route ini tidak pernah query data trip, jadi tidak ada sumber
 * Supabase lain yang perlu diganti di sini.
 */
export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`))?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Anda harus login untuk mengunduh PDF.' }, { status: 401 });
  }

  let session: MeResponse['data'];
  try {
    const res = await apiFetch<MeResponse>('/auth/me', { token: decodeURIComponent(token) });
    session = res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json({ error: 'Sesi tidak valid. Silakan login kembali.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Gagal memverifikasi sesi.' }, { status: 502 });
  }

  if (!session.is_admin && session.effective_tier !== 'pro') {
    return NextResponse.json(
      { error: 'Download PDF adalah fitur Pro. Upgrade untuk membuka fitur ini.', code: 'PRO_REQUIRED' },
      { status: 403 }
    );
  }

  const body = (await request.json().catch(() => null)) as PdfRequestBody | null;
  if (!body?.itinerary || !body?.title) {
    return NextResponse.json({ error: 'Data itinerary tidak lengkap.' }, { status: 400 });
  }

  try {
    const pdfBuffer = await renderToBuffer(
      <ItineraryPdfDocument title={body.title} itinerary={body.itinerary} travelersCount={body.travelers_count} />
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="itinerary-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Gagal generate PDF itinerary:', error);
    return NextResponse.json({ error: 'Gagal membuat PDF. Coba lagi.' }, { status: 500 });
  }
}

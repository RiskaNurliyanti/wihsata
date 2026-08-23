import { NextResponse, type NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/api/client';

const PROTECTED_ROUTES = ['/my-trip', '/admin', '/community/new'];
const ADMIN_ONLY_ROUTES = ['/admin'];

/**
 * Fase 5: middleware tidak lagi memanggil Supabase (`updateSession`), cuma
 * cek keberadaan cookie token Laravel — tetap "fast-path" saja (tanpa query
 * DB/HTTP tambahan di edge runtime), sama seperti pola sebelumnya. Validasi
 * token yang lebih dalam (kadaluarsa, role admin) tetap dilakukan di
 * layout/page terkait lewat `getSession()` (lihat src/lib/api/session.ts),
 * persis seperti catatan lama soal pengecekan is_admin di admin/layout.tsx.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  void isAdminRoute;

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - _next/static, _next/image (asset Next.js)
     * - favicon.ico, robots.txt, sitemap.xml
     * - file statis (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

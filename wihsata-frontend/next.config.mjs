/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      // Wildcard https: form input di admin/profil/community menerima URL gambar
      // bebas (bukan file upload), jadi domain gambarnya tidak bisa diprediksi.
      // Next.js Image mewajibkan hostname terdaftar di remotePatterns, sehingga
      // tanpa wildcard ini gambar dari domain di luar daftar akan gagal render.
      { protocol: 'https', hostname: '**' },
      // FIX: hasil upload foto (fitur upload file) disajikan dari Laravel
      // APP_URL, yang di lingkungan LOCAL/DEV defaultnya
      // "http://localhost:8000" (http, bukan https). Tanpa baris ini, preview
      // foto yang baru diupload akan gagal render saat development karena
      // protocol http tidak match wildcard https di atas. Di production
      // (APP_URL sudah https) baris ini tidak pernah kepakai — aman.
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

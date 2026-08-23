# Wihsata — AI Travel Discovery & Itinerary Planner

Production-grade Next.js 14 (App Router) application untuk penemuan destinasi wisata dan perencanaan
itinerary otomatis berbasis AI.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript, React 18 |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| Data fetching | TanStack Query (client), Server Components (server) |
| Forms | React Hook Form + Zod |
| Database & Auth | Supabase (Postgres + PostGIS, Auth, Storage) |
| Peta | Leaflet + OpenStreetMap |
| AI | OpenRouter API (model dapat dikonfigurasi via env) |
| Geo services | Nominatim (reverse geocoding), Open-Meteo (cuaca), OSRM (rute) |
| Deploy | Netlify (via `@netlify/plugin-nextjs`) |

## 1. Setup Awal

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` dengan kredensial Supabase & OpenRouter Anda (lihat komentar di `.env.example`).

## 2. Setup Database Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Aktifkan extension **PostGIS** di Database → Extensions (dibutuhkan untuk query "Nearby").
3. Jalankan migration secara berurutan via SQL Editor Supabase:
   - `supabase/migrations/0001_init.sql` — schema, RLS policy, trigger, RPC `nearby_destinations`
   - `supabase/migrations/0002_seed.sql` — data contoh (kategori termasuk Danau/Pulau/dll, kabupaten, 2 destinasi Samarinda)
   - `supabase/migrations/0003_article_comments.sql` — tabel komentar blog + perbaikan policy moderasi admin
   - `supabase/migrations/0004_user_blog_crud.sql` — izinkan user biasa menulis/edit/hapus artikelnya sendiri

   **Catatan:** jika sebelumnya Anda sudah menjalankan `0001` dan `0002`, cukup jalankan `0003` dan `0004`
   secara berurutan (aman dijalankan ulang / idempotent) — tidak perlu mengulang dari awal.
4. Ambil `Project URL` dan `anon key` dari Settings → API, masukkan ke `.env.local`.
5. (Opsional) Jadikan akun Anda admin agar bisa akses `/admin`:
   ```sql
   update public.profiles set is_admin = true where id = '<UUID_USER_ANDA>';
   ```

## 3. Setup AI Planner (OpenRouter)

1. Daftar di [openrouter.ai](https://openrouter.ai) dan buat API key — **tidak perlu kartu kredit** untuk model gratis.
2. Set `OPENROUTER_API_KEY` di `.env.local`.
3. Model default sudah diarahkan ke model **gratis** (akhiran `:free`), lihat komentar di `.env.example`.
   Model gratis di OpenRouter berubah dari waktu ke waktu dan dibatasi rate limit (±20 req/menit,
   ±50-200 req/hari tanpa isi saldo). Cek daftar terkini di
   [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0) sebelum deploy.
4. Kalau butuh kualitas lebih stabil tanpa rate-limit ketat, isi saldo OpenRouter (mulai $5) dan ganti
   `OPENROUTER_MODEL` ke model berbayar seperti `anthropic/claude-3.5-sonnet` atau `openai/gpt-4o-mini`.

## Berapa Biaya Total untuk Menjalankan Ini?

Semua layanan yang dipakai punya **free tier**, jadi bisa dijalankan **Rp 0** untuk mulai — dengan catatan:

| Layanan | Batas gratis | Yang perlu diwaspadai |
|---|---|---|
| Supabase | 500MB DB, 1GB storage, 50rb MAU | Project auto-pause jika tidak ada traffic 7 hari berturut-turut |
| Netlify | 300 credit/bulan (±15GB bandwidth, ±20 deploy) | Situs berhenti sampai bulan berikutnya kalau credit habis |
| OpenRouter | Model `:free` tanpa biaya | Rate limit ±20 req/menit — cukup untuk testing/traffic kecil |
| Nominatim, Open-Meteo, OSM tiles | Gratis untuk traffic wajar | Ada batas request/detik, jangan disalahgunakan untuk traffic tinggi |

Kalau nanti traffic situs Anda besar, baru pertimbangkan upgrade Supabase Pro ($25/bln) dan/atau isi saldo
OpenRouter untuk model berbayar yang lebih stabil.

## 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 5. Deploy ke Netlify

1. Push project ini ke repository Git (GitHub/GitLab/Bitbucket).
2. Di Netlify: **Add new site → Import an existing project**, pilih repo ini.
3. Build settings sudah otomatis terbaca dari `netlify.toml` (`npm run build`, plugin Next.js sudah terpasang).
4. Tambahkan seluruh environment variable dari `.env.example` di Netlify → Site settings → Environment variables.
5. Deploy. Tidak perlu perubahan kode tambahan.

## Struktur Folder

```
src/
├── app/                    # Next.js App Router — routing & pages
│   ├── (halaman utama)     # /, /explore, /nearby, /ai-planner, /maps, /my-trip, /community, /blog, /pricing
│   ├── admin/               # Dashboard admin (guarded by is_admin)
│   ├── auth/                 # Login & register (Server Actions)
│   └── api/                  # Route Handlers: ai-planner, geocode, weather, nearby
├── components/
│   ├── ui/                  # Primitif shadcn/ui (button, card, dialog, dst.)
│   ├── layout/               # Navbar, Footer
│   ├── shared/                # Komponen lintas-halaman (DestinationCard, MapView, dst.)
│   ├── landing/                # Section landing page
│   ├── ai-planner/             # Form & hasil AI Planner
│   ├── explore/                 # Filter, hasil pencarian, review, maps explorer
│   ├── trip/                     # My Trip tabs
│   └── admin/                     # Komponen admin dashboard
├── lib/
│   ├── supabase/              # Client (browser/server/middleware)
│   ├── validations/            # Skema Zod
│   ├── actions/                  # Server Actions (auth, admin)
│   ├── openrouter.ts             # AI Planner integration
│   └── utils.ts                   # Helper (formatRupiah, slugify, dst.)
├── hooks/                    # Custom hooks (geolocation, nearby query, dst.)
└── types/                    # TypeScript types selaras dengan schema Supabase

supabase/migrations/          # SQL migration & seed data
```

## Status Implementasi

Bagian berikut **fungsional penuh** dan terhubung ke Supabase/OpenRouter secara nyata:
Home, Explore (+ detail, galeri foto carousel, review), Nearby (geolocation + PostGIS), AI Planner
(OpenRouter, rekomendasi multi-destinasi berdekatan ≤70km dari data nyata, quota Demo/Pro, admin dapat
akses Pro gratis), Download PDF itinerary bergambar, Maps, My Trip, Pricing (Demo vs Pro), Auth
(login/register via Server Actions), dark/light mode, edit profil + badge Admin/User, Community (CRUD
post + komentar oleh pemilik/admin), Blog (CRUD artikel oleh **user maupun admin** + komentar/diskusi),
Admin dashboard (stats, CRUD destinasi, CRUD kategori, CRUD blog, moderasi komunitas, kelola pengguna,
analitik dasar), middleware auth guard, error/not-found/loading states, SEO (sitemap, robots, metadata
dinamis).

Bagian berikut **scaffolded** dengan struktur & UI lengkap, namun perlu penyesuaian sebelum go-live:
- Pembayaran Pro di `/pricing` masih tombol statis — perlu integrasi payment gateway (Midtrans/Xendit) sesuai
  tabel `payments` yang sudah disiapkan di schema.
- Upload gambar (destinasi, community post, avatar) saat ini via **input URL**, belum upload file langsung
  ke Supabase Storage — cukup fungsional tapi kurang praktis untuk pengguna awam.
- Kalkulator Budget & Extra AI Tools (packing list, hidden gem finder) pada diagram awal belum dibangun.

## Catatan Keamanan

- Semua tabel Supabase dilindungi Row Level Security (RLS) — lihat kebijakan lengkap di `0001_init.sql`.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server (`createAdminClient()`) untuk operasi admin yang perlu bypass RLS — **jangan pernah** expose ke client.
- Middleware (`middleware.ts`) melindungi `/my-trip` dan `/admin` di edge sebelum request menyentuh halaman.

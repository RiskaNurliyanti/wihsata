# Fase 5 — Frontend pindah dari Supabase ke Laravel API (Selesai)

## Ringkasan
Seluruh pemanggilan Supabase di frontend Next.js sudah dipindah ke Laravel API,
**kecuali AI Planner** (`src/app/ai-planner/*`, `src/app/api/ai-planner/route.ts`,
`src/components/ai-planner/*`) yang sengaja **tidak disentuh** — itu scope Fase 6.

## Infrastruktur baru
- **`src/lib/api/client.ts`** — pengganti Supabase client. `apiFetch()` generik
  ke Laravel API, `ApiError` untuk error terstruktur (pesan + field errors),
  token disimpan di cookie `wihsata_token`.
- **`src/lib/api/session.ts`** — `getSession()`/`getServerToken()` untuk Server
  Component/Action, pengganti pola `supabase.auth.getUser()` + query profiles.
- **Model auth**: Laravel Sanctum token (Bearer), **bukan** cookie-session SPA.
  Token disimpan di cookie non-httpOnly (`wihsata_token`) supaya Client
  Component bisa langsung panggil Laravel API tanpa proxy Route Handler
  tambahan untuk tiap aksi (favorit, review, like, komentar) — trade-off yang
  didokumentasikan di komentar `client.ts`, levelnya setara dengan Supabase
  browser SDK sebelumnya (juga menyimpan token di sisi client).

## Yang dipindah
- **Semua `lib/actions/*.ts`**: auth, profile, trip, category, blog, community, admin.
- **Middleware** (`middleware.ts`): cek cookie token Laravel, bukan Supabase session.
- **Seluruh halaman admin** (dashboard, destinations, categories, trips, blog, users, community, analytics).
- **Seluruh halaman publik**: explore (list+detail), blog (list+detail+mine+write), community, maps, my-trip, homepage, profile, sitemap.
- **Komponen client**: navbar, save-trip-button, review-section, post-comments, blog-comments, community-feed, explore-results, use-current-profile.
- **API routes**: `api/nearby/route.ts` (proxy ke Laravel, bukan RPC Supabase lagi), `api/trips/pdf/route.tsx` (cek sesi/tier lewat Laravel `/auth/me`, konten PDF tetap dari body request seperti sebelumnya).

## Penyesuaian teknis penting
- **Route param berubah ke slug** di beberapa tempat karena Laravel route
  model binding pakai slug, bukan UUID: destinations (`/admin/destinations/[id]/edit`
  — nama param folder dipertahankan `id` tapi isinya slug), articles
  (`/admin/blog/[id]/edit`, `/blog/mine/[id]/edit`). Semua pemanggil (list
  page yang bikin link, `.bind()` ke Server Action) disesuaikan mengirim
  `.slug` bukan `.id`.
- **`profile` → `user`** di semua tipe relasi (`Review`, `PostComment`,
  `ArticleComment`, `CommunityPost`) di `types/database.types.ts`, menyesuaikan
  penamaan relasi Eloquent Laravel.
- **Komentar artikel** tidak punya endpoint list terpisah di Laravel (ikut
  termuat dalam response detail artikel) — `blog-comments.tsx` menyesuaikan
  dengan fetch `/articles/{slug}` dan ambil field `.comments`.

## Perbaikan/tambahan kecil di Laravel (minimal, diperlukan agar migrasi ini bisa selesai)
Django-style summary semua perubahan backend selama Fase 5:
1. `ArticleController::adminIndex()` + route `GET /admin/articles` — sebelumnya
   tidak ada endpoint admin untuk lihat semua artikel+draft dari semua penulis.
2. `TripController::show()` — tambah `loadMissing('user:id,full_name')`.
3. `AdminStatsController` (baru) + route `GET /admin/stats` — pengganti
   beberapa query count/agregat yang dulu langsung ke Supabase dari frontend
   (dipakai Dashboard & Analytics admin).
4. `DestinationController::index()` — tambah filter `is_featured` (dibutuhkan
   homepage untuk destinasi trending, sebelumnya belum ada).

Semua perubahan di atas murni **menambah endpoint/parameter baru**, tidak ada
yang mengubah/menghapus perilaku endpoint yang sudah ada sebelumnya.

## `src/lib/supabase/*` — status
- **`middleware.ts`**: dihapus (sudah genuinely tidak dipakai lagi oleh apa pun).
- **`client.ts`, `server.ts`**: **dipertahankan**, diberi komentar peringatan
  eksplisit bahwa hanya boleh dipakai AI Planner (Fase 6). Tidak dihapus
  karena `ai-planner/*` masih aktif menggunakannya — menghapusnya sekarang
  akan merusak fitur yang belum dimigrasi.

## Test yang dilakukan
1. **`tsc --noEmit`** — **lulus bersih** (cuma 1 warning deprecated `baseUrl`
   di `tsconfig.json`, sama persis dengan baseline sebelum migrasi dimulai,
   bukan error baru).
2. **ESLint** (`npx eslint src --ext .ts,.tsx`) — **lulus bersih**, 0 error/warning.
3. **Sanity check import**: dipastikan tidak ada file di luar `ai-planner/*`
   dan `lib/supabase/*` sendiri yang masih mengimpor `@/lib/supabase/*` atau
   memanggil `createClient()`/`createAdminClient()`.
4. **Cross-check kolom/field**: setiap response Laravel yang dikonsumsi
   (`{data: ...}`, nama relasi `user` vs `profile`, dsb.) dicocokkan manual
   terhadap kode Controller Laravel yang bersangkutan sebelum dipakai di frontend.
5. **`next build`**: **tidak bisa dijalankan** di sandbox ini — butuh
   binary native SWC yang harus di-download dari registry npm, sementara
   akses jaringan di sandbox dimatikan. Ini limitasi lingkungan (sama seperti
   PHP/Neon tidak tersedia untuk test Laravel), bukan indikasi masalah kode.
   **Jalankan `npm run build` di environment Anda** untuk validasi build
   production akhir sebelum deploy.

## Yang BELUM dikerjakan (sesuai batasan scope)
- **AI Planner** (`ai-planner/*`) — scope Fase 6, sengaja tidak disentuh.
- Halaman **forgot-password / reset-password** — backend Laravel sudah siap
  dari requirement sebelumnya, Server Actions (`forgotPasswordAction`,
  `resetPasswordAction`) sudah dibuat, tapi **UI page-nya belum pernah ada**
  di frontend (bukan hasil migrasi Supabase — genuinely fitur baru). Di luar
  scope "migrasi" Fase 5, perlu instruksi terpisah untuk dibuatkan halamannya.

## Cara test manual di environment Anda
```bash
cp .env.local.example .env.local   # pastikan NEXT_PUBLIC_LARAVEL_API_URL menunjuk ke Laravel API yang jalan
npm install
npm run build   # full production build (butuh network untuk SWC binary pertama kali)
npm run dev     # jalankan lalu test alur: login, explore, my-trip, admin, blog, community
```

## Status
Frontend sekarang 100% memakai Laravel API untuk semua fitur **kecuali AI
Planner**. Tidak ada migrasi setengah jadi — setiap file yang disentuh sudah
lulus type-check & lint, dan tidak ada import Supabase yang tertinggal di
luar cakupan yang sengaja dipertahankan untuk Fase 6.

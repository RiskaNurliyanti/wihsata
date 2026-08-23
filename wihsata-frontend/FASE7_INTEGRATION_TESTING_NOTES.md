# Fase 7 — Testing Integrasi Seluruh Aplikasi (Selesai — ZIP FINAL)

## Metode testing
Sandbox ini tidak punya PHP, PostgreSQL/Neon, atau akses network untuk
menjalankan Laravel + Next.js secara live dan saling memanggil sungguhan
(sama seperti keterbatasan di Fase 2–6). Jadi Fase 7 dilakukan sebagai
**audit integrasi statis menyeluruh**: mencocokkan setiap kontrak
frontend↔backend secara eksplisit, baris per baris, alih-alih hanya
percaya bahwa masing-masing sisi "terlihat benar" sendiri-sendiri.

## 1. Cross-check endpoint frontend ↔ route Laravel (100% dicek)
Semua pemanggilan `apiFetch(...)` di seluruh frontend (lib/actions, hooks,
components, pages, Next.js API routes) diekstrak lalu dicocokkan satu-satu
terhadap `routes/api.php` Laravel (termasuk prefix `/auth`, `/admin`, dan
middleware group yang membungkusnya).

**Hasil: 39 endpoint unik yang dipanggil frontend, 100% punya route Laravel
yang cocok** — path, method (GET/POST/PATCH/PUT/DELETE), dan posisi di dalam
middleware group (publik/login/admin/super_admin) semua konsisten. Tidak ada
endpoint hilang, salah ketik, atau method yang tidak cocok.

## 2. Temuan & perbaikan selama audit (celah integrasi nyata, bukan asumsi)

### a. API key OpenRouter tertinggal di frontend `.env.local`/`.env.example`
Sisa dari sebelum Fase 6 — sudah tidak dipakai kode manapun (AI Planner 100%
lewat Laravel sejak Fase 6), tapi key aslinya (bukan placeholder) masih ada
di `.env.local`. **Dihapus** dari kedua file frontend — key AI sekarang
betul-betul HANYA ada di `wihsata-api/.env.example`, sesuai aturan wajib.

### b. `src/app/api/geocode/route.ts` & `src/app/api/weather/route.ts` — dead code yang melanggar arsitektur
Dua route Next.js ini **masih memanggil Nominatim/Open-Meteo langsung**
(bukan lewat Laravel), padahal Laravel sudah punya `GeocodeController` /
`WeatherController` pengganti sejak Fase 4. Diperiksa lebih lanjut: **tidak
ada satu pun kode frontend yang memanggil kedua route ini** — fitur cuaca di
UI ternyata sudah digantikan `weather_note` yang di-generate AI Planner
sendiri, jadi kedua route ini murni sisa/dead code. **Dihapus**, sekaligus
membereskan pelanggaran arsitektur ("layanan eksternal harus lewat
Laravel") yang sempat lolos di Fase 4–5.

### c. Env var geo (`NEXT_PUBLIC_OSRM_URL`, `NEXT_PUBLIC_NOMINATIM_URL`, `NEXT_PUBLIC_OPEN_METEO_URL`) jadi dead config
Konsumen satu-satunya adalah 2 route yang baru dihapus di atas, dan
dikonfirmasi tidak ada komponen peta (`maps-explorer`, `map-view-dynamic`)
yang melakukan routing OSRM langsung dari client. **Dihapus** dari
`.env.local`/`.env.example` frontend.

### d. Komentar CORS Laravel menyesatkan
`config/cors.php` masih berkomentar "supaya cookie sesi Sanctum ikut
terkirim" — padahal keputusan arsitektur Fase 5 pakai **Bearer token**, bukan
cookie-session SPA (`apiFetch()` tidak pernah kirim `credentials: 'include'`).
Bukan bug fungsional, tapi dokumentasi yang salah bisa menyesatkan
maintenance berikutnya — **komentar diperbaiki** untuk mencerminkan
mekanisme auth yang sebenarnya dipakai.

## 3. Verifikasi konfigurasi auth lintas-sistem
- `User` model pakai `HasApiTokens` (Sanctum) — dikonfirmasi.
- `LoginController`/`RegisterController` benar-benar memanggil
  `$user->createToken(...)->plainTextToken` — dikonfirmasi token yang
  dikirim ke frontend valid dan bisa dipakai sebagai Bearer token.
- `SANCTUM_STATEFUL_DOMAINS` & `statefulApi()` dikonfirmasi **tidak
  mengganggu** jalur Bearer token (jalur cookie-session cuma opsi tambahan,
  bukan pengganti).
- `config('services.openrouter.key')`, `config('app.frontend_url')`, dan
  semua `config('services.*')` yang dipakai `OpenRouterService`/
  `GeocodingService`/`WeatherController`/`TravelTimeService` dikonfirmasi
  benar-benar terdaftar di `config/services.php` / `config/app.php` (tidak
  ada config key yang dipanggil tapi tidak pernah didefinisikan).

## 4. Verifikasi ketahanan data lintas-fase
- Migration baru Fase 6 (`road_time_multiplier`, `road_condition_note`,
  nullable) dikonfirmasi **tidak merusak** `ImportSupabaseData` command dari
  Fase 3 — command tidak menyentuh kolom itu sama sekali, jadi data hasil
  migrasi Supabase tetap aman diimpor, kolom baru otomatis NULL (default
  aman, sesuai desain).
- Total 15 migration Laravel dicek ulang: 0 masalah sintaks, 0 referensi FK
  ke tabel yang belum dibuat, 0 alter-table ke tabel yang tidak ada.

## 5. Test yang dijalankan (final)
| Test | Hasil |
|---|---|
| `tsc --noEmit` (frontend) | ✅ Bersih (cuma warning `baseUrl` deprecated, sama sejak baseline) |
| `eslint src` (frontend) | ✅ Bersih, 0 error/warning |
| Sintaks 84 file PHP (backend) | ✅ Semua valid |
| Endpoint frontend ↔ route Laravel | ✅ 39/39 cocok (path + method + auth level) |
| FK & alter-table 15 migration | ✅ Semua konsisten |
| `next build` | ⚠️ Tidak bisa dijalankan di sandbox ini (butuh network untuk binary SWC) — **wajib dijalankan di environment Anda** sebelum deploy |
| Live request Laravel↔Postgres↔Frontend sungguhan | ⚠️ Tidak bisa disimulasikan di sandbox ini (tidak ada PHP/Postgres/network) — **wajib di-test manual di environment Anda**, lihat checklist di bawah |

## 6. Checklist testing manual yang WAJIB dijalankan di environment Anda
Karena keterbatasan sandbox di atas, langkah berikut belum pernah benar-benar
dieksekusi sebagai request HTTP sungguhan — jalankan sebelum go-live:

```bash
# 1. Backend
cd wihsata-api
composer install
cp .env.example .env && php artisan key:generate
# isi DB_*, OPENROUTER_API_KEY, FRONTEND_URL di .env
php artisan migrate                          # jangan fresh/refresh
php artisan wihsata:import-supabase-data     # migrasi data (Fase 3)
php artisan serve

# 2. Frontend (terminal terpisah)
cd wihsata
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
npm run build   # WAJIB dites — belum pernah jalan di sandbox saya
npm run dev
```

**Alur yang perlu dites manual satu-satu:**
1. Register → Login → Logout → Lupa Password → Reset Password
2. Explore destinasi (list, filter, detail) → simpan favorit → tulis ulasan
3. AI Planner: isi form (termasuk pilih moda transportasi) → generate →
   cek field jarak/waktu tempuh muncul di hasil → simpan trip → download PDF
4. My Trip: lihat trip tersimpan, edit, hapus
5. Blog: tulis artikel → edit → lihat di /blog → komentar
6. Community: post → like → komentar → edit/hapus (termasuk sebagai admin)
7. Admin: dashboard stats, kelola destinasi/kategori/trip/user
   (aktif/nonaktifkan akun, ubah role — khusus Super Admin), moderasi
   komunitas & blog
8. Maps & Nearby: pastikan proxy `/api/nearby` Next.js → Laravel jalan

## Status
**Fase 7 selesai. Ini ZIP FINAL** — seluruh 7 fase migrasi Wihsata
(Supabase/Node.js → Laravel API → PostgreSQL/Neon, termasuk AI Planner)
sudah tuntas dari sisi kode. Supabase sumber **tidak pernah dihapus**
sepanjang proses. Testing runtime end-to-end sungguhan (checklist §6) perlu
dilakukan di environment Anda sebelum production.

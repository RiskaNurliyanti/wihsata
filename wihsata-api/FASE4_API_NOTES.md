# Fase 4 — Laravel API menggantikan Node.js/Supabase (Selesai)

## Audit awal
Sebagian besar API Laravel **sudah dibangun di sesi-sesi sebelumnya** (Auth,
Destinations, Categories, Districts, Trips, Articles, Community, Reviews,
Favorites, AI Planner, Admin/Super Admin management) — tidak diulang.

Yang genuinely masih kurang (dicek lewat perbandingan `routes/api.php` Laravel
vs `src/app/api/*/route.ts` Node) dan dikerjakan di fase ini:

## 1. Proxy Geocode & Weather (pengganti Node route)
- `GET /api/geocode?lat=&lon=` → `GeocodeController` (reverse geocoding via
  Nominatim, method baru `reverseGeocode()` ditambahkan ke `GeocodingService`
  yang sudah ada — dipakai bareng dengan geocoding AI Planner).
- `GET /api/weather?lat=&lon=` → `WeatherController` (proxy ke Open-Meteo).
- Kontrak response disamakan persis dengan Node lama: `{ data: {...} }` /
  `{ error: "..." }` — frontend tidak perlu ubah cara parsing.
- Tidak butuh API key (keduanya layanan publik gratis) — cuma dipindah supaya
  arsitektur tetap konsisten "Frontend → Laravel → (eksternal)".
- `nearby` **tidak dikerjakan ulang** — sudah ada & lengkap
  (`DestinationController@nearby`, pakai PostGIS langsung, bukan RPC Supabase).

## 2. `trips/pdf` — SENGAJA TIDAK dipindah ke Laravel
Route ini murni render PDF pakai `@react-pdf/renderer` (library React), bukan
soal akses data. Memindahkannya ke Laravel berarti membangun ulang generator
PDF dari nol pakai library PHP berbeda — di luar cakupan "ganti backend data",
dan berisiko redesign tampilan PDF (dilarang di requirement). **Tetap di
Next.js**, tapi nanti di Fase 5 datanya diambil dari Laravel API, bukan lagi
Supabase langsung.

## 3. Fitur baru: Aktifkan/Nonaktifkan Akun (requirement tambahan Super Admin)
Audit struktur existing dulu (role: user/admin/super_admin sudah ada,
tidak ada kolom status aktif) — ditambahkan minimal:
- Migration baru `add_is_active_to_users_table` (kolom `is_active boolean
  default true`) — **migration terpisah**, tidak mengubah migration
  `create_users_table` yang sudah dipakai data Fase 3, supaya aman dijalankan
  di database yang sudah berisi data (`php artisan migrate` biasa, tanpa fresh).
- `UserManagementController::updateStatus` — endpoint baru
  `PATCH /api/admin/users/{user}/status`, khusus Super Admin (proteksi sama
  seperti `updateRole`: middleware + Gate `manage-roles`), dengan pengaman
  "tidak bisa menonaktifkan diri sendiri kalau jadi tidak ada Super Admin
  aktif lain yang tersisa" (pola sama seperti proteksi role).
- Saat dinonaktifkan: semua token API aktif user tsb langsung dicabut
  (`$user->tokens()->delete()`), jadi sesi yang sedang berjalan pun terputus.
- `LoginController`: login ditolak untuk akun `is_active = false`.
- Middleware baru `EnsureUserIsActive` (alias `active`) dipasang di semua
  grup route yang butuh `auth:sanctum` — lapisan pengaman tambahan kalau ada
  token yang lolos tanpa lewat proses deactivate normal.

## Test yang dilakukan (statis, sandbox tanpa PHP/Neon)
- Sintaks semua file baru/diubah: kurung kurawal & parenthesis seimbang,
  `<?php` ada — **OK** (11 file dicek).
- Semua route di `routes/api.php` diverifikasi otomatis merujuk ke
  controller & method yang benar-benar ada (menangkap typo nama method) —
  **OK**, 47 pasangan Controller@method + 8 single-invoke controller, semua
  resolve.
- Migration baru dicek tidak duplikat kolom & tidak mengubah tabel yang belum
  pernah dibuat — **OK**. Total 14 migration, urutan FK tetap valid.
- Fixture data Fase 3 (`database/data-import/*.json`) dipastikan **tidak
  tersentuh** oleh perubahan Fase 4.
- *(Eksekusi `php artisan migrate` & tes endpoint HTTP sungguhan perlu
  dilakukan di environment Anda — sandbox ini tidak ada PHP/network ke Neon,
  sama seperti Fase 2 & 3.)*

## Cara test manual di environment Anda
```bash
php artisan migrate               # cuma nambah kolom is_active, aman & tidak fresh
php artisan route:list --path=api # pastikan /geocode, /weather, /admin/users/{user}/status muncul

# Contoh test cepat (butuh token Super Admin dari /auth/login):
curl -X PATCH /api/admin/users/{id}/status -H "Authorization: Bearer ..." -d "is_active=false"
curl "/api/geocode?lat=-0.49&lon=117.14"
curl "/api/weather?lat=-0.49&lon=117.14"
```

## Status
Backend Laravel sekarang menggantikan seluruh backend Node.js/Supabase untuk
data & layanan proxy. Belum ada perubahan di sisi frontend (masih pakai
Supabase langsung) — itu scope Fase 5.

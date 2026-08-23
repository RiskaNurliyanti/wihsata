# Fase 3 — Migrasi Data Supabase → PostgreSQL/Neon (Selesai)


## Keputusan mapping data
- **`auth.users` + `public.profiles` Supabase digabung** jadi 1 baris di tabel
  `users` Laravel (sesuai struktur Laravel yang sudah ada — 1 tabel users, bukan
  auth+profiles terpisah).
- **`is_admin` (boolean, Supabase) → `role`**: karena Supabase cuma punya 2 level
  (admin/bukan), 2 user yang ada (`is_admin = true` keduanya) dipetakan ke
  `role = 'admin'`, **bukan** `super_admin` — supaya tidak mengarang level akses
  yang tidak pernah ada di data aslinya. Akun Super Admin tetap dari
  `SuperAdminSeeder` yang sudah ada sebelumnya (email terpisah, tidak bentrok).
- **Password**: hash bcrypt asli dari Supabase (`$2a$10$...`) dipertahankan apa
  adanya — kompatibel dengan `Hash::check()` Laravel (bcrypt `$2a$/$2b$/$2y$` bisa
  saling diverifikasi). User **tidak perlu reset password**.
- **`facilities` / `gallery_urls`**: format array Postgres asli (`{a,b,"c d"}`)
  dikonversi ke JSON array biasa (`["a","b","c d"]`) supaya cocok dengan kolom
  `jsonb` di migration Laravel.
- **`categories` / `districts`**: sumber Supabase cuma punya `created_at` (tanpa
  `updated_at`), sedangkan tabel Laravel punya keduanya (`timestamps()`) —
  `updated_at` diisi sama dengan `created_at` untuk data hasil migrasi.
- Tabel `trip_destinations` & `payments` tetap tidak diisi (sudah diputuskan di
  Fase 2 — tidak dipakai frontend, tidak ada datanya di dump).

## Keamanan / idempotensi
- Command pakai `DB::table()->updateOrInsert()` (query builder mentah), **bukan**
  Eloquent `updateOrCreate()`. Ini sengaja: model `Category`/`District`/
  `Subscription`/`Trip`/`User` tidak mendaftarkan `id` di `$fillable`, jadi kalau
  pakai Eloquent, ID asli dari Supabase akan **diam-diam diganti UUID baru** saat
  insert pertama (melanggar aturan "pertahankan ID"). Query builder mentah
  memastikan ID asli dipakai persis.
- **Idempotent**: aman dijalankan ulang — `updateOrInsert` mencocokkan berdasar
  `id` asli, tidak akan membuat duplikat.
- **Tidak pernah** memanggil `migrate:fresh`, `migrate:refresh`, `db:wipe`, atau
  `DELETE` apa pun. Tidak menyentuh/menghapus Supabase (sumbernya cuma file SQL
  statis yang dibaca sekali secara offline).
- Ada mode `--dry-run` (lihat ringkasan tanpa menulis) dan `--only=<tabel>`
  (import 1 tabel saja).
- Verifikasi otomatis di akhir: command mengecek **setiap ID** dari fixture
  benar-benar ada di DB setelah import (bukan cuma total count tabel — supaya
  tetap valid walau tabel sudah ada data lain).

## ⚠️ Peringatan penting: JANGAN jalankan `CategorySeeder` / `db:seed` biasa setelah import ini
`database/seeders/CategorySeeder.php` (sudah ada sebelumnya, bukan buatan fase
ini) berisi **12 kategori generik** yang berbeda dari 9 kategori asli Wihsata —
6 di antaranya beririsan slug (aman, `firstOrCreate` akan skip), tapi 6 lainnya
(`Danau`, `Pulau`, `Desa Wisata`, `Camping & Outdoor`, `Waterpark & Kolam`,
`Belanja & Oleh-oleh`) **tidak ada di data real Wihsata** dan akan ikut
ter-seed kalau `CategorySeeder`/`DatabaseSeeder` dijalankan setelah data asli
masuk. Untuk fase ini: **jangan jalankan** `php artisan db:seed` atau
`php artisan db:seed --class=CategorySeeder` di database yang sudah diisi data
migrasi. Kalau perlu bootstrap akun Super Admin, jalankan khusus:
`php artisan db:seed --class=SuperAdminSeeder` (aman, tidak menyentuh kategori).

## Cara menjalankan (di environment Anda — sandbox saya tidak ada PHP/network ke Neon)
```bash
# 1. Cek dulu tanpa menulis apa pun
php artisan wihsata:import-supabase-data --dry-run

# 2. Jalankan sungguhan
php artisan wihsata:import-supabase-data

# 3. (opsional) Verifikasi ulang / import 1 tabel saja
php artisan wihsata:import-supabase-data --only=trips
```
Command otomatis menampilkan ringkasan verifikasi (fixture vs DB) di akhir —
pastikan semua baris `OK` sebelum lanjut ke fase berikutnya.

## Test yang sudah dilakukan di sandbox ini (tanpa PHP/DB, statis)
- **Parser SQL** diuji ulang setelah ditemukan & diperbaiki bug (titik-koma di
  dalam teks JSON memotong hasil parse trips dari 4 baris jadi 1 baris — sudah
  diperbaiki jadi character-level scanner, hasil re-test: 4/4 baris benar).
- **Integritas data fixture**: 0 ID duplikat, semua `category_id`/`district_id`/
  `user_id`/`created_by` di `destinations`/`subscriptions`/`trips` merujuk ID
  yang benar-benar ada di fixture terkait, field wajib (email/password/role)
  terisi, `role` cuma berisi nilai valid (`user`/`admin`/`super_admin`).
- **Konsistensi nama kolom**: semua key JSON yang dipakai di
  `ImportSupabaseData.php` dicocokkan otomatis terhadap kolom asli di migration
  Laravel (`users`, `destinations`, `trips`, `categories`, `districts`,
  `subscriptions`) — semua cocok persis.
- **Sintaks PHP**: cek terstruktur (kurung kurawal seimbang, `<?php` ada,
  method `handle()` ada) — tidak ada masalah. *(Tidak ada interpreter PHP di
  sandbox ini untuk `php artisan` sungguhan — jalankan langkah "Cara
  menjalankan" di atas pada environment Anda untuk uji end-to-end final.)*



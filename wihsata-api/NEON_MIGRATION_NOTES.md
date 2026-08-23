# Fase 2 — Struktur PostgreSQL/Neon (Catatan)

## Hasil Review
Migration Laravel (`database/migrations/*.php`) sudah **lengkap dan setara** dengan
schema Supabase (`supabase/migrations/0001_init.sql` s.d. `0009_expand_districts.sql`)
untuk semua tabel yang **aktif dipakai frontend**:

users, categories, districts, destinations (+PostGIS geo_location, pg_trgm),
trips, articles, article_comments, community_posts, post_likes, post_comments,
reviews, favorites, subscriptions.

Urutan foreign key antar migration sudah diverifikasi otomatis (skrip cek FK) — tidak ada
tabel yang dirujuk sebelum dibuat.

Trigger Supabase juga sudah ada padanannya di kode Laravel (bukan trigger DB, tapi Eloquent
model event — fungsinya sama):
- `handle_new_user` (auto-buat subscription demo) → `User::booted()` di `app/Models/User.php`.
- `recompute_destination_rating` → `Review::booted()` di `app/Models/Review.php`.

**Tidak ada perubahan pada file migration** karena sudah sesuai kebutuhan.

## Tabel Supabase yang SENGAJA tidak dibuat di Laravel
Dua tabel ada di schema Supabase tapi **tidak dipakai frontend sama sekali** (tidak ada
referensi di kode Next.js) dan **tidak ada datanya** di backup (`full-backup.sql` /
`backup-data.sql`):
- `trip_destinations` (itinerary tersimpan sebagai jsonb di `trips.itinerary`, tabel ini legacy/tidak dipakai)
- `payments` (fitur pembayaran belum dibangun)

Tidak dibuat dulu supaya tidak mengerjakan fitur di luar cakupan migrasi. Bisa ditambahkan
lewat migration baru kapan pun kalau dibutuhkan nanti — tanpa risiko ke data yang sudah ada.

RLS policy Supabase tidak perlu dipindahkan — otorisasi di Laravel sudah ditangani lewat
Sanctum + `role:` middleware + Policy (setara secara fungsi).

## Konfigurasi Neon
File `.env.neon.example` disiapkan — isi kredensial asli Neon Anda sendiri (jangan commit).
Poin penting:
- `DB_SSLMODE=require` wajib untuk Neon.
- Gunakan **direct connection** (bukan pooled/pgbouncer) saat menjalankan `artisan migrate`,
  karena beberapa DDL/extension lebih stabil di direct connection.
- Extension `postgis` dan `pg_trgm` **didukung Neon**, tapi harus dipastikan aktif di project
  Anda. Kalau `CREATE EXTENSION IF NOT EXISTS postgis;` di migration gagal, jalankan manual dulu
  lewat Neon SQL Editor: `CREATE EXTENSION postgis; CREATE EXTENSION pg_trgm;`

## Cara menerapkan struktur ke Neon (dijalankan sendiri oleh Anda)
Saya tidak punya akses network/PHP di sandbox ini untuk connect ke Neon, jadi langkah ini
perlu dijalankan di environment Anda:

```bash
cp .env.neon.example .env   # lalu isi kredensial asli
php artisan config:clear

# WAJIB: cek dulu SQL yang akan dijalankan, TANPA mengeksekusi apa pun
php artisan migrate --pretend

# Kalau sudah yakin aman (DB Neon masih kosong / belum ada tabel bentrok):
php artisan migrate
```

**Perintah yang TIDAK BOLEH dijalankan** (sesuai aturan): `migrate:fresh`,
`migrate:refresh`, `db:wipe`. Skrip di atas hanya memakai `migrate` biasa yang bersifat
menambah, bukan menghapus.

## Status
Struktur migration Laravel sudah siap dipakai untuk Neon. Data belum dipindahkan — itu
scope Fase 3.

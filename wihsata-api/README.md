# Wihsata API (Laravel)

Backend baru untuk Wihsata, menggantikan Supabase secara bertahap. **Tahap ini baru mencakup
modul Auth + Role Management** (Register, Login, Logout, Lupa Password, dan sistem role
User/Admin/Super Admin). Modul lain (Destinasi, Blog, Komunitas, Trip, AI Planner, dll) masih
berjalan di Supabase untuk sekarang dan akan dimigrasikan menyusul.

## Struktur Role

| Role | Bisa apa |
|---|---|
| `user` | Pengguna biasa. Akses fitur Pro tergantung status langganan (modul subscription menyusul). |
| `admin` | Akses semua fitur termasuk fitur Pro **gratis**. Bisa kelola konten. |
| `super_admin` | Sama seperti admin, **plus** bisa mengubah role pengguna lain (menaikkan/menurunkan jadi admin). |

Role baru **tidak bisa** diset lewat form registrasi publik — selalu default `user`. Hanya
Super Admin yang bisa menaikkan role lewat endpoint `/api/admin/users/{id}/role`.

## 1. Instalasi Lokal

Butuh PHP 8.2+, Composer, dan PostgreSQL terpasang di komputer Anda.

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`, isi minimal:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — kredensial Postgres lokal Anda
- `FRONTEND_URL` — URL Next.js Anda (`http://localhost:3000` untuk development)
- `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- Kredensial SMTP untuk fitur Lupa Password (lihat bagian Email di bawah)

Lalu jalankan migration + seeder Super Admin pertama:

```bash
php artisan migrate
SUPER_ADMIN_EMAIL=nucaaeon@gmail.com SUPER_ADMIN_PASSWORD="Acun12345" php artisan db:seed --class=SuperAdminSeeder
```

Jalankan server:

```bash
php artisan serve
```

API akan jalan di `http://localhost:8000`.

## 2. Setup Email (dibutuhkan untuk fitur Lupa Password)

Untuk **development**, pakai [Mailpit](https://github.com/axllent/mailpit) (gratis, jalan lokal) atau
[Mailtrap](https://mailtrap.io) (gratis, berbasis cloud) — isi `MAIL_HOST`, `MAIL_PORT`,
`MAIL_USERNAME`, `MAIL_PASSWORD` sesuai kredensial mereka.

Untuk **production**, pakai layanan seperti [Resend](https://resend.com) (gratis 100 email/hari) atau
Postmark — ganti `MAIL_MAILER` sesuai dokumentasi mereka.

## 3. Deploy ke Railway (rekomendasi untuk pemula)

1. Daftar di [railway.app](https://railway.app), login pakai GitHub.
2. Push folder `wihsata-api` ini ke repo GitHub terpisah (jangan digabung dengan repo Next.js).
3. Railway → **New Project** → **Deploy from GitHub repo** → pilih repo `wihsata-api`.
4. Railway akan otomatis deteksi ini project PHP/Laravel (via Nixpacks) dan build otomatis.
5. Klik **+ New** → **Database** → **PostgreSQL** untuk tambah database — Railway otomatis
   generate environment variable `DATABASE_URL` yang bisa Anda pakai untuk isi `DB_*` di service Laravel.
6. Di service Laravel Anda, buka tab **Variables**, isi semua variable dari `.env.example` (termasuk
   `APP_KEY` — generate dulu via `php artisan key:generate --show` di lokal, copy hasilnya).
7. Set `FRONTEND_URL` ke domain Netlify Next.js Anda, mis. `https://wihsata.netlify.app`.
8. Setelah deploy sukses, jalankan migration via Railway's **Shell** tab:
   ```bash
   php artisan migrate --force
   php artisan db:seed --class=SuperAdminSeeder --force
   ```
9. Railway kasih Anda domain publik (mis. `https://wihsata-api.up.railway.app`) — ini yang dipakai
   sebagai `NEXT_PUBLIC_API_URL` di project Next.js Anda.

## 4. Yang Perlu Diubah di Sisi Next.js

Lihat panduan integrasi terpisah yang saya kasih — intinya:
- Ganti semua pemanggilan Supabase Auth (`supabase.auth.*`) jadi memanggil endpoint Laravel ini.
- Field baru env: `NEXT_PUBLIC_API_URL=https://domain-laravel-anda.com`.
- Halaman baru: `/auth/forgot-password` dan `/auth/reset-password` (belum ada sebelumnya di Supabase-only version).

## 5. Testing Endpoint (pakai curl/Postman)

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Lihat profil (pakai token dari hasil login)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN_DARI_LOGIN"

# Lupa password
curl -X POST http://localhost:8000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```



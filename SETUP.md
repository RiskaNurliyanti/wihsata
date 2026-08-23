# Wihsata

Platform rekomendasi & perencana perjalanan wisata dengan AI Planner.

## Struktur Proyek

```
wihsata-api/        Laravel 11 REST API
wihsata-frontend/   Next.js 14 (App Router)
```

## Persyaratan

- PHP 8.2+
- Composer
- Node.js 20+
- PostgreSQL (atau kompatibel, mis. Neon)

## Setup Backend (`wihsata-api`)

```bash
cd wihsata-api
composer install
cp .env.example .env
php artisan key:generate
```

Isi `.env`:

| Variabel | Keterangan |
|---|---|
| `DB_URL` atau `DB_HOST`/`DB_DATABASE`/dst | Koneksi PostgreSQL |
| `OPENROUTER_API_KEY` | API key dari [openrouter.ai](https://openrouter.ai) (wajib untuk AI Planner) |
| `FRONTEND_URL` | Domain frontend, untuk CORS |
| `UPLOAD_DISK` | `public` (lokal) atau `b2` (Backblaze B2, lihat bagian Storage) |

Jalankan migration & seeder:

```bash
php artisan migrate
php artisan db:seed
```

Jalankan server:

```bash
php artisan serve
```

## Setup Frontend (`wihsata-frontend`)

```bash
cd wihsata-frontend
npm install
cp .env.example .env.local
```

Isi `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Jalankan:

```bash
npm run dev
```

## Storage Upload Foto (opsional)

Default menyimpan file ke disk lokal. Untuk hosting dengan filesystem ephemeral (Render, Railway, dll), gunakan storage eksternal S3-compatible:

```bash
composer require league/flysystem-aws-s3-v3
```

Pilih salah satu:
- **Supabase Storage** — gratis, tanpa kartu kredit. Isi `SUPABASE_S3_*` di `.env`, lalu set `UPLOAD_DISK=supabase`.
- **Backblaze B2** — gratis 10GB, tapi wajib kartu kredit untuk bucket publik. Isi `B2_*` di `.env`, lalu set `UPLOAD_DISK=b2`.

Untuk memindahkan file yang sudah terlanjur tersimpan di disk lokal:

```bash
php artisan wihsata:migrate-uploads-to-b2 --dry-run
php artisan wihsata:migrate-uploads-to-b2
```

## Perintah Berguna

```bash
# Backend
php artisan test              # Testing
php artisan migrate:status    # Cek status migration

# Frontend
npm run lint                  # ESLint
npm run build                 # Build production
```

## Deployment

Panduan deploy gratis (Netlify + Render + Neon + Backblaze B2) tersedia di `DEPLOYMENT.md`.

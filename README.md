

Struktur folder:
```
wihsata/
├── wihsata-frontend/   → Next.js (frontend, konsumsi Laravel API)
└── wihsata-api/        → Laravel (backend/API utama + AI Planner)
```

## Cara jalankan

### 1. Backend (wihsata-api/)
```bash
cd wihsata-api
composer install
cp .env.example .env && php artisan key:generate
# isi DB_*, OPENROUTER_API_KEY, FRONTEND_URL di .env
php artisan migrate                          # jangan fresh/refresh
php artisan wihsata:import-supabase-data     # migrasi data dari Supabase (Fase 3)
php artisan serve                             # http://localhost:8000
```

### 2. Frontend (wihsata-frontend/)
```bash
cd wihsata-frontend
npm install
cp .env.local.example .env.local
# pastikan NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
npm run build
npm run dev                                   # http://localhost:3000
```

## Dokumentasi tiap fase
Ada di masing-masing folder proyek: `FASE1` s.d. `FASE7_*.md`.
`FASE7_INTEGRATION_TESTING_NOTES.md` berisi checklist testing manual
end-to-end yang wajib dijalankan sebelum production.

## AI Planner — model yang dipakai
Default: **OpenRouter** dengan model **NVIDIA Nemotron** (gratis, ada rate
limit ~20 req/menit). Bukan OpenAI. Bisa diganti model lain (termasuk model
OpenAI berbayar) lewat env `OPENROUTER_MODEL` di `wihsata-api/.env` — tidak
perlu ubah kode.

## Aturan yang dijaga sepanjang migrasi
- Supabase sumber **tidak pernah dihapus** (data asli tetap ada sebagai cadangan).
- Tidak pernah `migrate:fresh` / `migrate:refresh` / `db:wipe`.
- ID & relasi data dipertahankan.

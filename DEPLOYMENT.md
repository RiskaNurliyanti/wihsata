# Panduan Deploy Wihsata (Gratis)

Arsitektur: **Netlify** (frontend Next.js) + **Render** (backend Laravel API) + **Neon** (database Postgres) + **Backblaze B2** (storage foto, opsional tapi disarankan).

Semua langkah di bawah bisa dikerjakan tanpa kartu kredit, kecuali disebutkan lain.

---

## 0. Urutan pengerjaan

Kerjakan **berurutan** — tiap tahap butuh hasil dari tahap sebelumnya:

1. Neon (database) → dapatkan connection string
2. Backblaze B2 (storage foto) → dapatkan 5 credential — **opsional, bisa dilewati dulu**
3. Render (backend Laravel) → butuh connection string Neon + credential B2
4. Netlify (frontend Next.js) → butuh URL backend Render

---

## 1. Setup Neon (Database)

1. Daftar di [neon.tech](https://neon.tech) (bisa pakai akun GitHub)
2. Buat project baru, pilih region terdekat (Singapore kalau ada)
3. Di dashboard project, klik **Connection String** → copy yang formatnya:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
   ```
4. Simpan ini — dipakai di langkah 3 sebagai `DB_URL`

---

## 2. Setup Storage Foto — opsional tapi disarankan

> Kalau dilewati dulu: foto yang diupload lewat aplikasi akan **hilang setiap Render redeploy**. Aman untuk coba-coba awal, tapi wajib disetup sebelum dipakai serius.

Ada 2 pilihan — pakai salah satu:

### Opsi A: Supabase Storage (tanpa kartu kredit sama sekali)

1. Daftar di [supabase.com](https://supabase.com) — gratis, tanpa kartu kredit, 1GB storage
2. Buat project baru
3. Menu **Storage** → buat bucket baru, set **Public**
4. Menu **Project Settings → Data API → S3 Connection** — catat:

   | Variabel | Cara dapat |
   |---|---|
   | `SUPABASE_S3_ACCESS_KEY_ID` & `SUPABASE_S3_SECRET_ACCESS_KEY` | Generate di halaman S3 Connection |
   | `SUPABASE_S3_BUCKET` | Nama bucket yang tadi dibuat |
   | `SUPABASE_S3_REGION` | Tertera di halaman yang sama |
   | `SUPABASE_S3_ENDPOINT` | `https://<project-ref>.supabase.co/storage/v1/s3` |
   | `SUPABASE_S3_URL` | `https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>` |

5. Set `UPLOAD_DISK=supabase` di env Render (langkah 3)

### Opsi B: Backblaze B2 (10GB gratis, tapi wajib kartu kredit untuk bucket publik)

> Backblaze mewajibkan kartu kredit/riwayat pembayaran khusus saat membuat **bucket publik** (bukan untuk daftar akun) — anti-abuse policy mereka. Kalau tidak mau input kartu sama sekali, pakai Opsi A di atas.

1. Daftar di [backblaze.com/sign-up/cloud-storage](https://backblaze.com/sign-up/cloud-storage)
2. Buat **Bucket** baru:
   - Nama bebas (harus unik secara global, mis. `wihsata-uploads-namaanda`)
   - **Files in Bucket are: Public** (di sinilah kartu kredit diminta)
3. Catat 5 nilai berikut (dipakai di langkah 3):

   | Variabel | Cara dapat |
   |---|---|
   | `B2_BUCKET` | Nama bucket yang tadi dibuat |
   | `B2_ACCESS_KEY_ID` & `B2_SECRET_ACCESS_KEY` | Menu **App Keys** → **Add a New Application Key** → catat KeyID & Application Key (Application Key cuma ditampilkan sekali, langsung copy) |
   | `B2_ENDPOINT` | Buka halaman detail bucket, ada field "Endpoint" (mis. `s3.us-west-004.backblazeb2.com`) — tambahkan `https://` di depannya |
   | `B2_REGION` | Bagian tengah endpoint (mis. `us-west-004`) |
   | `B2_URL` | Field "Friendly URL" di halaman bucket, formatnya `https://f004.backblazeb2.com/file/NAMA_BUCKET` |

---

## 3. Setup Render (Backend Laravel API)

1. Push kode `wihsata-api` ke GitHub repo (kalau belum)
2. Daftar/login [render.com](https://render.com) — tanpa kartu kredit untuk tier gratis
3. **New +** → **Web Service** → connect repo `wihsata-api`
4. Isi konfigurasi:
   - **Environment**: `PHP`
   - **Build Command**:
     ```
     composer install --no-dev --optimize-autoloader --no-interaction
     ```
   - **Start Command**:
     ```
     php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Free
5. Generate `APP_KEY` dulu di komputer lokal Anda (kalau sudah punya Laravel jalan lokal):
   ```
   php artisan key:generate --show
   ```
   Copy hasilnya (formatnya `base64:xxxxxxxx...`)
6. Di tab **Environment** Render, tambahkan semua env var ini:

   ```dotenv
   APP_NAME=Wihsata
   APP_ENV=production
   APP_KEY=<hasil key:generate tadi>
   APP_DEBUG=false
   APP_TIMEZONE=Asia/Jakarta
   APP_URL=https://nama-app-anda.onrender.com

   FRONTEND_URL=https://nama-app-anda.netlify.app
   SANCTUM_STATEFUL_DOMAINS=nama-app-anda.netlify.app

   APP_LOCALE=id
   APP_FALLBACK_LOCALE=en
   LOG_CHANNEL=stack
   LOG_LEVEL=error

   DB_CONNECTION=pgsql
   DB_URL=<connection string dari Neon, langkah 1>
   DB_SSLMODE=require

   SESSION_DRIVER=cookie
   SESSION_LIFETIME=120
   SESSION_DOMAIN=null
   SESSION_SECURE_COOKIE=true

   CACHE_STORE=database
   QUEUE_CONNECTION=database

   OPENROUTER_API_KEY=<API key dari openrouter.ai>
   OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free

   NOMINATIM_URL=https://nominatim.openstreetmap.org
   OPEN_METEO_URL=https://api.open-meteo.com/v1
   OSRM_URL=https://router.project-osrm.org

   # Kalau sudah setup B2 (langkah 2) — kalau belum, biarkan UPLOAD_DISK=public
   UPLOAD_DISK=b2
   B2_ACCESS_KEY_ID=<dari langkah 2>
   B2_SECRET_ACCESS_KEY=<dari langkah 2>
   B2_BUCKET=<dari langkah 2>
   B2_ENDPOINT=<dari langkah 2>
   B2_REGION=<dari langkah 2>
   B2_URL=<dari langkah 2>
   ```

7. Kalau pakai B2, tambahkan dulu package-nya sebelum deploy (jalankan lokal, commit hasilnya):
   ```bash
   cd wihsata-api
   composer require league/flysystem-aws-s3-v3
   git add composer.json composer.lock
   git commit -m "Add S3 driver for Backblaze B2"
   git push
   ```
8. Klik **Create Web Service** — Render akan build & deploy otomatis. Tunggu sampai status **Live**.
9. Test: buka `https://nama-app-anda.onrender.com/api/maintenance-status` di browser — harusnya muncul JSON, bukan error.

### Cegah cold start (tier gratis Render tidur setelah 15 menit idle)

1. Daftar gratis di [cron-job.org](https://cron-job.org)
2. Buat cron job baru: URL `https://nama-app-anda.onrender.com/api/maintenance-status`, interval tiap **10 menit**
3. Ini bikin server Anda selalu "bangun", jadi tidak ada delay 30-60 detik pas user pertama buka web

### Isi data awal (kategori, kota, super admin)

Di Render dashboard → tab **Shell** (kalau tersedia di plan Anda) atau lewat **Job**:
```bash
php artisan db:seed
```
Ini menjalankan `SuperAdminSeeder` → `CategorySeeder` → `DestinationSeeder` sekaligus (sudah didaftarkan di `DatabaseSeeder.php`).

---

## 4. Setup Netlify (Frontend Next.js)

1. Push kode `wihsata-frontend` ke GitHub repo (kalau belum, bisa 1 repo sama dengan backend atau terpisah)
2. Daftar/login [netlify.com](https://netlify.com)
3. **Add new site** → **Import an existing project** → connect repo, pilih folder `wihsata-frontend` sebagai base directory (kalau 1 repo gabungan)
4. Build settings (biasanya auto-detect Next.js):
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Di **Site settings → Environment variables**, tambahkan:
   ```dotenv
   NEXT_PUBLIC_API_URL=https://nama-app-anda.onrender.com/api
   ```
6. Deploy. Setelah selesai, copy domain Netlify Anda (mis. `nama-app-anda.netlify.app`)
7. **Balik lagi ke Render** → update env var `FRONTEND_URL` dan `SANCTUM_STATEFUL_DOMAINS` dengan domain Netlify yang baru jadi ini (kalau tadi masih placeholder) → save, Render akan redeploy otomatis

---

## 5. Migrasi foto lama (kalau sebelumnya sempat upload sebelum setup B2)

```bash
php artisan wihsata:migrate-uploads-to-b2 --dry-run   # preview dulu
php artisan wihsata:migrate-uploads-to-b2             # eksekusi
```

---

## 6. Checklist verifikasi akhir

- [ ] `https://domain-render-anda.onrender.com/api/maintenance-status` bisa diakses, tidak error
- [ ] Buka frontend Netlify, coba register/login
- [ ] Coba AI Planner generate itinerary (test OpenRouter connection)
- [ ] Coba upload foto (destinasi/komunitas), refresh halaman, foto masih ada
- [ ] Redeploy backend sekali (push commit kosong), cek foto yang tadi diupload **masih ada** (bukti B2 jalan, bukan disk lokal)
- [ ] Login sebagai admin (dari `SuperAdminSeeder`), cek panel admin bisa diakses

---

## Troubleshooting cepat

| Gejala | Kemungkinan penyebab |
|---|---|
| Frontend tidak bisa fetch data / CORS error | `FRONTEND_URL` di Render belum sesuai domain Netlify asli |
| Login gagal terus / sesi tidak tersimpan | `SANCTUM_STATEFUL_DOMAINS` salah format (jangan pakai `https://`, cuma domain polos) |
| AI Planner error terus | Cek `OPENROUTER_API_KEY` terisi & model masih tersedia di openrouter.ai/collections/free-models |
| Foto hilang setelah beberapa saat | `UPLOAD_DISK` belum di-set `b2`, atau credential B2 salah |
| Request pertama lambat banget | Setup cron ping (lihat bagian 3) belum jalan |

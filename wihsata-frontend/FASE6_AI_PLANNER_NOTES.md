# Fase 6 — AI Planner via Laravel (Selesai)

## Ringkasan
AI Planner sekarang sepenuhnya lewat Laravel: `Frontend → Laravel API →
OpenRouter API → Laravel → Frontend`. API key OpenRouter hanya ada di
`Laravel/.env`, tidak pernah tersentuh frontend. Kontrak JSON lama
dipertahankan 100% — semua field baru bersifat **additive** (opsional).

## Requirement tambahan yang dikerjakan (dari dokumen requirement sebelumnya)

### 1. Estimasi waktu tempuh realistis (masalah "100km bisa 2 jam atau 4 jam")
Diselesaikan dengan `TravelTimeService` (Opsi C yang sudah disepakati):
1. **Lapisan utama — OSRM**: routing jaringan jalan sungguhan (bukan garis
   lurus), otomatis mempertimbangkan kelas jalan dari data OpenStreetMap.
2. **Lapisan override manual**: kolom baru `road_time_multiplier` +
   `road_condition_note` di `destinations` — admin bisa isi pengali durasi
   untuk ruas jalan rusak yang belum tertangkap baik di data OSM (pola sama
   seperti `crossing_duration_minutes` untuk penyeberangan kapal).
3. **Fallback**: kalau OSRM gagal dihubungi, turun ke estimasi haversine +
   kecepatan rata-rata per moda (cuma dipakai saat OSRM benar-benar gagal).

### 2. Moda transportasi dibedakan (kendaraan pribadi/sewa/transportasi umum)
- Field baru **wajib** `transport_mode` di request AI Planner.
- Mempengaruhi: faktor durasi (`TravelTimeService`: pribadi ×1.0, sewa ×1.1,
  umum ×1.6 untuk transit/waktu tunggu), dan instruksi eksplisit ke AI di
  system prompt (aturan #13) supaya tidak menyamakan ketiganya — kendaraan
  sewa dapat biaya sewa terpisah, transportasi umum dapat buffer waktu transit.

### 3. Rekomendasi berdasarkan jarak & waktu (bukan cuma popularitas)
- Jarak & waktu tempuh riil dihitung **oleh sistem** (bukan dikarang AI) dari
  kota asal → tiap destinasi → antar destinasi berurutan → estimasi kembali,
  lalu dikirim ke AI sebagai data acuan wajib dipakai (aturan #14 di system
  prompt: AI dilarang membuat itinerary yang menghabiskan sebagian besar
  waktu di perjalanan, harus mempertimbangkan durasi trip yang tersedia).

### 4. Output AI diperkaya (semua field baru, additive)
- Per item: `distance_km`, `travel_time_minutes`, `transport_mode`, `reason`.
- Per hari: `total_travel_time_minutes`.
- Level trip: `transport_mode`, `return_trip_estimate` (jarak & waktu
  perjalanan kembali ke kota asal).
- Field lama (`summary`, `total_estimated_cost`, `days[].items[].{time,
  destination_name, activity, estimated_cost, notes}`, `recommendations`,
  `weather_note`) **tidak diubah sama sekali** — kontrak API aman.

### 5. AI Planner lewat Laravel, API key hanya di backend
- `AiPlannerController` (sudah ada dari sesi sebelumnya) dipanggil langsung
  dari frontend (`useAiItinerary` → Laravel `/api/ai-planner`), bukan lagi
  lewat proxy Next.js.
- `src/app/api/ai-planner/route.ts` dan `src/lib/openrouter.ts` **dihapus**
  (logic-nya sudah 1:1 di Laravel `OpenRouterService`).

## Pembersihan Supabase — TUNTAS 100%
Dengan AI Planner (konsumen terakhir) sudah pindah:
- `src/lib/supabase/` (client.ts, server.ts) — **dihapus seluruhnya**, sudah
  dikonfirmasi tidak ada import tersisa di manapun.
- `src/lib/geo.ts` — **dihapus** (konsumen satu-satunya, route ai-planner
  lama, sudah dihapus juga).
- `@supabase/ssr` & `@supabase/supabase-js` — **dihapus dari `package.json`**.
  *(Catatan: `package-lock.json`/`node_modules` belum di-regenerate karena
  sandbox ini tidak ada akses network untuk `npm install`. Jalankan `npm
  install` di environment Anda supaya lockfile ikut bersih — tidak
  mempengaruhi fungsi kode, cuma housekeeping.)*
- Sisa kata "supabase" di codebase **hanya komentar dokumentasi historis**
  (mis. `database.types.ts` menyebut asal-usul skema) — sudah diverifikasi
  bukan kode fungsional.

## Test yang dilakukan
1. **`tsc --noEmit`** — lulus bersih (sama seperti baseline, cuma warning
   `baseUrl` deprecated, bukan error baru).
2. **ESLint** — lulus bersih, 0 error/warning.
3. **Static check Laravel** (15 migration + semua file yang diubah): sintaks
   valid, FK & alter-table dependency antar migration tetap konsisten.
4. **Verifikasi route**: `/api/ai-planner` terdaftar dalam grup middleware
   `auth:sanctum + active` (wajib login, akun aktif) seperti sebelumnya.
5. **`next build`**: sama seperti Fase 5, tidak bisa dijalankan di sandbox
   ini (perlu network untuk binary native SWC) — jalankan di environment Anda.

## Batasan yang didokumentasikan (bukan bug, keterbatasan by design)
- OSRM tidak me-routing transportasi umum secara native — faktor ×1.6 untuk
  `public_transport` adalah **heuristik**, bukan jadwal transit presisi.
- Kalau OSRM (demo server publik) sedang lambat/limit, sistem otomatis jatuh
  ke fallback haversine — untuk produksi/traffic tinggi disarankan self-host
  OSRM sendiri (`OSRM_URL` sudah dibuat configurable).
- `road_time_multiplier` perlu diisi manual oleh admin per destinasi lewat
  DB langsung untuk saat ini — form admin destinasi belum ditambah field ini
  di UI (di luar scope minimal Fase 6, bisa ditambahkan kalau diperlukan).

## Status
Fase 6 selesai. **Tidak lanjut ke Fase 7** sesuai instruksi.

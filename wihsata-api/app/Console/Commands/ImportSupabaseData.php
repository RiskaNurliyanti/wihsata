<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Import data hasil migrasi Supabase (JSON fixture di database/data-import/)
 * ke PostgreSQL/Neon — Fase 3.
 *
 * PENTING — dipakai DB::table()->updateOrInsert() (query builder mentah),
 * BUKAN Eloquent updateOrCreate(). Alasan: model Category/District/
 * Subscription/Trip/User tidak punya 'id' di $fillable, jadi kalau pakai
 * Eloquent, ID asli dari Supabase akan DIAM-DIAM diganti UUID baru saat
 * record belum ada (HasUuids trait auto-generate id kalau tidak di-mass-
 * assign). Query builder mentah tidak melalui proteksi mass-assignment,
 * jadi ID asli terjamin dipertahankan persis seperti sumbernya.
 *
 * Idempotent: updateOrInsert cocok berdasarkan 'id' asli dari Supabase,
 * aman dijalankan berkali-kali tanpa duplikat.
 *
 * TIDAK PERNAH: migrate:fresh, migrate:refresh, db:wipe, atau DELETE apa pun.
 * Read-only terhadap Supabase (data sudah diekstrak ke JSON offline).
 */
class ImportSupabaseData extends Command
{
    protected $signature = 'wihsata:import-supabase-data
        {--dry-run : Tampilkan ringkasan tanpa menulis apa pun ke database}
        {--only= : Hanya import 1 tabel tertentu (categories,districts,users,destinations,subscriptions,trips)}';

    protected $description = 'Import data hasil migrasi Supabase (fixture JSON) ke Postgres/Neon secara aman & idempotent';

    private string $dataDir;

    public function handle(): int
    {
        $this->dataDir = database_path('data-import');

        if (! is_dir($this->dataDir)) {
            $this->error("Folder fixture tidak ditemukan: {$this->dataDir}");

            return self::FAILURE;
        }

        $manifest = $this->loadJson('manifest.json');
        $this->info('Sumber: '.($manifest['source'] ?? 'unknown'));

        $only = $this->option('only');
        $dryRun = (bool) $this->option('dry-run');

        $steps = [
            'categories' => fn () => $this->importSimple('categories', ['name', 'slug', 'icon', 'created_at', 'updated_at']),
            'districts' => fn () => $this->importSimple('districts', ['name', 'province', 'created_at', 'updated_at']),
            'users' => fn () => $this->importUsers(),
            'destinations' => fn () => $this->importDestinations(),
            'subscriptions' => fn () => $this->importSimple('subscriptions', [
                'user_id', 'tier', 'status', 'current_period_end',
                'ai_generation_count_today', 'ai_generation_reset_at', 'trips_saved_count',
                'created_at', 'updated_at',
            ]),
            'trips' => fn () => $this->importTrips(),
        ];

        if ($only && ! isset($steps[$only])) {
            $this->error("--only tidak dikenal: {$only}. Pilihan: ".implode(', ', array_keys($steps)));

            return self::FAILURE;
        }

        $this->newLine();
        $this->line($dryRun ? '=== DRY RUN — tidak ada perubahan ditulis ===' : '=== IMPORT DATA ===');

        foreach ($steps as $table => $step) {
            if ($only && $only !== $table) {
                continue;
            }

            $rows = $this->loadJson("{$table}.json");
            $this->line("→ {$table}: ".count($rows).' baris dari fixture');

            if ($dryRun) {
                continue;
            }

            DB::transaction($step);
            $this->line('  selesai.');
        }

        $this->newLine();
        $this->verify();

        return self::SUCCESS;
    }

    private function loadJson(string $file): array
    {
        $path = "{$this->dataDir}/{$file}";
        if (! file_exists($path)) {
            throw new \RuntimeException("Fixture tidak ditemukan: {$path}");
        }

        return json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
    }

    /** Import generik untuk tabel dengan kolom flat (tanpa json/array). */
    private function importSimple(string $table, array $columns): void
    {
        $rows = $this->loadJson("{$table}.json");

        foreach ($rows as $row) {
            $values = [];
            foreach ($columns as $col) {
                $values[$col] = $row[$col] ?? null;
            }
            DB::table($table)->updateOrInsert(['id' => $row['id']], $values);
        }
    }

    private function importUsers(): void
    {
        $rows = $this->loadJson('users.json');

        foreach ($rows as $row) {
            // Password hash bcrypt Supabase ($2a$10$...) dipertahankan APA
            // ADANYA (kompatibel dgn Hash::check Laravel — password_verify PHP
            // menerima varian $2a$/$2b$/$2y$) — user TIDAK perlu reset password.
            DB::table('users')->updateOrInsert(['id' => $row['id']], [
                'full_name' => $row['full_name'],
                'username' => $row['username'],
                'email' => $row['email'],
                'email_verified_at' => $row['email_verified_at'],
                'password' => $row['password'],
                'avatar_url' => $row['avatar_url'],
                'bio' => $row['bio'],
                'home_city' => $row['home_city'],
                'role' => $row['role'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }
    }

    private function importDestinations(): void
    {
        $rows = $this->loadJson('destinations.json');

        foreach ($rows as $row) {
            DB::table('destinations')->updateOrInsert(['id' => $row['id']], [
                'slug' => $row['slug'],
                'name' => $row['name'],
                'description' => $row['description'],
                'category_id' => $row['category_id'],
                'district_id' => $row['district_id'],
                'latitude' => $row['latitude'],
                'longitude' => $row['longitude'],
                'address' => $row['address'],
                'price_range' => $row['price_range'],
                'opening_hours' => $row['opening_hours'] !== null ? json_encode($row['opening_hours']) : null,
                'facilities' => json_encode($row['facilities']),
                'cover_image_url' => $row['cover_image_url'],
                'gallery_urls' => json_encode($row['gallery_urls']),
                'google_maps_url' => $row['google_maps_url'],
                'rating' => $row['rating'],
                'review_count' => $row['review_count'],
                'safety_score' => $row['safety_score'],
                'is_featured' => $row['is_featured'],
                'access_type' => $row['access_type'],
                'departure_port' => $row['departure_port'],
                'crossing_duration_minutes' => $row['crossing_duration_minutes'],
                'crossing_cost_estimate' => $row['crossing_cost_estimate'],
                'crossing_notes' => $row['crossing_notes'],
                'created_by' => $row['created_by'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }
    }

    private function importTrips(): void
    {
        $rows = $this->loadJson('trips.json');

        foreach ($rows as $row) {
            DB::table('trips')->updateOrInsert(['id' => $row['id']], [
                'user_id' => $row['user_id'],
                'title' => $row['title'],
                'start_date' => $row['start_date'],
                'end_date' => $row['end_date'],
                'status' => $row['status'],
                'budget_estimate' => $row['budget_estimate'],
                'preferences' => $row['preferences'] !== null ? json_encode($row['preferences']) : null,
                'itinerary' => json_encode($row['itinerary']),
                'cover_image_url' => $row['cover_image_url'],
                'is_public' => $row['is_public'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ]);
        }
    }

    /**
     * Verifikasi pasca-import: cek SEMUA ID dari fixture benar-benar ada di
     * DB (bukan cuma total count tabel, supaya tetap valid walau tabel sudah
     * berisi data lain di luar hasil migrasi). Non-destruktif — cuma SELECT.
     */
    private function verify(): void
    {
        $this->line('=== VERIFIKASI ===');

        $tables = [
            'categories' => 'categories.json',
            'districts' => 'districts.json',
            'users' => 'users.json',
            'destinations' => 'destinations.json',
            'subscriptions' => 'subscriptions.json',
            'trips' => 'trips.json',
        ];

        $allOk = true;
        foreach ($tables as $table => $file) {
            $rows = $this->loadJson($file);
            $ids = array_column($rows, 'id');
            $found = DB::table($table)->whereIn('id', $ids)->count();
            $ok = $found === count($ids);
            $allOk = $allOk && $ok;
            $this->line(sprintf('  %-14s fixture=%-4d ditemukan_di_db=%-4d %s', $table, count($ids), $found, $ok ? 'OK' : 'KURANG!'));
        }

        $this->newLine();
        $this->line($allOk
            ? 'Semua ID dari fixture terverifikasi ADA di database. Aman lanjut ke fase berikutnya.'
            : 'ADA ID DARI FIXTURE YANG TIDAK DITEMUKAN DI DB — cek log di atas, JANGAN lanjut dulu.');
    }
}

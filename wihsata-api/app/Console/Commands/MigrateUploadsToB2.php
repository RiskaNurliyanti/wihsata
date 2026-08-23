<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Memindahkan file upload dari disk lokal ke Backblaze B2, dan
 * memperbarui URL-nya di database. Hanya menyentuh URL yang berasal dari
 * fitur upload sendiri (diawali APP_URL + "/storage/uploads/"); URL
 * eksternal tidak diubah. Aman dijalankan berkali-kali (idempotent).
 */
class MigrateUploadsToB2 extends Command
{
    protected $signature = 'wihsata:migrate-uploads-to-b2
        {--dry-run : Tampilkan apa yang AKAN dipindah tanpa benar-benar upload/update apa pun}';

    protected $description = 'Pindahkan file upload lama dari disk lokal ke Backblaze B2 (dipakai sekali setelah setup B2)';

    /** [table, id_column, kolom_string_tunggal_atau_null, kolom_array_atau_null] */
    private array $targets = [
        ['destinations', 'id', 'cover_image_url', null],
        ['destinations', 'id', null, 'gallery_urls'],
        ['articles', 'id', 'cover_image_url', null],
        ['community_posts', 'id', null, 'image_urls'],
        ['trips', 'id', 'cover_image_url', null],
        ['users', 'id', 'avatar_url', null],
    ];

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if (config('filesystems.upload_disk') !== 'b2') {
            $this->error('UPLOAD_DISK di .env belum diset ke "b2". Setup Backblaze B2 dulu (lihat .env.example) sebelum jalankan command ini.');

            return self::FAILURE;
        }

        $localBaseUrl = rtrim(config('app.url'), '/').'/storage/';
        $movedCount = 0;
        $skippedCount = 0;

        foreach ($this->targets as [$table, $idColumn, $singleColumn, $arrayColumn]) {
            $column = $singleColumn ?? $arrayColumn;
            $rows = DB::table($table)->whereNotNull($column)->get([$idColumn, $column]);

            foreach ($rows as $row) {
                if ($singleColumn) {
                    $url = $row->{$singleColumn};
                    $newUrl = $this->migrateOneUrl($url, $localBaseUrl, $dryRun);

                    if ($newUrl && $newUrl !== $url) {
                        $movedCount++;
                        if (! $dryRun) {
                            DB::table($table)->where($idColumn, $row->{$idColumn})->update([$singleColumn => $newUrl]);
                        }
                        $this->line("[{$table}#{$row->{$idColumn}}] {$singleColumn}: dipindah.");
                    } elseif ($url) {
                        $skippedCount++;
                    }
                } else {
                    $urls = json_decode($row->{$arrayColumn}, true) ?? [];
                    $changed = false;
                    $newUrls = array_map(function ($url) use ($localBaseUrl, $dryRun, &$changed, &$movedCount, &$skippedCount) {
                        $newUrl = $this->migrateOneUrl($url, $localBaseUrl, $dryRun);
                        if ($newUrl && $newUrl !== $url) {
                            $changed = true;
                            $movedCount++;

                            return $newUrl;
                        }
                        if ($url) {
                            $skippedCount++;
                        }

                        return $url;
                    }, $urls);

                    if ($changed) {
                        $this->line("[{$table}#{$row->{$idColumn}}] {$arrayColumn}: dipindah.");
                        if (! $dryRun) {
                            DB::table($table)->where($idColumn, $row->{$idColumn})->update([$arrayColumn => json_encode($newUrls)]);
                        }
                    }
                }
            }
        }

        $this->newLine();
        if ($dryRun) {
            $this->info("DRY RUN — {$movedCount} file AKAN dipindah, {$skippedCount} dilewati (bukan upload lokal / sudah di B2). Jalankan tanpa --dry-run untuk eksekusi beneran.");
        } else {
            $this->info("Selesai — {$movedCount} file dipindah ke B2, {$skippedCount} dilewati.");
        }

        return self::SUCCESS;
    }

    /**
     * Kalau $url adalah upload lokal (diawali $localBaseUrl."uploads/"),
     * copy file-nya dari disk 'public' ke disk 'b2', lalu kembalikan URL B2
     * yang baru. Kalau bukan upload lokal (URL eksternal, atau sudah di B2),
     * kembalikan null (tidak diubah).
     */
    private function migrateOneUrl(?string $url, string $localBaseUrl, bool $dryRun): ?string
    {
        if (! $url || ! str_starts_with($url, $localBaseUrl.'uploads/')) {
            return null;
        }

        $relativePath = substr($url, strlen($localBaseUrl));

        if (! Storage::disk('public')->exists($relativePath)) {
            $this->warn("  File tidak ditemukan di disk lokal, dilewati: {$relativePath}");

            return null;
        }

        if ($dryRun) {
            return Storage::disk('b2')->url($relativePath); // preview saja, tidak upload
        }

        if (! Storage::disk('b2')->exists($relativePath)) {
            $contents = Storage::disk('public')->get($relativePath);
            Storage::disk('b2')->put($relativePath, $contents, 'public');
        }

        return Storage::disk('b2')->url($relativePath);
    }
}

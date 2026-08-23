<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * FIX DATA — bersihkan duplikat kabupaten/kota yang tercipta akibat
 * DestinationSeeder.php sempat memakai penamaan tidak konsisten (mis.
 * "Berau" & "Penajam Paser Utara" tanpa prefix "Kabupaten", padahal data
 * asli sudah punya "Kabupaten Berau" & "Kabupaten Penajam Paser Utara").
 * Seeder-nya sendiri sudah diperbaiki supaya tidak terjadi lagi di
 * instalasi baru — migration ini KHUSUS membereskan data yang SUDAH
 * terlanjur duplikat di database yang sudah berjalan.
 *
 * STRATEGI (aman, tidak menghapus destinasi apa pun):
 * Untuk setiap pasang (nama_salah, nama_benar):
 *   - Kalau KEDUANYA ada di tabel districts:
 *       1. Pindahkan semua destinasi yang district_id-nya menunjuk ke baris
 *          "nama_salah" supaya menunjuk ke baris "nama_benar" (MERGE, bukan
 *          hapus destinasi).
 *       2. Baru hapus baris "nama_salah" yang sekarang sudah tidak dipakai
 *          destinasi mana pun.
 *   - Kalau HANYA "nama_salah" yang ada (belum ada versi benarnya sama
 *     sekali) — cukup di-RENAME jadi nama yang benar, tidak perlu
 *     merge/hapus apa-apa, destinasi yang sudah nyantol tetap aman.
 *   - Kalau "nama_salah" tidak ada sama sekali — tidak melakukan apa-apa
 *     (aman dijalankan berkali-kali / di database mana pun).
 */
return new class extends Migration
{
    private array $renamePairs = [
        'Berau' => 'Kabupaten Berau',
        'Penajam Paser Utara' => 'Kabupaten Penajam Paser Utara',
        'Kutai Kartanegara' => 'Kabupaten Kutai Kartanegara',
    ];

    public function up(): void
    {
        foreach ($this->renamePairs as $wrongName => $correctName) {
            $wrong = DB::table('districts')->where('name', $wrongName)->first();
            if (! $wrong) {
                continue; // tidak ada duplikat salah — tidak ada yang perlu dibereskan
            }

            $correct = DB::table('districts')->where('name', $correctName)->first();

            if ($correct) {
                // Kedua baris ada — pindahkan destinasi dari yang salah ke yang benar, lalu hapus yang salah.
                DB::table('destinations')->where('district_id', $wrong->id)->update(['district_id' => $correct->id]);
                DB::table('districts')->where('id', $wrong->id)->delete();
            } else {
                // Cuma versi salah yang ada — cukup dibetulkan namanya, tidak ada yang perlu dipindah.
                DB::table('districts')->where('id', $wrong->id)->update(['name' => $correctName]);
            }
        }
    }

    public function down(): void
    {
        // Sengaja tidak di-revert — mengembalikan nama yang salah/duplikat
        // bukan sesuatu yang diinginkan.
    }
};

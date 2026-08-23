<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Menambahkan DEFAULT CURRENT_DATE yang valid pada kolom
 * `ai_generation_reset_at` di tabel `subscriptions`. useCurrent() Laravel
 * pada kolom bertipe `date` tidak selalu diterjemahkan dengan benar oleh
 * grammar PostgreSQL — jaring pengaman kedua di level database, mengikuti
 * fix utama yang sudah ada di App\Models\User::booted().
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('subscriptions') || ! Schema::hasColumn('subscriptions', 'ai_generation_reset_at')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE subscriptions ALTER COLUMN ai_generation_reset_at SET DEFAULT CURRENT_DATE');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE subscriptions ALTER COLUMN ai_generation_reset_at SET DEFAULT (CURRENT_DATE)');
        }
    }

    public function down(): void
    {
        //
    }
};

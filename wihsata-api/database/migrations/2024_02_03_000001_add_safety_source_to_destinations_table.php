<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Menambah kolom `safety_source` untuk mencatat dasar penilaian safety
 * score, dan menghapus default 4.0 dari `safety_score` supaya destinasi
 * baru tidak otomatis mendapat rating tanpa penilaian.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->string('safety_source', 500)->nullable()->after('safety_score');
        });

        Schema::table('destinations', function (Blueprint $table) {
            $driver = \Illuminate\Support\Facades\DB::getDriverName();
            if (in_array($driver, ['pgsql', 'mysql'])) {
                \Illuminate\Support\Facades\DB::statement('ALTER TABLE destinations ALTER COLUMN safety_score DROP DEFAULT');
            }
            // SQLite tidak mendukung DROP DEFAULT langsung — diabaikan.
        });
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn('safety_source');
        });
    }
};

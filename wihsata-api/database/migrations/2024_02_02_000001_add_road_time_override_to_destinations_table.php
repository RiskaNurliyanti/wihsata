<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fase 6 — AI Planner butuh estimasi waktu tempuh yang REALISTIS, bukan
 * sekadar jarak ÷ kecepatan rata-rata (100km bisa 2 jam atau 4 jam
 * tergantung kondisi jalan). Solusi utamanya TravelTimeService memakai
 * OSRM (jaringan jalan sungguhan, bukan garis lurus). Kolom di migration
 * ini adalah LAPISAN KEDUA (override manual): untuk ruas jalan yang
 * kondisinya buruk dan belum tertangkap baik oleh data OSM/OSRM, admin
 * bisa isi manual — sama seperti pola `crossing_duration_minutes` yang
 * sudah ada untuk penyeberangan kapal.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            // Pengali durasi tempuh OSRM menuju destinasi ini, mis. 1.5 berarti
            // waktu tempuh dari OSRM dikali 1.5x. NULL = pakai hasil OSRM apa adanya.
            $table->decimal('road_time_multiplier', 4, 2)->nullable()->after('crossing_notes');
            $table->string('road_condition_note', 255)->nullable()->after('road_time_multiplier');
        });
    }

    public function down(): void
    {
        Schema::table('destinations', function (Blueprint $table) {
            $table->dropColumn(['road_time_multiplier', 'road_condition_note']);
        });
    }
};

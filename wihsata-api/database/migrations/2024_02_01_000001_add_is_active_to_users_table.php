<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Fitur baru: Super Admin bisa aktifkan/nonaktifkan akun user (requirement
 * tambahan Fase 4). Kolom ditambah lewat migration baru — TIDAK mengubah
 * migration `create_users_table` yang sudah ada / sudah dipakai data
 * migrasi Fase 3, supaya aman dijalankan di database yang sudah berisi data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Tabel key-value untuk pengaturan situs (dipakai fitur maintenance mode). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        \Illuminate\Support\Facades\DB::table('site_settings')->insert([
            [
                'key' => 'maintenance_enabled',
                'value' => '0',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'maintenance_message',
                'value' => "Website sedang dalam pemeliharaan\n\nKami sedang melakukan pembaruan dan perbaikan sistem. Silakan kembali beberapa saat lagi.",
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};

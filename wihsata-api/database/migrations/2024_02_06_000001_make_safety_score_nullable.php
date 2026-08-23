<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** Menjadikan kolom `safety_score` nullable, konsisten dengan penghapusan default di migration sebelumnya. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('destinations') || ! Schema::hasColumn('destinations', 'safety_score')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE destinations ALTER COLUMN safety_score DROP NOT NULL');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE destinations MODIFY safety_score DECIMAL(2,1) NULL');
        }
    }

    public function down(): void
    {
        //
    }
};

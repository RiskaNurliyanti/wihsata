<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Dibutuhkan untuk query geospasial (nearby search) dan fuzzy search nama.
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        Schema::create('destinations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignUuid('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->double('latitude');
            $table->double('longitude');
            $table->string('address')->nullable();
            $table->string('price_range')->nullable();

            // Catatan: memakai jsonb (bukan text[] native Postgres) supaya
            // kompatibel langsung dengan Eloquent array/json cast tanpa
            // custom cast tambahan — secara fungsional setara.
            $table->jsonb('opening_hours')->nullable();
            $table->jsonb('facilities')->nullable();
            $table->jsonb('gallery_urls')->nullable();

            $table->string('cover_image_url')->nullable();
            $table->string('google_maps_url')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->decimal('safety_score', 2, 1)->default(4.0);
            $table->boolean('is_featured')->default(false);

            // Akses penyeberangan kapal — lihat fitur "Perlu Kapal".
            $table->string('access_type')->default('darat');
            $table->string('departure_port')->nullable();
            $table->unsignedInteger('crossing_duration_minutes')->nullable();
            $table->decimal('crossing_cost_estimate', 12, 2)->nullable();
            $table->text('crossing_notes')->nullable();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Kolom geography generated dari lat/lng, dipakai untuk query jarak
        // (ST_DWithin/ST_Distance) di NearbyDestinationController.
        DB::statement(<<<'SQL'
            ALTER TABLE destinations
            ADD COLUMN geo_location geography(Point, 4326)
            GENERATED ALWAYS AS (
                ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
            ) STORED
        SQL);

        DB::statement('CREATE INDEX idx_destinations_geo ON destinations USING GIST (geo_location)');
        DB::statement('CREATE INDEX idx_destinations_name_trgm ON destinations USING GIN (name gin_trgm_ops)');
    }

    public function down(): void
    {
        Schema::dropIfExists('destinations');
    }
};

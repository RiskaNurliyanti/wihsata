<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('tier')->default('demo'); // demo | pro
            $table->string('status')->default('active');
            $table->timestamp('current_period_end')->nullable();
            $table->unsignedInteger('ai_generation_count_today')->default(0);
            $table->date('ai_generation_reset_at')->useCurrent();
            $table->unsignedInteger('trips_saved_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};

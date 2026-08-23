<?php

use App\Http\Controllers\Admin\AdminStatsController;
use App\Http\Controllers\Admin\TripManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Api\AiPlannerController;
use App\Http\Controllers\Api\ArticleCommentController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommunityPostController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\GeocodeController;
use App\Http\Controllers\Api\PostCommentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Wihsata
|--------------------------------------------------------------------------
| Semua modul sudah dimigrasikan ke Laravel: Auth, Role, Destinasi, Kategori,
| Kabupaten/Kota, Trip, Blog, Komunitas, Review, Favorit, AI Planner.
*/

// ── Maintenance status (publik, dibaca frontend semua halaman) ────────────
Route::get('/maintenance-status', [MaintenanceController::class, 'show']);

// ── Auth ────────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class);
    Route::post('/login', LoginController::class);
    Route::post('/forgot-password', ForgotPasswordController::class);
    Route::post('/reset-password', ResetPasswordController::class);

    Route::middleware(['auth:sanctum', 'active'])->group(function () {
        Route::post('/logout', LogoutController::class);
        Route::get('/me', [ProfileController::class, 'show']);
        Route::patch('/me', [ProfileController::class, 'update']);
    });
});

// ── Publik: baca saja ──────────────────────────────────────────────────
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/nearby', [DestinationController::class, 'nearby']);
Route::get('/destinations/{destination:slug}', [DestinationController::class, 'show']);
Route::get('/destinations/{destination:slug}/reviews', [ReviewController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/districts', [DistrictController::class, 'index']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article:slug}', [ArticleController::class, 'show']);
Route::get('/community/posts', [CommunityPostController::class, 'index']);
Route::get('/community/posts/{post}/comments', [PostCommentController::class, 'index']);

// Proxy layanan eksternal (pengganti Node route lama, tidak butuh API key)
Route::get('/geocode', GeocodeController::class);
Route::get('/weather', WeatherController::class);

// ── User login (siapa saja yang sudah login) ──────────────────────────
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    // Trip
    Route::get('/trips', [TripController::class, 'index']);
    Route::post('/trips', [TripController::class, 'store']);
    Route::get('/trips/{trip}', [TripController::class, 'show']);
    Route::patch('/trips/{trip}', [TripController::class, 'update']);
    Route::delete('/trips/{trip}', [TripController::class, 'destroy']);

    // Blog — SEMUA user boleh nulis, bukan cuma admin
    Route::get('/articles-mine', [ArticleController::class, 'mine']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::patch('/articles/{article:slug}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article:slug}', [ArticleController::class, 'destroy']);
    Route::post('/articles/{article:slug}/comments', [ArticleCommentController::class, 'store']);
    Route::patch('/article-comments/{comment}', [ArticleCommentController::class, 'update']);
    Route::delete('/article-comments/{comment}', [ArticleCommentController::class, 'destroy']);

    // Komunitas
    Route::post('/community/posts', [CommunityPostController::class, 'store']);
    Route::patch('/community/posts/{post}', [CommunityPostController::class, 'update']);
    Route::delete('/community/posts/{post}', [CommunityPostController::class, 'destroy']);
    Route::post('/community/posts/{post}/like', [CommunityPostController::class, 'toggleLike']);
    Route::post('/community/posts/{post}/comments', [PostCommentController::class, 'store']);
    Route::patch('/post-comments/{comment}', [PostCommentController::class, 'update']);
    Route::delete('/post-comments/{comment}', [PostCommentController::class, 'destroy']);

    // Review & Favorit
    Route::put('/destinations/{destination:slug}/reviews', [ReviewController::class, 'upsert']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/destinations/{destination:slug}/favorite', [FavoriteController::class, 'toggle']);

    // AI Planner
    Route::post('/ai-planner', AiPlannerController::class);

    // Upload file gambar — dipakai form destinasi/artikel/komunitas/avatar.
    Route::post('/uploads', [UploadController::class, 'store']);
});

// ── Admin & Super Admin: kelola konten ─────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:admin,super_admin', 'active'])
    ->group(function () {
        Route::post('/destinations', [DestinationController::class, 'store']);
        Route::match(['put', 'patch'], '/destinations/{destination:slug}', [DestinationController::class, 'update']);
        Route::delete('/destinations/{destination:slug}', [DestinationController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::patch('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/articles', [ArticleController::class, 'adminIndex']);
        Route::get('/stats', AdminStatsController::class);

        Route::post('/districts', [DistrictController::class, 'store']);
        Route::delete('/districts/{district}', [DistrictController::class, 'destroy']);

        Route::get('/trips', [TripManagementController::class, 'index']);
        Route::patch('/trips/{trip}', [TripManagementController::class, 'update']);
        Route::delete('/trips/{trip}', [TripManagementController::class, 'destroy']);

        // Toggle maintenance — admin & super_admin (kebutuhan operasional harian).
        Route::patch('/maintenance', [MaintenanceController::class, 'update']);
    });

// ── Super Admin saja: kelola role pengguna ─────────────────────────────
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:super_admin', 'active'])
    ->group(function () {
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::patch('/users/{user}/role', [UserManagementController::class, 'updateRole']);
        Route::patch('/users/{user}/status', [UserManagementController::class, 'updateStatus']);
    });

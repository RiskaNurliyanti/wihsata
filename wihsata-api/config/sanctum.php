<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    | CATATAN: 'stateful' config ini SENGAJA TIDAK DIPAKAI LAGI sejak fix bug
    | "CSRF token mismatch" di AI Planner — `statefulApi()` sudah dihapus dari
    | bootstrap/app.php, jadi Sanctum tidak lagi mengaktifkan mode cookie-
    | session untuk domain manapun. Auth API 100% Bearer token (personal
    | access token), konsisten untuk semua client. Dibiarkan di sini
    | (bukan dihapus) supaya gampang di-restore kalau suatu saat memang
    | butuh mode SPA cookie-session lagi.
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    'guard' => ['web'],

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];

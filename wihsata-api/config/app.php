<?php

return [
    'name' => env('APP_NAME', 'Wihsata'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => env('APP_TIMEZONE', 'Asia/Jakarta'),
    'locale' => env('APP_LOCALE', 'id'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'faker_locale' => 'id_ID',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
    'maintenance' => [
        'driver' => 'file',
    ],

    // Custom: dipakai di ResetPasswordNotification untuk bangun link
    // yang mengarah ke halaman Next.js, bukan halaman default Laravel.
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
];

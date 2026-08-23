<?php

return [
    'driver' => env('SESSION_DRIVER', 'database'),
    'lifetime' => (int) env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => env('SESSION_ENCRYPT', false),
    'files' => storage_path('framework/sessions'),
    'connection' => env('SESSION_CONNECTION'),
    'table' => env('SESSION_TABLE', 'sessions'),
    'store' => env('SESSION_STORE'),
    'lottery' => [2, 100],
    'cookie' => env('SESSION_COOKIE', 'wihsata_session'),
    'path' => '/',
    // WAJIB diisi domain root Anda saat production (mis. '.wihsata.com')
    // supaya cookie sesi bisa dibaca lintas subdomain API <-> frontend.
    'domain' => env('SESSION_DOMAIN'),
    'secure' => env('SESSION_SECURE_COOKIE', true),
    'http_only' => true,
    // 'none' dibutuhkan karena API (beda domain) dan frontend Next.js
    // kemungkinan besar di domain terpisah (cross-site cookie).
    'same_site' => env('SESSION_SAME_SITE', 'none'),
    'partitioned' => false,
];

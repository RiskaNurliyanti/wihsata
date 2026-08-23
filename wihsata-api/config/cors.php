<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Domain frontend Next.js Anda — WAJIB diisi via env FRONTEND_URL,
    // jangan pernah pakai '*' karena kita mengizinkan credentials (cookie).
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Fase 5: auth pakai Sanctum personal access token (Bearer header),
    // BUKAN cookie-session SPA — apiFetch() frontend tidak pernah kirim
    // `credentials: 'include'`, jadi cookie lintas-origin tidak pernah
    // benar-benar terkirim ke sini. Baris ini dibiarkan `true` karena tidak
    // mengganggu (harmless) dan jaga-jaga kalau nanti ada kebutuhan cookie
    // (mis. Route Handler internal Next.js yang proxy ke Laravel).
    'supports_credentials' => true,
];

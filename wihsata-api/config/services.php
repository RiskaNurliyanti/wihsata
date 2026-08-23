<?php

return [
    'postmark' => ['token' => env('POSTMARK_TOKEN')],
    'resend' => ['key' => env('RESEND_KEY')],
    'nominatim' => ['url' => env('NOMINATIM_URL', 'https://nominatim.openstreetmap.org')],

    'open_meteo' => ['url' => env('OPEN_METEO_URL', 'https://api.open-meteo.com/v1')],

    'osrm' => ['url' => env('OSRM_URL', 'https://router.project-osrm.org')],
    'openrouter' => [
        'key' => env('OPENROUTER_API_KEY'),
        // Model gratis dengan dukungan structured/JSON output yang baik.
        // Override lewat OPENROUTER_MODEL di .env kapan saja.
        'model' => env('OPENROUTER_MODEL', 'nvidia/nemotron-3-super-120b-a12b:free'),
    ],
];

<?php

return [
    'default' => env('FILESYSTEM_DISK', 'local'),

    // Disk untuk fitur upload foto — terpisah dari 'default' di atas.
    // Set ke 'b2' atau 'supabase' di .env setelah setup storage eksternal
    // untuk penyimpanan persisten di hosting dengan filesystem ephemeral.
    'upload_disk' => env('UPLOAD_DISK', 'public'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        // Backblaze B2 (S3-compatible) — dipakai kalau UPLOAD_DISK=b2.
        // Catatan: Backblaze mewajibkan kartu kredit untuk bucket publik.
        'b2' => [
            'driver' => 's3',
            'key' => env('B2_ACCESS_KEY_ID'),
            'secret' => env('B2_SECRET_ACCESS_KEY'),
            'region' => env('B2_REGION', 'us-west-004'),
            'bucket' => env('B2_BUCKET'),
            'endpoint' => env('B2_ENDPOINT'), // mis. https://s3.us-west-004.backblazeb2.com
            'url' => env('B2_URL'), // mis. https://f004.backblazeb2.com/file/nama-bucket-anda
            'use_path_style_endpoint' => true,
            'visibility' => 'public',
            'throw' => false,
        ],

        // Supabase Storage (S3-compatible) — dipakai kalau UPLOAD_DISK=supabase.
        // Alternatif B2 yang tidak mewajibkan kartu kredit untuk bucket publik.
        'supabase' => [
            'driver' => 's3',
            'key' => env('SUPABASE_S3_ACCESS_KEY_ID'),
            'secret' => env('SUPABASE_S3_SECRET_ACCESS_KEY'),
            'region' => env('SUPABASE_S3_REGION', 'ap-southeast-1'),
            'bucket' => env('SUPABASE_S3_BUCKET'),
            'endpoint' => env('SUPABASE_S3_ENDPOINT'), // https://<project-ref>.supabase.co/storage/v1/s3
            'url' => env('SUPABASE_S3_URL'), // https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>
            'use_path_style_endpoint' => true,
            'visibility' => 'public',
            'throw' => false,
        ],
    ],
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];

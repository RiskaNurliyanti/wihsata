<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Key-value settings situs, dipakai untuk fitur maintenance (checkpoint 10).
 * Sengaja dibuat generik (bukan `MaintenanceSetting` khusus) supaya kalau
 * nanti butuh pengaturan situs lain, tidak perlu bikin tabel baru lagi.
 */
class SiteSetting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['key', 'value'];

    /** Cache pendek (10 detik) supaya setiap request tidak selalu query DB,
     *  tapi toggle maintenance tetap terasa "hampir real-time". */
    public static function get(string $key, ?string $default = null): ?string
    {
        return Cache::remember("site_setting:{$key}", 10, function () use ($key, $default) {
            return static::query()->where('key', $key)->value('value') ?? $default;
        });
    }

    public static function set(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("site_setting:{$key}");
    }
}

<?php

namespace App\Enums;

/**
 * Hierarki role Wihsata:
 * - user        : pengguna biasa, akses fitur Pro tergantung status langganan.
 * - admin       : akses semua fitur termasuk fitur Pro secara gratis,
 *                 bisa kelola konten (destinasi, blog, komunitas, dll).
 * - super_admin : sama seperti admin, DITAMBAH bisa mengatur role
 *                 pengguna lain (menaikkan/menurunkan jadi admin).
 */
enum UserRole: string
{
    case User = 'user';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    public function label(): string
    {
        return match ($this) {
            self::User => 'Pengguna',
            self::Admin => 'Admin',
            self::SuperAdmin => 'Super Admin',
        };
    }

    /** Admin dan Super Admin otomatis dapat akses fitur Pro tanpa langganan. */
    public function hasFreeProAccess(): bool
    {
        return match ($this) {
            self::Admin, self::SuperAdmin => true,
            self::User => false,
        };
    }

    /** Hanya Super Admin yang boleh mengubah role pengguna lain. */
    public function canManageRoles(): bool
    {
        return $this === self::SuperAdmin;
    }

    /** Admin dan Super Admin bisa masuk ke panel admin. */
    public function canAccessAdminPanel(): bool
    {
        return match ($this) {
            self::Admin, self::SuperAdmin => true,
            self::User => false,
        };
    }
}

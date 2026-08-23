<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    /** Primary key berupa UUID (string), bukan auto-increment integer. */
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'full_name',
        'username',
        'email',
        'password',
        'avatar_url',
        'bio',
        'home_city',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    protected $attributes = [
        'role' => 'user',
        'is_active' => true,
    ];

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin || $this->role === UserRole::SuperAdmin;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    public function subscription(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    /**
     * Tier efektif untuk kebutuhan fitur Pro — admin/super_admin selalu 'pro'
     * tanpa perlu langganan. Untuk user biasa, baca tier asli dari tabel
     * subscriptions (dibuat otomatis 'demo' saat user register, lihat booted()).
     */
    public function effectiveTier(): string
    {
        if ($this->role->hasFreeProAccess()) {
            return 'pro';
        }

        return $this->subscription?->tier ?? 'demo';
    }

    protected static function booted(): void
    {
        // Pengganti trigger `handle_new_user` di Supabase — otomatis buat
        // baris subscription 'demo' setiap kali user baru register.
        static::created(function (User $user) {
            $user->subscription()->create([
                'tier' => 'demo',
                'ai_generation_reset_at' => now()->toDateString(),
            ]);
        });
    }

    /**
     * Override supaya email reset password memakai template kita sendiri
     * (App\Notifications\ResetPasswordNotification) yang link-nya mengarah
     * ke halaman /auth/reset-password di Next.js, bukan halaman default Laravel.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}

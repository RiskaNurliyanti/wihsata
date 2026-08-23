<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Jalankan sekali di awal setup: php artisan db:seed --class=SuperAdminSeeder
 * WAJIB ganti email & password default ini sebelum/sesudah seed, jangan
 * dipakai apa adanya di production.
 */
class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@wihsata.com');
        $password = env('SUPER_ADMIN_PASSWORD', 'GantiPasswordIni123!');

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'full_name' => 'Super Admin',
                'password' => Hash::make($password),
                'role' => UserRole::SuperAdmin,
                'email_verified_at' => now(),
            ]
        );

        if ($user->wasRecentlyCreated) {
            $this->command->info("Super Admin dibuat: {$email}");
            $this->command->warn('Segera login dan ganti passwordnya lewat halaman Profil!');
        } else {
            $this->command->info("Super Admin dengan email {$email} sudah ada, dilewati.");
        }
    }
}

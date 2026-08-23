<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Pantai', 'icon' => 'waves'],
            ['name' => 'Gunung', 'icon' => 'mountain'],
            ['name' => 'Air Terjun', 'icon' => 'droplets'],
            ['name' => 'Danau', 'icon' => 'droplet'],
            ['name' => 'Kuliner', 'icon' => 'utensils'],
            ['name' => 'Budaya & Sejarah', 'icon' => 'landmark'],
            ['name' => 'Taman & Hutan', 'icon' => 'trees'],
            ['name' => 'Pulau', 'icon' => 'palmtree'],
            ['name' => 'Desa Wisata', 'icon' => 'home'],
            ['name' => 'Camping & Outdoor', 'icon' => 'tent'],
            ['name' => 'Waterpark & Kolam', 'icon' => 'waves'],
            ['name' => 'Belanja & Oleh-oleh', 'icon' => 'shopping-bag'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                ['name' => $category['name'], 'icon' => $category['icon']]
            );
        }

        $this->command->info(count($categories).' kategori berhasil di-seed.');
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default initial Superadmin credential only
        User::updateOrCreate(
            ['email' => 'superadmin@everythingalmost.co.uk'],
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'password' => 'SuperAdmin123!',
                'is_superadmin' => true,
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Models\Schools;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schools::create([
            'name' => "SMP Negeri Ekspedisi 33"
        ]);
        Schools::create([
            'name' => "SMP Negeri Ekspedisi 44"
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SettingSeeder::class,
            UserSeeder::class,
            SchoolSeeder::class,
            ParticipantSeeder::class,
            QuestionnaireSeeder::class,
            AnswerSeeder::class,
        ]);
    }
}

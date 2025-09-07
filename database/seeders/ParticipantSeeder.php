<?php

namespace Database\Seeders;

use App\Models\Participant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Participant::create([
            'nisn' => '1111111111',
            'fullname' => 'Ahmad',
            'school_id' => 1,
            'class' => '12 IPS A'
        ]);
    }
}

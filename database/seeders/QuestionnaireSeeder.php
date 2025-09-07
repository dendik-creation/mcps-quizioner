<?php

namespace Database\Seeders;

use App\Models\Questionnaires;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionnaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questionnaire = Questionnaires::create([
            'name' => 'Kuesioner 1',
            'description' => 'Deskripsi Kuesioner 1',
            'is_open' => true,
        ]);

        $questions = [
            [
                'question' => '<p><strong>Apa ibu kota Indonesia?</strong></p>',
                'choices' => [['choice' => 'Jakarta', 'point' => 1], ['choice' => 'DKI Jakarta', 'point' => 1], ['choice' => 'Bandung', 'point' => 0], ['choice' => 'Surabaya', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Siapa presiden pertama Indonesia?</strong></p>',
                'choices' => [['choice' => 'Soekarno', 'point' => 1], ['choice' => 'Ir. Soekarno', 'point' => 1], ['choice' => 'Soeharto', 'point' => 0], ['choice' => 'Habibie', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Apa nama mata uang Indonesia?</strong></p>',
                'choices' => [['choice' => 'Rupiah', 'point' => 1], ['choice' => 'IDR', 'point' => 1], ['choice' => 'Dollar', 'point' => 0], ['choice' => 'Ringgit', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Berapa jumlah pulau di Indonesia?</strong></p>',
                'choices' => [['choice' => 'Lebih dari 17.000', 'point' => 1], ['choice' => '17.508', 'point' => 1], ['choice' => '10.000', 'point' => 0], ['choice' => '5.000', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Apa nama laut yang memisahkan Jawa dan Sumatera?</strong></p>',
                'choices' => [['choice' => 'Selat Sunda', 'point' => 1], ['choice' => 'Sunda Strait', 'point' => 1], ['choice' => 'Selat Malaka', 'point' => 0], ['choice' => 'Selat Bali', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Apa bahasa resmi Indonesia?</strong></p>',
                'choices' => [['choice' => 'Bahasa Indonesia', 'point' => 1], ['choice' => 'Indonesian', 'point' => 1], ['choice' => 'Bahasa Jawa', 'point' => 0], ['choice' => 'Bahasa Melayu', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Apa nama gunung tertinggi di Indonesia?</strong></p>',
                'choices' => [['choice' => 'Puncak Jaya', 'point' => 1], ['choice' => 'Carstensz Pyramid', 'point' => 1], ['choice' => 'Gunung Kerinci', 'point' => 0], ['choice' => 'Gunung Semeru', 'point' => 0]],
            ],
            [
                'question' => '<p><strong>Kapan Indonesia merdeka?</strong></p>',
                'choices' => [['choice' => '17 Agustus 1945', 'point' => 1], ['choice' => '1945', 'point' => 1], ['choice' => '17 Agustus 1944', 'point' => 0], ['choice' => '1946', 'point' => 0]],
            ],
        ];

        foreach ($questions as $q) {
            $question = $questionnaire->questions()->create([
                'question' => $q['question'],
                'questionnaire_id' => $questionnaire->id,
            ]);
            foreach ($q['choices'] as $choice) {
                $question->choices()->create([
                    'choice' => $choice['choice'],
                    'point' => $choice['point'],
                    'question_id' => $question->id,
                ]);
            }
        }
    }
}

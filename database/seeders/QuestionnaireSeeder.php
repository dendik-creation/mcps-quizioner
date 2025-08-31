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
                'question' => '<p><strong>1. Apa <em>warna</em> favorit Anda?</strong></p>',
                'choices' => [
                    ['choice' => 'Merah', 'point' => 1],
                    ['choice' => 'Biru', 'point' => 1],
                    ['choice' => 'Hijau', 'point' => 0],
                    ['choice' => 'Kuning', 'point' => 0],
                    ['choice' => 'Ungu', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>2. <u>Hobi</u> apa yang paling sering Anda lakukan di waktu luang?</strong></p>',
                'choices' => [
                    ['choice' => 'Membaca', 'point' => 1],
                    ['choice' => 'Olahraga', 'point' => 1],
                    ['choice' => 'Menonton TV', 'point' => 0],
                    ['choice' => 'Bermain game', 'point' => 0],
                    ['choice' => 'Berkebun', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>3. <span style="background:yellow;">Apa jenis musik yang Anda sukai?</span></strong></p>',
                'choices' => [
                    ['choice' => 'Pop', 'point' => 1],
                    ['choice' => 'Jazz', 'point' => 1],
                    ['choice' => 'Dangdut', 'point' => 0],
                    ['choice' => 'Rock', 'point' => 0],
                    ['choice' => 'Klasik', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>4. <i>Minuman</i> apa yang paling sering Anda konsumsi?</strong></p>',
                'choices' => [
                    ['choice' => 'Air putih', 'point' => 1],
                    ['choice' => 'Teh', 'point' => 1],
                    ['choice' => 'Kopi', 'point' => 0],
                    ['choice' => 'Soda', 'point' => 0],
                    ['choice' => 'Jus buah', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>5. <span style="color:green;">Apa alat transportasi favorit Anda?</span></strong></p>',
                'choices' => [
                    ['choice' => 'Mobil', 'point' => 1],
                    ['choice' => 'Sepeda', 'point' => 1],
                    ['choice' => 'Motor', 'point' => 0],
                    ['choice' => 'Bus', 'point' => 0],
                    ['choice' => 'Kereta', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>6. <u>Buah</u> apa yang paling Anda sukai?</strong></p>',
                'choices' => [
                    ['choice' => 'Apel', 'point' => 1],
                    ['choice' => 'Pisang', 'point' => 1],
                    ['choice' => 'Jeruk', 'point' => 0],
                    ['choice' => 'Mangga', 'point' => 0],
                    ['choice' => 'Semangka', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>7. <span style="font-style:italic;">Apa mata pelajaran favorit Anda di sekolah?</span></strong></p>',
                'choices' => [
                    ['choice' => 'Matematika', 'point' => 1],
                    ['choice' => 'Bahasa Indonesia', 'point' => 1],
                    ['choice' => 'Sejarah', 'point' => 0],
                    ['choice' => 'Fisika', 'point' => 0],
                    ['choice' => 'Seni', 'point' => 0],
                ],
            ],
            [
                'question' => '<p><strong>8. <span style="text-decoration:underline;">Apa musim favorit Anda?</span></strong></p>',
                'choices' => [
                    ['choice' => 'Musim hujan', 'point' => 1],
                    ['choice' => 'Musim kemarau', 'point' => 1],
                    ['choice' => 'Musim semi', 'point' => 0],
                    ['choice' => 'Musim gugur', 'point' => 0],
                    ['choice' => 'Musim dingin', 'point' => 0],
                ],
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

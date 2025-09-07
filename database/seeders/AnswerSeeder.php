<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Answer;
use App\Models\Participant;
use App\Models\Questionnaires;
use App\Models\Questions;
use App\Models\Choices;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participant_id = 1;
        $questionnaire = Questionnaires::first();

        // Essay answers that match each question from QuestionnaireSeeder
        $essayAnswers = [
            '<p>Jakarta adalah ibu kota Indonesia yang terletak di pulau Jawa dan merupakan pusat pemerintahan negara.</p>',
            '<p>Ir. Soekarno adalah presiden pertama Indonesia yang memimpin perjuangan kemerdekaan dan memproklamirkan kemerdekaan Indonesia.</p>',
            '<p>Rupiah (IDR) adalah mata uang resmi Indonesia yang digunakan dalam semua transaksi di wilayah Indonesia.</p>',
            '<p>Indonesia memiliki lebih dari 17.000 pulau yang tersebar dari Sabang sampai Merauke, menjadikannya negara kepulauan terbesar di dunia.</p>',
            '<p>Selat Sunda adalah perairan yang memisahkan pulau Jawa dan Sumatera, menghubungkan Laut Jawa dengan Samudra Hindia.</p>',
            '<p>Bahasa Indonesia adalah bahasa resmi dan bahasa persatuan Indonesia yang digunakan dalam komunikasi formal dan pendidikan.</p>',
            '<p>Puncak Jaya atau Carstensz Pyramid adalah gunung tertinggi di Indonesia dengan ketinggian 4.884 meter di atas permukaan laut.</p>',
            '<p>Indonesia merdeka pada tanggal 17 Agustus 1945 setelah diproklamirkan oleh Soekarno dan Mohammad Hatta.</p>',
        ];

        $questions = $questionnaire->questions()->with('choices')->get();

        foreach ($questions as $index => $question) {
            $choices = $question->choices->random(2);
            
            foreach ($choices as $choice) {
                Answer::create([
                    'participant_id' => $participant_id,
                    'questionnaire_id' => $questionnaire->id,
                    'questions_id' => $question->id,
                    'choice_id' => $choice->id,
                    'researcher_id' => null,
                    'essay_answer' => null,
                    'point' => $choice->point,
                ]);
            }
            
            // Create 1 essay answer per question
            Answer::create([
                'participant_id' => $participant_id,
                'questionnaire_id' => $questionnaire->id,
                'questions_id' => $question->id,
                'choice_id' => null,
                'researcher_id' => null,
                'essay_answer' => $essayAnswers[$index],
                'point' => null,
            ]);
        }
    }
}

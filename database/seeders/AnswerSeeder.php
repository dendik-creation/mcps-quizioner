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

        // Sample essay answers for each question
        $essayAnswers = [
            '<p>Saya memilih warna merah karena memberikan kesan energi dan semangat dalam hidup sehari-hari.</p>',
            '<p>Membaca adalah hobi yang sangat menarik karena dapat menambah wawasan dan pengetahuan.</p>',
            '<p>Musik pop memiliki melodi yang mudah diingat dan lirik yang relate dengan kehidupan modern.</p>',
            '<p>Air putih adalah pilihan terbaik untuk kesehatan tubuh dan tidak mengandung kalori berlebih.</p>',
            '<p>Sepeda adalah transportasi yang ramah lingkungan dan juga dapat digunakan untuk olahraga.</p>',
            '<p>Apel mengandung banyak vitamin dan serat yang baik untuk kesehatan pencernaan.</p>',
            '<p>Matematika mengajarkan logika berpikir yang sistematis dan dapat diterapkan dalam kehidupan.</p>',
            '<p>Musim hujan memberikan kesejukan dan membuat udara menjadi lebih segar dan bersih.</p>',
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

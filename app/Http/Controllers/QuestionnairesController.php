<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Answer;
use App\Models\Choices;
use App\Models\Settings;
use Illuminate\Http\Request;
use App\Models\Questionnaires;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class QuestionnairesController extends Controller
{
    public function adminIndex()
    {
        $questionnaires = Questionnaires::with('questions')->get();
        return Inertia::render('Admin/Questionnaire/Index', [
            'title' => 'Daftar Kuisioner',
            'description' => 'Halaman untuk melihat daftar kuisioner',
            'questionnaires' => $questionnaires,
        ]);
    }

    public function adminCreate()
    {
        return Inertia::render('Admin/Questionnaire/Create', [
            'title' => 'Buat Kuesioner',
            'description' => 'Halaman untuk membuat kuesioner baru',
        ]);
    }

    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.choices' => ['required', 'array', 'min:1'],
            'questions.*.choices.*.choice' => ['required', 'string'],
            'questions.*.choices.*.point' => ['required', 'integer'],
        ]);

        $questionnaire = Questionnaires::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'is_open' => true,
        ]);

        if ($validated['questions'] === null || count($validated['questions']) === 0) {
            Session::flash('error', 'Kuesioner harus memiliki setidaknya satu pertanyaan');
            return back();
        }

        foreach ($validated['questions'] as $questionData) {
            $createdQuestion = $questionnaire->questions()->create([
                'question' => $questionData['question'],
                'questionnaire_id' => $questionnaire->id,
            ]);
            foreach ($questionData['choices'] as $choice) {
                $createdQuestion->choices()->create([
                    'choice' => $choice['choice'],
                    'point' => $choice['point'],
                    'question_id' => $createdQuestion->id,
                ]);
            }
        }
        Session::flash('success', 'Kuesioner berhasil dibuat');
        return Inertia::location('/admin/questionnaire');
    }

    public function adminEdit($id)
    {
        $questionnaire = Questionnaires::with('questions.choices')->findOrFail($id);
        return Inertia::render('Admin/Questionnaire/Edit', [
            'title' => 'Edit Kuesioner',
            'description' => 'Halaman untuk mengedit kuesioner',
            'questionnaire' => $questionnaire,
        ]);
    }

    public function adminUpdate($id, Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_open' => ['required', 'boolean'],
            'saved_questions' => ['array'],
            'saved_questions.*.id' => ['required', 'integer', 'exists:questions,id'],
            'saved_questions.*.question' => ['required', 'string'],
            'saved_questions.*.choices' => ['required', 'array', 'min:1'],
            'saved_questions.*.choices.*.id' => ['required', 'integer', 'exists:choices,id'],
            'saved_questions.*.choices.*.choice' => ['required', 'string'],
            'saved_questions.*.choices.*.point' => ['required', 'integer'],
            'new_questions' => ['array'],
            'new_questions.*.question' => ['required', 'string'],
            'new_questions.*.choices' => ['required', 'array', 'min:1'],
            'new_questions.*.choices.*.choice' => ['required', 'string'],
            'new_questions.*.choices.*.point' => ['required', 'integer'],
            'deleted_questions' => ['array'],
            'deleted_questions.*' => ['integer', 'exists:questions,id'],
        ]);

        $questionnaire = Questionnaires::findOrFail($id);
        if ($validated['is_open']) {
            Questionnaires::where('id', '!=', $questionnaire->id)->update(['is_open' => false]);
        }
        $questionnaire->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'is_open' => $validated['is_open'],
        ]);


        // Update questions
        if (!empty($validated['saved_questions'])) {
            foreach ($validated['saved_questions'] as $questionData) {
                $question = $questionnaire->questions()->findOrFail($questionData['id']);
                $question->update([
                    'question' => $questionData['question'],
                ]);
                foreach ($questionData['choices'] as $choiceData) {
                    $choice = $question->choices()->findOrFail($choiceData['id']);
                    $choice->update([
                        'choice' => $choiceData['choice'],
                        'point' => $choiceData['point'],
                    ]);
                }
            }
        }

        // new questions
        if (!empty($validated['new_questions'])) {
            foreach ($validated['new_questions'] as $questionData) {
                $createdQuestion = $questionnaire->questions()->create([
                    'question' => $questionData['question'],
                    'questionnaire_id' => $questionnaire->id,
                ]);
                foreach ($questionData['choices'] as $choice) {
                    $createdQuestion->choices()->create([
                        'choice' => $choice['choice'],
                        'point' => $choice['point'],
                        'question_id' => $createdQuestion->id,
                    ]);
                }
            }
        }

        // Delete questions
        if (!empty($validated['deleted_questions'])) {
            foreach ($validated['deleted_questions'] as $questionId) {
                $question = $questionnaire->questions()->find($questionId);
                if ($question) {
                    $question->choices()->delete();
                    $question->delete();
                }
            }
        }

        Session::flash('success', 'Kuesioner berhasil diperbarui');
        return Inertia::location('/admin/questionnaire');
    }

    public function adminDestroy($id)
    {
        $questionnaire = Questionnaires::findOrFail($id);
        $questionnaire->questions()->each(function ($question) {
            $question->choices()->delete();
            $question->delete();
        });
        $questionnaire->delete();

        Session::flash('success', 'Kuesioner berhasil dihapus');
        return Inertia::location('/admin/questionnaire');
    }

    public function guide()
    {
        return Inertia::render('Questionnaires/Guide', [
            'title' => 'Guide',
        ]);
    }

    public function demo()
    {
        return Inertia::render('Questionnaires/Demo', [
            'title' => 'Demo',
        ]);
    }

    public function answerIndex()
    {
        if (!session('answers')) {
            session(['answers' => true]);
        }

        $setting = Settings::first();
        $questionnaire = Questionnaires::with('questions.choices')
            ->where('is_open', true)
            ->first();

        if (!session()->has("question_order_{$questionnaire->id}")) {
            $order = $questionnaire->questions->pluck('id')->toArray();
            shuffle($order);
            session(["question_order_{$questionnaire->id}" => $order]);
        }

        $order = session("question_order_{$questionnaire->id}");
        $questions = $questionnaire->questions->sortBy(function ($q) use ($order) {
            return array_search($q->id, $order);
        })->values();
        $questionnaire->setRelation('questions', $questions);

        return Inertia::render('Questionnaires/AnswerIndex', [
            'title' => 'Kuisioner',
            'questionnaire' => $questionnaire,
            'setting' => $setting,
        ]);
    }
    public function answerStore(Request $request)
    {
        $request->validate([
            'questionnaire_id' => 'required|integer',
            'choices' => 'required|string',
            'essays' => 'required|string',
            'timeLeft' => 'required|integer',
        ]);

        $choices = json_decode($request->choices, true);
        $essays = json_decode($request->essays, true);

        try {
            foreach ($choices as $choice) {
                $questionId = $choice['questionId'];
                foreach ($choice['choices'] as $choiceId) {
                    $point = Choices::where('id', $choiceId)->value('point');

                    Answer::create([
                        'questionnaire_id' => $request->questionnaire_id,
                        'participant_id' => session('participant_id'),
                        'questions_id' => $questionId,
                        'choice_id' => $choiceId,
                        'point' => $point,
                    ]);
                }
            }

            foreach ($essays as $essay) {
                Answer::create([
                    'questionnaire_id' => $request->questionnaire_id,
                    'participant_id' => session('participant_id'),
                    'questions_id' => $essay['questionId'],
                    'essay_answer' => $essay['essay'],
                ]);
            }

            return Session::flash('success', 'Kuesioner berhasil disimpan');
        } catch (\Exception $e) {
            return Session::flash('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}

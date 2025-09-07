<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Laporan Hasil Kuisoner</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
        }

        h2,
        h3 {
            margin: 5px 0;
        }

        .question {
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .question-title {
            font-weight: bold;
            margin: 0;
            padding: 0;
            font-size: 14px;
        }

        .question-text p {
            font-weight: bold;
            margin: 0;
            padding: 0;
        }

        .choice {
            padding: 6px 10px;
            margin: 3px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .choice.correct {
            background-color: #d4edda;
            /* hijau */
            border-color: #28a745;
            font-weight: bold;
        }

        .choice.incorrect {
            background-color: #f8d7da;
            /* merah */
            border-color: #dc3545;
            font-weight: bold;
        }

        .choice.not-selected-correct {
            background-color: #fff3cd;
            /* kuning */
            border: 1px solid #ffeeba;
        }

        .essay-answer {
            padding: 6px 10px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #e2e3e5;
            /* abu */
        }

        .points {
            margin-top: 5px;
            font-style: italic;
        }

        .total {
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            padding: 8px;
            background: #e6ffe6;
        }

        .info-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .info-box {
            margin-top: 7px;
            margin-bottom: 7px;
        }

        .info-box p {
            margin: 4px 0;
            font-size: 14px;
        }
    </style>
</head>

<body>

    {{-- Bagian Header --}}
    <h2>Laporan Hasil Kuisoner</h2>

    <div class="info-container">
        <div class="info-box">
            <p><strong>Judul Kuisoner :</strong>
                {{ optional($participant->answers->first()->question->questionnaire)->name ?? '-' }}</p>
            <p><strong>Deskripsi :</strong>
                {{ optional($participant->answers->first()->question->questionnaire)->description ?? '-' }}</p>
            <p><strong>Total Pertanyaan :</strong> {{ $participant->answers->groupBy('question')->count() }}</p>
        </div>

        <div class="info-box">
            <p><strong>Nama Peserta :</strong> {{ $participant->fullname }}</p>
            <p><strong>Sekolah :</strong> {{ $participant->school->name ?? '-' }}</p>
            <p><strong>Kelas :</strong> {{ $participant->class ?? '-' }}</p>
            <p><strong>NISN :</strong> {{ $participant->nisn ?? '-' }}</p>
        </div>
    </div>

    {{-- Hitung Total Poin --}}
    @php
        $totalPoint = $participant->answers->sum(function ($a) {
            return $a->choice->point ?? ($a->point ?? 0);
        });
    @endphp

    <div class="total">
        <div>Total Poin: {{ $totalPoint }}</div>
        <div>Score: {{ number_format(($totalPoint / 32) * 100, 2) }}</div>
    </div>

    {{-- Daftar Pertanyaan --}}
    @foreach ($participant->answers->groupBy('question') as $i => $answersByQuestion)
        @php
            $question = $answersByQuestion->first()->question;
        @endphp
        <div class="question">
            <table style="width:100%; border-collapse: collapse;">
                <tr>
                    <td style="width:15px;">
                        <h5 class="question-title">
                            {{ $loop->iteration }}.
                        </h5>
                    </td>
                    <td style="vertical-align: top;">
                        <div class="question-text">
                            {!! $question->question ?? '-' !!}
                        </div>
                    </td>
                </tr>
            </table>

            {{-- Loop semua pilihan jawaban --}}
            @foreach ($question->choices as $index => $choice)
                @php
                    $answer = $answersByQuestion->firstWhere('choice_id', $choice->id);
                    $isSelected = !is_null($answer);
                    $isCorrect = ($choice->point ?? 0) > 0;

                    $class = '';
                    if ($isSelected && $isCorrect) {
                        $class = 'correct'; // dipilih & benar
                    } elseif ($isSelected && !$isCorrect) {
                        $class = 'incorrect'; // dipilih & salah
                    } elseif (!$isSelected && $isCorrect) {
                        $class = 'not-selected-correct'; // tidak dipilih tapi sebenarnya benar
                    }
                @endphp
                <div class="choice {{ $class }}">
                    {{ chr(65 + $index) }}. {{ $choice->choice }}
                    @if ($isSelected)
                        <strong>(dipilih)</strong>
                    @endif
                    @if ($isCorrect)
                        <em>(jawaban benar)</em>
                    @endif
                </div>
            @endforeach

            {{-- Jawaban essay jika ada --}}
            @foreach ($answersByQuestion as $ans)
                @if (!$ans->choice_id && $ans->essay_answer)
                    <div class="essay-answer">
                        <div><strong>Jawaban Esai:</strong> {!! $ans->essay_answer !!}</div>
                        <div><em>Poin Essay: {{ $ans->point ?? 0 }}</em></div>
                    </div>
                @endif
            @endforeach

            {{-- Hitung poin per pertanyaan --}}
            @php
                $choicePoints = $answersByQuestion->sum(fn($a) => $a->choice->point ?? 0);
                $essayPoints = $answersByQuestion->sum(fn($a) => $a->choice_id ? 0 : $a->point ?? 0);
                $questionPoints = $choicePoints + $essayPoints;
            @endphp

            <div class="points">
                <div>Poin dari pilihan: {{ $choicePoints }}</div>
                <div>Poin dari essay: {{ $essayPoints }}</div>
                <div><strong>Total poin pertanyaan ini: {{ $questionPoints }}</strong></div>
            </div>
        </div>
    @endforeach

</body>

</html>

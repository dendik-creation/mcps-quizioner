<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Daftar Hasil Kuisioner</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            margin: 20px;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: auto;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 6px 10px;
            text-align: left;
        }

        th {
            background-color: #ffe082;
            font-weight: bold;
            text-align: center;
        }

        td {
            vertical-align: middle;
        }

        .center {
            text-align: center;
        }

        .subtable {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 5px;
        }

        .subtable th,
        .subtable td {
            border: 1px solid #ccc;
            padding: 4px 6px;
        }

        .subtable th {
            background-color: #e6e5e5;
        }

        /* Style untuk print */
        @media print {
            body {
                margin: 10mm;
            }

            .no-print {
                display: none;
            }
        }
    </style>
</head>

<body>

    <h2>Daftar Hasil Kuisioner</h2>

    <table>
        <thead>
            <tr>
                <th style="width:30px;">#</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                <th>Asal Sekolah</th>
                <th>Kuisioner</th>
                <th>Peneliti</th>
                <th style="width:100px;">Poin Terbaru</th>
                <th style="width:100px;">Score</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($answers as $i => $data)
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td>{{ $data->participant->fullname }}</td>
                    <td>{{ $data->participant->nisn }}</td>
                    <td>{{ $data->participant->school->name }}</td>
                    <td>{{ $data->questionnaire->name }}</td>
                    <td>{{ $data->researcher->name ?? '-' }}</td>
                    <td class="center">{{ $data->total_points ?? '-' }}</td>
                    <td class="center">{{ number_format($data->score, 2) }}</td>
                </tr>

                @php
                    $subDetails = $details->where('participant_id', $data->participant_id)
                                           ->where('questionnaire_id', $data->questionnaire_id);
                @endphp

                @if($subDetails->count() > 0)
                    <tr>
                        <td colspan="8">
                            <table class="subtable">
                                <thead>
                                    <tr>
                                        @foreach ($subDetails as $d)
                                            <th class="center">Soal {{ $d->soal }}</th>
                                        @endforeach
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        @foreach ($subDetails as $d)
                                            <td class="center">{{ $d->point_tier_1 }} dan {{ $d->point_tier_2 ? $d->point_tier_2 : '0' }}</td>
                                        @endforeach
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif

            @endforeach
        </tbody>
    </table>

</body>

</html>

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
            padding: 8px 10px;
            text-align: left;
        }

        th {
            background-color: #ffe082;
            /* kuning seperti contoh */
            font-weight: bold;
            text-align: center;
        }

        td {
            vertical-align: middle;
        }

        .center {
            text-align: center;
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
            @endforeach
        </tbody>
    </table>

</body>

</html>

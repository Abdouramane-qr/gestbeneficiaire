{{-- <!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Liste des Promoteurs</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
        }
        h1 {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
            color: #2563EB;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #4285F4;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            font-size: 12px;
        }
        td {
            border-bottom: 1px solid #E5E7EB;
            padding: 8px;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background-color: #F9FAFB;
        }
        .page-footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #6B7280;
        }
    </style>
</head>
<body>
    <h1>LISTE DES PROMOTEURS</h1>

    <table>
        <thead>
            <tr>
                <th>Nom & Prénom</th>
                <th>Région</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Niveau d'instruction</th>
            </tr>
        </thead>
        <tbody>
            @foreach($beneficiaires as $beneficiaire)
            <tr>
                <td>{{ $beneficiaire->nom }} {{ $beneficiaire->prenom }}</td>
                <td>{{ $beneficiaire->regions }}</td>
                <td>{{ $beneficiaire->contact }}</td>
                <td>{{ $beneficiaire->type_beneficiaire }}</td>
                <td>{{ $beneficiaire->niveau_instruction }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="page-footer">
        Document généré le {{ date('d/m/Y') }} - Total: {{ count($beneficiaires) }} promoteurs - Système de Suivi des PME
    </div>
</body>
</html> --}}

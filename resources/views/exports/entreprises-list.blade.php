<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Liste des Entreprises</title>
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
    <h1>LISTE DES ENTREPRISES</h1>

    <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Secteur</th>
                <th>Date création</th>
                <th>Statut</th>
                <th>Ville</th>
                <th>Promoteur</th>
            </tr>
        </thead>
        <tbody>
            @foreach($entreprises as $entreprise)
            <tr>
                <td>{{ $entreprise->nom_entreprise }}</td>
                <td>{{ $entreprise->secteur_activite }}</td>
                <td>{{ $entreprise->date_creation ? date('d/m/Y', strtotime($entreprise->date_creation)) : 'N/A' }}</td>
                <td>{{ $entreprise->statut_juridique }}</td>
                <td>{{ $entreprise->ville }}</td>
                <td>{{ $entreprise->beneficiaire ? $entreprise->beneficiaire->nom . ' ' . $entreprise->beneficiaire->prenom : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="page-footer">
        Document généré le {{ date('d/m/Y') }} - Total: {{ count($entreprises) }} entreprises - Système de Suivi des PME
    </div>
</body>
</html>

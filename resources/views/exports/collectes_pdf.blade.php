<!-- resources/views/exports/collectes_pdf.blade.php -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des collectes</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
            position: relative;
        }
        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            height: auto;
        }
        .header h1 {
            color: #2c5282;
            margin-bottom: 5px;
        }
        .meta-info {
            font-size: 9pt;
            color: #666;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #4F81BD;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            font-size: 9pt;
        }
        td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            font-size: 9pt;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 8pt;
            color: #666;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
        .brouillon {
            color: #d97706;
            font-style: italic;
        }
        .standard {
            color: #059669;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logo.png') }}" class="logo" alt="Logo">
        <h1>Liste des collectes</h1>
        <div class="meta-info">
            <p>Exporté le: {{ $date_export }} par {{ $user }}</p>
            <p>Total: {{ count($collectes) }} collecte(s)</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Entreprise</th>
                <th>Exercice</th>
                <th>Période</th>
                <th>Date collecte</th>
                <th>Type</th>
                <th>Collecté par</th>
            </tr>
        </thead>
        <tbody>
            @foreach($collectes as $collecte)
            <tr>
                <td>{{ $collecte->entreprise->nom_entreprise }}</td>
                <td>{{ $collecte->exercice->annee }}</td>
                <td>
                    @if(is_object($collecte->periode))
                        {{ $collecte->periode->type_periode }}
                    @elseif(is_string($collecte->periode))
                        {{ $collecte->periode }}
                    @else
                        Non spécifié
                    @endif
                </td>
                <td>{{ $collecte->date_collecte->format('d/m/Y') }}</td>
                <td class="{{ $collecte->type_collecte === 'brouillon' ? 'brouillon' : 'standard' }}">
                    {{ $collecte->type_collecte === 'brouillon' ? 'Brouillon' : 'Standard' }}
                </td>
                <td>{{ $collecte->user ? $collecte->user->name : 'Non spécifié' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Suivi-PME - Rapport généré automatiquement - Page <span class="pagenum"></span>
    </div>
</body>
</html>

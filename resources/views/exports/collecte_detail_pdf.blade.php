<!-- resources/views/exports/collecte_detail_pdf.blade.php -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détail de collecte</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #333;
        }
        .header {
            position: relative;
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }
        .logo {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: auto;
        }
        .header h1 {
            color: #2c5282;
            margin-bottom: 5px;
            font-size: 18pt;
        }
        .meta-info {
            font-size: 9pt;
            color: #666;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            color: #2c5282;
            font-size: 14pt;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .info-table td {
            padding: 6px;
            border-bottom: 1px solid #f0f0f0;
        }
        .info-table .label {
            font-weight: bold;
            width: 40%;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            background-color: #4F81BD;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            font-size: 9pt;
        }
        .data-table td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            font-size: 9pt;
        }
        .data-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .brouillon {
            color: #d97706;
            font-style: italic;
        }
        .standard {
            color: #059669;
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
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('logo.png') }}" class="logo" alt="Logo">
        <h1>Détail de collecte</h1>
        <div class="meta-info">
            <p>
                Entreprise: <strong>{{ $collecte->entreprise->nom_entreprise }}</strong> |
                Période: <strong>
                    @if(is_object($collecte->periode))
                        {{ $collecte->periode->type_periode }}
                    @elseif(is_string($collecte->periode))
                        {{ $collecte->periode }}
                    @else
                        Non spécifié
                    @endif
                </strong> |
                Exercice: <strong>{{ $collecte->exercice->annee }}</strong>
            </p>
            <p>Exporté le: {{ $date_export }} par {{ $user }}</p>
        </div>
    </div>

    <!-- Informations de la collecte -->
    <div class="section">
        <h2>Informations de la collecte</h2>
        <table class="info-table">
            <tr>
                <td class="label">Date de collecte</td>
                <td>{{ $collecte->date_collecte->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Type</td>
                <td class="{{ $collecte->type_collecte === 'brouillon' ? 'brouillon' : 'standard' }}">
                    {{ $collecte->type_collecte === 'brouillon' ? 'Brouillon' : 'Standard' }}
                </td>
            </tr>
            <tr>
                <td class="label">Créé par</td>
                <td>{{ $collecte->user ? $collecte->user->name : 'Non spécifié' }}</td>
            </tr>
            <tr>
                <td class="label">Créé le</td>
                <td>{{ $collecte->created_at->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td class="label">Dernière modification</td>
                <td>{{ $collecte->updated_at->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>

    <!-- Données collectées par catégorie -->
    @foreach($categoriesDisponibles as $category)
        @if(isset($collecte->donnees[$category]) && count($collecte->donnees[$category]) > 0)
            <div class="section">
                <h2>
                    @switch($category)
                        @case('financier') Indicateurs Financiers @break
                        @case('commercial') Indicateurs Commerciaux @break
                        @case('production') Production @break
                        @case('rh') Ressources Humaines @break
                        @case('tresorerie') Trésorerie @break
                        @default {{ ucfirst($category) }} @break
                    @endswitch
                </h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Indicateur</th>
                            <th>Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($collecte->donnees[$category] as $key => $value)
                            <tr>
                                <td>{{ $key }}</td>
                                <td>
                                    @if(is_numeric($value))
                                        {{ number_format($value, 2, ',', ' ') }}
                                    @else
                                        {{ $value }}
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    @endforeach

    <div class="footer">
        Suivi-Promoteurs - Rapport généré automatiquement - Page <span class="pagenum"></span>
    </div>
</body>
</html>

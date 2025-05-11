{{-- <!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Détails du Promoteur: {{ $beneficiaire->nom }} {{ $beneficiaire->prenom }}</title>
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
        h2 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #1F2937;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 5px;
        }
        .section {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #F9FAFB;
            border-radius: 5px;
        }
        .label {
            font-weight: bold;
            width: 40%;
            display: inline-block;
        }
        .value {
            display: inline-block;
            width: 60%;
        }
        .row {
            margin-bottom: 8px;
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
    <h1>FICHE DÉTAILLÉE DU PROMOTEUR</h1>
    <h2 style="text-align: center;">{{ $beneficiaire->nom }} {{ $beneficiaire->prenom }}</h2>

    <div class="section">
        <h2>Informations personnelles</h2>
        <div class="row">
            <span class="label">Nom complet :</span>
            <span class="value">{{ $beneficiaire->nom }} {{ $beneficiaire->prenom }}</span>
        </div>
        <div class="row">
            <span class="label">Genre :</span>
            <span class="value">{{ $beneficiaire->genre }}</span>
        </div>
        <div class="row">
            <span class="label">Date de naissance :</span>
            <span class="value">{{ $beneficiaire->date_de_naissance ? date('d/m/Y', strtotime($beneficiaire->date_de_naissance)) : 'Non spécifié' }}</span>
        </div>
        <div class="row">
            <span class="label">Situation de handicap :</span>
            <span class="value">{{ $beneficiaire->handicap ? 'Oui' : 'Non' }}</span>
        </div>
        <div class="row">
            <span class="label">Contact :</span>
            <span class="value">{{ $beneficiaire->contact }}</span>
        </div>
        @if($beneficiaire->email)
        <div class="row">
            <span class="label">Email :</span>
            <span class="value">{{ $beneficiaire->email }}</span>
        </div>
        @endif
    </div>

    <div class="section">
        <h2>Localisation</h2>
        <div class="row">
            <span class="label">Région :</span>
            <span class="value">{{ $beneficiaire->regions }}</span>
        </div>
        <div class="row">
            <span class="label">Province :</span>
            <span class="value">{{ $beneficiaire->provinces }}</span>
        </div>
        <div class="row">
            <span class="label">Commune :</span>
            <span class="value">{{ $beneficiaire->communes }}</span>
        </div>
        @if($beneficiaire->village)
        <div class="row">
            <span class="label">Village :</span>
            <span class="value">{{ $beneficiaire->village }}</span>
        </div>
        @endif
    </div>

    <div class="section">
        <h2>Éducation et Activité</h2>
        <div class="row">
            <span class="label">Type de bénéficiaire :</span>
            <span class="value">{{ $beneficiaire->type_beneficiaire }}</span>
        </div>
        <div class="row">
            <span class="label">Niveau d'instruction :</span>
            <span class="value">{{ $beneficiaire->niveau_instruction }}</span>
        </div>
    </div>

    <div class="page-footer">
        Document généré le {{ date('d/m/Y') }} - Système de Suivi des PME
    </div>
</body>
</html> --}}

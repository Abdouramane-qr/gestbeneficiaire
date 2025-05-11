<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 20px;
            color: #333;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 10px;
        }
        h1 {
            color: #2c5282;
            font-size: 20px;
            margin: 0;
            padding: 0;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        .info-section {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            background-color: #f8f9fa;
        }
        h2 {
            color: #4a5568;
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 15px;
            row-gap: 8px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dotted #eee;
            padding: 4px 0;
        }
        .label {
            font-weight: bold;
            color: #4a5568;
        }
        .value {
            text-align: right;
            color: #2d3748;
        }
        .page-break {
            page-break-after: always;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
            margin-top: 30px;
        }
        .type-badge {
            display: inline-block;
            padding: 3px 8px;
            background: #4299e1;
            color: white;
            border-radius: 12px;
            font-size: 10px;
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        @if(file_exists(public_path('logo.png')))
            <img src="{{ public_path('logo.png') }}" alt="Logo" class="logo">
        @endif
        <h1>{{ $title }}</h1>
        <div class="subtitle">Document généré le {{ $date }}</div>
    </div>

    <!-- Informations Personnelles -->
    <div class="info-section">
        <h2>Informations Personnelles</h2>
        <div class="info-grid">
            <div class="info-row">
                <span class="label">Nom</span>
                <span class="value">{{ $beneficiaire->nom }}</span>
            </div>
            <div class="info-row">
                <span class="label">Prénom</span>
                <span class="value">{{ $beneficiaire->prenom }}</span>
            </div>
            <div class="info-row">
                <span class="label">Genre</span>
                <span class="value">{{ $beneficiaire->genre }}</span>
            </div>
            <div class="info-row">
                <span class="label">Date de naissance</span>
                <span class="value">{{ \Carbon\Carbon::parse($beneficiaire->date_de_naissance)->format('d/m/Y') }}</span>
            </div>
            <div class="info-row">
                <span class="label">Type de promoteur</span>
                <span class="value">{{ $beneficiaire->type_beneficiaire }}</span>
            </div>

            <div class="info-row">
                <span class="label">Niveau d'instruction</span>
                <span class="value">{{ $beneficiaire->niveau_instruction }}</span>
            </div>
        </div>
    </div>

    <!-- Contact et Localisation -->
    <div class="info-section">
        <h2>Contact et Localisation</h2>
        <div class="info-grid">
            <div class="info-row">
                <span class="label">Contact</span>
                <span class="value">{{ $beneficiaire->contact }}</span>
            </div>
            <div class="info-row">
                <span class="label">Email</span>
                <span class="value">{{ $beneficiaire->email ?: 'Non spécifié' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Région</span>
                <span class="value">{{ $beneficiaire->regions }}</span>
            </div>
            <div class="info-row">
                <span class="label">Province</span>
                <span class="value">{{ $beneficiaire->provinces }}</span>
            </div>
            <div class="info-row">
                <span class="label">Commune</span>
                <span class="value">{{ $beneficiaire->communes }}</span>
            </div>
            <div class="info-row">
                <span class="label">Village</span>
                <span class="value">{{ $beneficiaire->village ?: 'Non spécifié' }}</span>
            </div>
        </div>
    </div>

    <!-- Activité professionnelle -->
    <div class="info-section">
        <h2>Activité professionnelle</h2>
        <div class="info-grid">
            <div class="info-row">
                <span class="label">Activité</span>
                <span class="value">{{ $beneficiaire->activite ?: 'Non spécifié' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Domaine d'activité</span>
                <span class="value">{{ $beneficiaire->domaine_activite ?: 'Non spécifié' }}</span>
            </div>
            <div class="info-row">
                <span class="label">Niveau mise en œuvre</span>
                <span class="value">{{ $beneficiaire->niveau_mise_en_oeuvre ?: 'Non spécifié' }}</span>
            </div>
            @if($beneficiaire->date_inscription)
            <div class="info-row">
                <span class="label">Date d'inscription</span>
                <span class="value">{{ \Carbon\Carbon::parse($beneficiaire->date_inscription)->format('d/m/Y') }}</span>
            </div>
            @endif
            @if($beneficiaire->statut_actuel)
            <div class="info-row">
                <span class="label">Statut actuel</span>
                <span class="value">{{ $beneficiaire->statut_actuel }}</span>
            </div>
            @endif
        </div>
    </div>

    <!-- Métadonnées -->
    <div class="footer">
        <p>Promoteur ID: {{ $beneficiaire->id }} | Créé le: {{ \Carbon\Carbon::parse($beneficiaire->created_at)->format('d/m/Y') }}
        @if($beneficiaire->updated_at)
            | Dernière modification: {{ \Carbon\Carbon::parse($beneficiaire->updated_at)->format('d/m/Y') }}
        @endif
        </p>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Détails de l'entreprise: {{ $entreprise->nom_entreprise }}</title>
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
    <h1>FICHE DÉTAILLÉE DE L'ENTREPRISE</h1>
    <h2 style="text-align: center;">{{ $entreprise->nom_entreprise }}</h2>

    <div class="section">
        <h2>Informations générales</h2>
        <div class="row">
            <span class="label">Nom :</span>
            <span class="value">{{ $entreprise->nom_entreprise }}</span>
        </div>
        <div class="row">
            <span class="label">Secteur d'activité :</span>
            <span class="value">{{ $entreprise->secteur_activite }}</span>
        </div>
        <div class="row">
            <span class="label">Date de création :</span>
            <span class="value">{{ $entreprise->date_creation ? date('d/m/Y', strtotime($entreprise->date_creation)) : 'Non spécifié' }}</span>
        </div>
        <div class="row">
            <span class="label">Statut juridique :</span>
            <span class="value">{{ $entreprise->statut_juridique }}</span>
        </div>
        @if($entreprise->niveau_mise_en_oeuvre)
        <div class="row">
            <span class="label">Niveau de mise en œuvre :</span>
            <span class="value">{{ $entreprise->niveau_mise_en_oeuvre }}</span>
        </div>
        @endif
    </div>

    @if($entreprise->beneficiaire)
    <div class="section">
        <h2>Promoteur</h2>
        <div class="row">
            <span class="label">Nom complet :</span>
            <span class="value">{{ $entreprise->beneficiaire->nom }} {{ $entreprise->beneficiaire->prenom }}</span>
        </div>
        @if($entreprise->beneficiaire->contact)
        <div class="row">
            <span class="label">Contact :</span>
            <span class="value">{{ $entreprise->beneficiaire->contact }}</span>
        </div>
        @endif
        @if($entreprise->beneficiaire->email)
        <div class="row">
            <span class="label">Email :</span>
            <span class="value">{{ $entreprise->beneficiaire->email }}</span>
        </div>
        @endif
    </div>
    @endif

    <div class="section">
        <h2>Coordonnées</h2>
        @if($entreprise->adresse)
        <div class="row">
            <span class="label">Adresse :</span>
            <span class="value">{{ $entreprise->adresse }}</span>
        </div>
        @endif
        <div class="row">
            <span class="label">Ville :</span>
            <span class="value">{{ $entreprise->ville }}</span>
        </div>
        <div class="row">
            <span class="label">Pays :</span>
            <span class="value">{{ $entreprise->pays }}</span>
        </div>
    </div>

    @if($entreprise->description)
    <div class="section">
        <h2>Description</h2>
        <p>{{ $entreprise->description }}</p>
    </div>
    @endif

    @if($entreprise->domaine_activite)
    <div class="section">
        <h2>Domaine d'activité</h2>
        <p>{{ $entreprise->domaine_activite }}</p>
    </div>
    @endif

    @if($entreprise->ong || $entreprise->institutionFinanciere)
    <div class="section">
        <h2>Partenaires</h2>
        @if($entreprise->ong)
        <h3>ONG d'appui</h3>
        <div class="row">
            <span class="label">Nom :</span>
            <span class="value">{{ $entreprise->ong->nom }} @if($entreprise->ong->sigle) ({{ $entreprise->ong->sigle }}) @endif</span>
        </div>
        @if($entreprise->ong->adresse)
        <div class="row">
            <span class="label">Adresse :</span>
            <span class="value">{{ $entreprise->ong->adresse }}</span>
        </div>
        @endif
        @endif

        @if($entreprise->institutionFinanciere)
        <h3>Institution financière</h3>
        <div class="row">
            <span class="label">Nom :</span>
            <span class="value">{{ $entreprise->institutionFinanciere->nom }}</span>
        </div>
        @if($entreprise->institutionFinanciere->adresse)
        <div class="row">
            <span class="label">Adresse :</span>
            <span class="value">{{ $entreprise->institutionFinanciere->adresse }}</span>
        </div>
        @endif
        @endif
    </div>
    @endif

    <div class="page-footer">
        Document généré le {{ date('d/m/Y') }} - Système de Suivi des PME
    </div>
</body>
</html>

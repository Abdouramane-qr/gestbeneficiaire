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
            font-size: 11px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
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
        .filters {
            margin-bottom: 15px;
            padding: 8px;
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }
        .filter-label {
            font-weight: bold;
            margin-right: 10px;
        }
        .filter-value {
            background-color: #ebf4ff;
            padding: 2px 8px;
            border-radius: 10px;
            margin-right: 5px;
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
            font-size: 10px;
        }
        td {
            border-bottom: 1px solid #ddd;
            padding: 8px;
            vertical-align: top;
        }
        tr:nth-child(even) {
            background-color: #f5f5f5;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .type-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #4299e1;
            color: white;
            border-radius: 10px;
            font-size: 9px;
        }
        .page-break {
            page-break-after: always;
        }
        .pagination {
            text-align: right;
            font-size: 10px;
            margin-top: 10px;
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

    @if($filtres && (isset($filtres['type']) || isset($filtres['search'])))
    <div class="filters">
        @if(isset($filtres['type']))
            <span class="filter-label">Type de promoteur:</span>
            <span class="filter-value">{{ $filtres['type'] }}</span>
        @endif
        @if(isset($filtres['search']))
            <span class="filter-label">Recherche:</span>
            <span class="filter-value">{{ $filtres['search'] }}</span>
        @endif
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 5%">ID</th>
                <th style="width: 18%">Nom & Prénom</th>
                <th style="width: 12%">Type</th>
                <th style="width: 12%">Région</th>
                <th style="width: 10%">Contact</th>
                <th style="width: 13%">Niveau instruction</th>
                <th style="width: 15%">Activité</th>
                <th style="width: 15%">Domaine</th>
            </tr>
        </thead>
        <tbody>
            @forelse($beneficiaires as $beneficiaire)
                <tr>
                    <td>{{ $beneficiaire->id }}</td>
                    <td>
                        <strong>{{ $beneficiaire->nom }} {{ $beneficiaire->prenom }}</strong>
                        <br>
                        <small>{{ $beneficiaire->genre }}</small>
                    </td>
                    <td>
                        <span class="type-badge">{{ $beneficiaire->type_beneficiaire }}</span>
                    </td>
                    <td>
                        {{ $beneficiaire->regions }}
                        <br>
                        <small>{{ $beneficiaire->communes }}</small>
                    </td>
                    <td>{{ $beneficiaire->contact }}</td>
                    <td>{{ $beneficiaire->niveau_instruction }}</td>
                    <td>{{ $beneficiaire->activite ?: '-' }}</td>
                    <td>{{ $beneficiaire->domaine_activite ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Aucun promoteur trouvé</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="pagination">
        Page <span class="pagenum"></span>
    </div>

    <div class="footer">
        <p>Total : {{ $beneficiaires->count() }} promoteur(s)</p>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $text = "Page {PAGE_NUM} / {PAGE_COUNT}";
            $size = 10;
            $font = $fontMetrics->getFont("DejaVu Sans");
            $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
            $x = ($pdf->get_width() - $width) - 40;
            $y = $pdf->get_height() - 35;
            $pdf->page_text($x, $y, $text, $font, $size);
        }
    </script>
</body>
</html>

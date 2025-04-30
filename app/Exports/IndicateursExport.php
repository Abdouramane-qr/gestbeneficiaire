<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use App\Services\IndicateursAnalyseService;

class IndicateursExport implements WithMultipleSheets
{
    protected $data;
    protected $periode;
    protected $annee;
    protected $entreprise;
    protected $entrepriseId;
    protected $categories;

    public function __construct($entreprise, int $annee, ?string $periode = null)
{
    // Validation initiale
    if ($entreprise === null) {
        throw new \InvalidArgumentException("Le paramètre entreprise ne peut pas être null");
    }

    $this->annee = $annee;
    $this->periode = $periode;

    // Extraction robuste de l'ID
    if (is_int($entreprise) || ctype_digit($entreprise)) {
        $this->entrepriseId = (int)$entreprise;
        $this->entreprise = ['id' => $this->entrepriseId];
    }
    elseif (is_object($entreprise)) {
        if (!property_exists($entreprise, 'id')) {
            throw new \InvalidArgumentException("L'objet entreprise doit avoir une propriété 'id'");
        }
        $this->entrepriseId = (int)$entreprise->id;
        $this->entreprise = $entreprise;
    }
    elseif (is_array($entreprise)) {
        if (!array_key_exists('id', $entreprise)) {
            throw new \InvalidArgumentException("Le tableau entreprise doit contenir une clé 'id'");
        }
        $this->entrepriseId = (int)$entreprise['id'];
        $this->entreprise = $entreprise;
    }
    else {
        throw new \InvalidArgumentException(sprintf(
            "Format d'entreprise invalide. Reçu: %s. Attendu: ID numérique, objet ou tableau avec 'id'",
            gettype($entreprise)
        ));
    }

    // Validation finale de l'ID
    if ($this->entrepriseId <= 0) {
        throw new \InvalidArgumentException("L'ID de l'entreprise doit être un entier positif. Reçu: {$this->entrepriseId}");
    }

    // Initialisation du service
    try {
        $analyseService = app(IndicateursAnalyseService::class);
        $this->data = $analyseService->getIndicateursForExport($this->entrepriseId, $annee, $periode);

        $this->categories = collect($this->data)
            ->pluck('categorie')
            ->unique()
            ->values()
            ->all();

        Log::debug('Export initialisé avec succès', [
            'entreprise_id' => $this->entrepriseId,
            'categories' => $this->categories
        ]);

    } catch (\Exception $e) {
        Log::error('Échec de l\'initialisation de l\'export', [
            'error' => $e->getMessage(),
            'entreprise_id' => $this->entrepriseId
        ]);
        throw new \RuntimeException("Erreur lors de la préparation de l'export: ".$e->getMessage());
    }
}
    public function sheets(): array
    {
        $sheets = [];
        $sheets[] = new IndicateursSummarySheet($this->entreprise, $this->annee, $this->periode);

        foreach ($this->categories as $categorie) {
            $categorieData = collect($this->data)->where('categorie', $categorie)->values();
            $sheets[] = new IndicateursCategorieSheet($categorieData, $categorie);
        }

        $sheets[] = new IndicateursEvolutionSheet($this->entrepriseId, $this->annee);

        return $sheets;
    }
}

class IndicateursSummarySheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithMapping, ShouldAutoSize
{
    protected $data;
    protected $entreprise;
    protected $entrepriseId;
    protected $annee;
    protected $periode;
    protected $categories;

    public function __construct($entreprise, int $annee, ?string $periode = null)
    {
        if (is_object($entreprise)) {
            $this->entrepriseId = (int) $entreprise->id;
        } elseif (is_array($entreprise)) {
            $this->entrepriseId = isset($entreprise['id']) ? (int) $entreprise['id'] : null;
        } else {
            $this->entrepriseId = (int) $entreprise;
        }

        if ($this->entrepriseId <= 0) {
            throw new \InvalidArgumentException("L'identifiant de l'entreprise doit être un entier positif.");
        }

        $this->entreprise = $entreprise;
        $this->annee = $annee;
        $this->periode = $periode;

        $analyseService = app(IndicateursAnalyseService::class);
        $this->data = $analyseService->getIndicateursForExport($this->entrepriseId, $annee, $periode);
        $this->categories = collect($this->data)->pluck('categorie')->unique()->values()->all();
    }

    public function title(): string
    {
        return 'Tableau de bord';
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Libellé',
            'Catégorie',
            'Valeur',
            'Unité',
            'Valeur cible',
            'Écart',
            'Période',
            'Date de calcul'
        ];
    }

    public function map($row): array
    {
        $ecart = '';
        if (isset($row['valeur'], $row['valeur_cible']) && is_numeric($row['valeur']) && is_numeric($row['valeur_cible'])) {
            $ecart = $row['valeur'] - $row['valeur_cible'];
        }

        return [
            $row['id'] ?? '',
            $row['libelle'] ?? '',
            $row['categorie'] ?? '',
            $row['valeur'] ?? '',
            $row['unite'] ?? '',
            $row['valeur_cible'] ?? '',
            $ecart,
            $row['periode'] ?? $this->periode ?? '',
            $row['date_calcul'] ?? now()->format('d/m/Y')
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:I1');
        $sheet->setCellValue('A1', 'TABLEAU DE BORD DES INDICATEURS - ' . $this->annee);
        $sheet->mergeCells('A2:I2');
        $nom = is_object($this->entreprise) ? $this->entreprise->nom_entreprise : 'Entreprise #' . $this->entreprise;
        $sheet->setCellValue('A2', $nom . ($this->periode ? ' - ' . $this->periode : ''));
        $sheet->mergeCells('A3:I3');
        $sheet->setCellValue('A3', 'Export généré le ' . now()->format('d/m/Y à H:i'));

        $totalRows = count($this->data) + 4;
        for ($i = 5; $i <= $totalRows; $i += 2) {
            $sheet->getStyle("A{$i}:I{$i}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'color' => ['rgb' => 'F9F9F9']]
            ]);
        }

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 16],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'color' => ['rgb' => 'E0E0E0']]
            ],
            2 => [
                'font' => ['bold' => true, 'size' => 12],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
            ],
            3 => [
                'font' => ['italic' => true, 'size' => 10],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_RIGHT]
            ],
            4 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'color' => ['rgb' => '4472C4']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
            ],
            'A5:I' . $totalRows => [
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CCCCCC']]],
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER]
            ]
        ];
    }
}

class IndicateursCategorieSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $data;
    protected $categorie;

    public function __construct($data, string $categorie)
    {
        $this->data = $data;
        $this->categorie = $categorie;
    }

    public function title(): string
    {
        return substr($this->categorie, 0, 31);
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Libellé',
            'Valeur',
            'Unité',
            'Valeur cible',
            'Écart',
            'Période',
            'Date de calcul'
        ];
    }

    public function map($row): array
    {
        $ecart = '';
        if (isset($row['valeur'], $row['valeur_cible']) &&
            is_numeric($row['valeur']) && is_numeric($row['valeur_cible'])) {
            $ecart = $row['valeur'] - $row['valeur_cible'];
        }

        return [
            $row['id'] ?? '',
            $row['libelle'] ?? '',
            $row['valeur'] ?? '',
            $row['unite'] ?? '',
            $row['valeur_cible'] ?? '',
            $ecart,
            $row['periode'] ?? '',
            $row['date_calcul'] ?? now()->format('d/m/Y')
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => ['rgb' => '305496']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN
                    ]
                ]
            ]
        ];
    }
}

class IndicateursEvolutionSheet implements FromArray, WithTitle, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $entrepriseId;
    protected $annee;
    protected $data;

    public function __construct(int $entrepriseId, int $annee)
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;

        $service = app(IndicateursAnalyseService::class);
        $this->data = $service->getIndicateurEvolutionData($entrepriseId, $annee, 'all');
    }

    public function title(): string
    {
        return 'Évolution';
    }

    public function headings(): array
    {
        return [
            'ID',
            'Libellé',
            'Catégorie',
            'Année',
            'Période',
            'Valeur',
            'Unité'
        ];
    }

    public function array(): array
    {
        return collect($this->data)->map(function ($item) {
            return [
                $item['id'] ?? '',
                $item['libelle'] ?? '',
                $item['categorie'] ?? '',
                $item['annee'] ?? '',
                $item['periode'] ?? '',
                $item['valeur'] ?? '',
                $item['unite'] ?? ''
            ];
        })->toArray();
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => ['rgb' => '70AD47']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN
                    ]
                ]
            ]
        ];
    }
}

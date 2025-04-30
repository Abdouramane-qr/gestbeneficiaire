<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCharts;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use Illuminate\Support\Collection;
use App\Models\Entreprise;
use App\Services\IndicateursAnalyseService;

/**
 * Feuille d'évolution des indicateurs dans le temps
 */
class IndicateursEvolutionSheet implements
    FromCollection,
    WithTitle,
    WithHeadings,
    WithStyles,
    WithMapping,
    ShouldAutoSize,
    WithCharts
{
    protected $entrepriseId;
    protected $annee;
    protected $data;
    protected $entreprise;

    /**
     * Constructeur
     *
     * @param int $entrepriseId ID de l'entreprise
     * @param int $annee Année de référence
     */
    public function __construct(int $entrepriseId, int $annee)
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;

        // Récupérer l'entreprise
        $this->entreprise = Entreprise::find($entrepriseId);

        // Récupérer les données d'évolution
        $analyseService = app(IndicateursAnalyseService::class);
        $this->data = $analyseService->getEvolutionIndicateurs($entrepriseId, $annee);
    }

    /**
     * Retourne le titre de la feuille
     *
     * @return string Titre de la feuille
     */
    public function title(): string
    {
        return 'Évolution des indicateurs';
    }

    /**
     * Retourne les données pour la feuille
     *
     * @return Collection Collection de données
     */
    public function collection()
    {
        // Transformer les données pour les adapter au format de la feuille
        $flatData = collect();

        foreach ($this->data as $indicateur) {
            foreach ($indicateur['historique'] as $historique) {
                $flatData->push([
                    'id' => $indicateur['id'],
                    'libelle' => $indicateur['libelle'],
                    'categorie' => $indicateur['categorie'] ?? '',
                    'periode' => $historique['periode'],
                    'annee' => $historique['annee'],
                    'valeur' => $historique['valeur'],
                    'valeur_cible' => $historique['valeur_cible'] ?? null,
                    'tendance' => $historique['tendance']
                ]);
            }
        }

        return $flatData;
    }

    /**
     * Définit les entêtes de colonnes
     *
     * @return array Entêtes de colonnes
     */
    public function headings(): array
    {
        return [
            'ID',
            'Indicateur',
            'Catégorie',
            'Période',
            'Année',
            'Valeur',
            'Valeur cible',
            'Évolution'
        ];
    }

    /**
     * Transforme les données pour l'affichage
     *
     * @param mixed $row Ligne de données
     * @return array Données formatées
     */
    public function map($row): array
    {
        // Formater la tendance
        $tendance = '';
        if (isset($row['tendance'])) {
            if ($row['tendance'] > 0) {
                $tendance = '↑ Hausse';
            } elseif ($row['tendance'] < 0) {
                $tendance = '↓ Baisse';
            } else {
                $tendance = '→ Stable';
            }
        }

        return [
            $row['id'],
            $row['libelle'],
            $row['categorie'],
            $row['periode'],
            $row['annee'],
            $row['valeur'],
            $row['valeur_cible'],
            $tendance
        ];
    }

    /**
     * Applique des styles à la feuille
     *
     * @param Worksheet $sheet Feuille de calcul
     * @return array Styles appliqués
     */
    public function styles(Worksheet $sheet)
    {
        // Titre
        $sheet->mergeCells('A1:H1');
        $entrepriseName = $this->entreprise ? $this->entreprise->nom_entreprise : "Entreprise #".$this->entrepriseId;
        $sheet->setCellValue('A1', 'ÉVOLUTION DES INDICATEURS - ' . $entrepriseName);

        // Sous-titre
        $sheet->mergeCells('A2:H2');
        $sheet->setCellValue('A2', 'Année de référence: ' . $this->annee);

        // Date d'export
        $sheet->mergeCells('A3:H3');
        $sheet->setCellValue('A3', 'Export généré le ' . now()->format('d/m/Y'));

        // Appliquer un style conditionnel pour la colonne "Évolution"
        $rowCount = $this->collection()->count() + 4; // +4 pour les entêtes et titres

        for ($i = 5; $i <= $rowCount; $i++) {
            $cellH = $sheet->getCell('H' . $i)->getValue();

            if (strpos($cellH, 'Hausse') !== false) {
                $sheet->getStyle('H' . $i)->applyFromArray([
                    'font' => [
                        'color' => ['rgb' => '008800']
                    ]
                ]);
            } elseif (strpos($cellH, 'Baisse') !== false) {
                $sheet->getStyle('H' . $i)->applyFromArray([
                    'font' => [
                        'color' => ['rgb' => 'FF0000']
                    ]
                ]);
            }
        }

        return [
            // Style du titre
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => '333333']
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => ['rgb' => 'E0E0E0']
                ]
            ],
            // Style du sous-titre
            2 => [
                'font' => [
                    'bold' => true,
                    'size' => 12
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER
                ]
            ],
            // Style de la date d'export
            3 => [
                'font' => [
                    'italic' => true,
                    'size' => 10
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_RIGHT
                ]
            ],
            // Style des entêtes
            4 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => ['rgb' => '4472C4']
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000']
                    ]
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ],
            // Style des données
            'A5:H' . $rowCount => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC']
                    ]
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ],
            // Style alterné pour les lignes de données
            'evenStripes' => function(Worksheet $sheet) use ($rowCount) {
                for ($i = 5; $i <= $rowCount; $i += 2) {
                    $sheet->getStyle('A' . $i . ':H' . $i)->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'color' => ['rgb' => 'F9F9F9']
                        ]
                    ]);
                }
            }
        ];
    }

    /**
     * Ajoute des graphiques à la feuille
     *
     * @param Worksheet $sheet Feuille de calcul
     * @return array Tableau des graphiques
     */
    public function charts(): array
    {
        // Analyser les données pour extraire les indicateurs principaux
        $indicateursData = collect($this->data)
            ->filter(function ($indicateur) {
                // Filtrer pour garder seulement les indicateurs avec plusieurs périodes
                return count($indicateur['historique']) > 1;
            })
            ->take(5); // Limiter à 5 indicateurs pour la lisibilité

        if ($indicateursData->isEmpty()) {
            return [];
        }

        // Nombre de lignes de données
        $rowCount = $this->collection()->count() + 4;
        $chartStartRow = $rowCount + 5;
        $charts = [];

        // Créer un graphique en ligne pour chaque indicateur principal
        foreach ($indicateursData as $index => $indicateur) {
            // Préparer les données pour le graphique
            $chartData = [];
            $labels = [];
            $values = [];

            foreach ($indicateur['historique'] as $historique) {
                $period = $historique['periode'] . ' ' . $historique['annee'];
                $labels[] = $period;
                $values[] = $historique['valeur'];

                // Écrire les données dans la feuille (hors du tableau principal)
                $row = $rowCount + 2 + count($chartData);
                $sheet->setCellValue('J' . $row, $period);
                $sheet->setCellValue('K' . $row, $historique['valeur']);

                $chartData[] = [
                    'period' => $period,
                    'valeur' => $historique['valeur']
                ];
            }

            // Cacher les colonnes de données pour le graphique
            $sheet->getColumnDimension('J')->setVisible(false);
            $sheet->getColumnDimension('K')->setVisible(false);

            // Créer le graphique en ligne
            $dataSeriesLabels = [
                new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Évolution!$K$' . ($rowCount + 1), null, 1, ['Valeur'])
            ];

            $xAxisTickValues = [
                new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Évolution!$J$' . ($rowCount + 2) . ':$J$' . ($rowCount + 1 + count($chartData)), null, count($chartData))
            ];

            $dataSeriesValues = [
                new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'Évolution!$K$' . ($rowCount + 2) . ':$K$' . ($rowCount + 1 + count($chartData)), null, count($chartData))
            ];

            // Créer le graphique
            $series = new DataSeries(
                DataSeries::TYPE_LINECHART,
                DataSeries::GROUPING_STANDARD,
                range(0, count($dataSeriesValues) - 1),
                $dataSeriesLabels,
                $xAxisTickValues,
                $dataSeriesValues
            );

            $plotArea = new PlotArea(null, [$series]);
            $legend = new Legend(Legend::POSITION_RIGHT, null, false);

            $title = new Title($indicateur['libelle'] . ' - Évolution');
            $chart = new Chart('lineChart' . $index, $title, $legend, $plotArea);

            // Positionner le graphique
            $chartHeight = 10;
            $chartStartRow = $chartStartRow + ($index > 0 ? $chartHeight + 2 : 0);

            $chart->setTopLeftPosition('A' . $chartStartRow);
            $chart->setBottomRightPosition('H' . ($chartStartRow + $chartHeight));

            $charts[] = $chart;
        }

        return $charts;
    }
}

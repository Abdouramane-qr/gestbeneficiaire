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
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Chart\Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Feuille Excel pour une catégorie spécifique d'indicateurs
 */
class IndicateursCategorieSheet implements
    FromCollection,
    WithTitle,
    WithHeadings,
    WithStyles,
    WithMapping,
    ShouldAutoSize,
    WithCharts
{
    protected $data;
    protected $categorie;

    /**
     * Constructeur
     *
     * @param Collection $data Données des indicateurs pour cette catégorie
     * @param string $categorie Nom de la catégorie
     */
    public function __construct($data, string $categorie)
    {
        $this->data = $data;
        $this->categorie = $categorie;
    }

    /**
     * Retourne le titre de la feuille
     *
     * @return string Titre de la feuille
     */
    public function title(): string
    {
        // Limiter la longueur du titre à 31 caractères (limitation Excel)
        return Str::limit(Str::slug($this->categorie, '_'), 31);
    }

    /**
     * Retourne les données pour la feuille
     *
     * @return Collection Collection de données
     */
    public function collection()
    {
        return $this->data;
    }

    /**
     * Définit les entêtes de colonnes
     *
     * @return array Entêtes de colonnes
     */
    public function headings(): array
    {
        return [
            'Libellé',
            'Valeur',
            'Unité',
            'Valeur cible',
            'Écart',
            'Objectif atteint'
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
        // Calculer l'écart entre la valeur et la cible
        $ecart = '';
        $objectifAtteint = 'Non';

        if (isset($row['valeur']) && isset($row['valeur_cible']) &&
            is_numeric($row['valeur']) && is_numeric($row['valeur_cible'])) {
            $ecart = $row['valeur'] - $row['valeur_cible'];

            // Déterminer si l'objectif est atteint
            if ($row['valeur'] >= $row['valeur_cible']) {
                $objectifAtteint = 'Oui';
            }
        }

        return [
            $row['libelle'] ?? '',
            $row['valeur'] ?? '',
            $row['unite'] ?? '',
            $row['valeur_cible'] ?? '',
            $ecart,
            $objectifAtteint
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
        // Ajouter un titre à la feuille
        $sheet->mergeCells('A1:F1');
        $sheet->setCellValue('A1', 'INDICATEURS - ' . strtoupper($this->categorie));

        // Définir la hauteur de la ligne de titre
        $sheet->getRowDimension(1)->setRowHeight(30);

        $totalRows = count($this->data) + 1; // +1 pour l'entête

        // Appliquer un style conditionnel pour la colonne "Objectif atteint"
        for ($i = 2; $i <= $totalRows + 1; $i++) {
            $conditionalStyles = [
                'F' . $i => function ($cell) {
                    if ($cell->getValue() === 'Oui') {
                        return [
                            'font' => [
                                'color' => ['rgb' => '008800']
                            ],
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'color' => ['rgb' => 'E6FFE6']
                            ]
                        ];
                    } elseif ($cell->getValue() === 'Non') {
                        return [
                            'font' => [
                                'color' => ['rgb' => 'FF0000']
                            ],
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'color' => ['rgb' => 'FFEBEB']
                            ]
                        ];
                    }
                    return [];
                }
            ];

            foreach ($conditionalStyles as $cellRange => $callback) {
                $cellStyle = $callback($sheet->getCell($cellRange));
                if (!empty($cellStyle)) {
                    $sheet->getStyle($cellRange)->applyFromArray($cellStyle);
                }
            }
        }

        // Ajouter une ligne pour l'analyse à la fin du tableau
        $lastRow = $totalRows + 3;
        $sheet->setCellValue('A' . $lastRow, 'ANALYSE DE LA CATÉGORIE');
        $sheet->mergeCells('A' . $lastRow . ':F' . $lastRow);

        // Calculer le pourcentage d'objectifs atteints
        $objectifsAtteints = 0;
        for ($i = 2; $i <= $totalRows + 1; $i++) {
            if ($sheet->getCell('F' . $i)->getValue() === 'Oui') {
                $objectifsAtteints++;
            }
        }

        $totalIndicateurs = count($this->data);
        $pourcentageAtteint = $totalIndicateurs > 0 ? round(($objectifsAtteints / $totalIndicateurs) * 100, 1) : 0;

        $lastRow += 1;
        $sheet->setCellValue('A' . $lastRow, 'Nombre total d\'indicateurs:');
        $sheet->setCellValue('B' . $lastRow, $totalIndicateurs);

        $lastRow += 1;
        $sheet->setCellValue('A' . $lastRow, 'Objectifs atteints:');
        $sheet->setCellValue('B' . $lastRow, $objectifsAtteints . ' (' . $pourcentageAtteint . '%)');

        // Colorer la cellule du pourcentage selon la valeur
        if ($pourcentageAtteint >= 80) {
            $sheet->getStyle('B' . $lastRow)->applyFromArray([
                'font' => [
                    'color' => ['rgb' => '008800']
                ]
            ]);
        } elseif ($pourcentageAtteint >= 50) {
            $sheet->getStyle('B' . $lastRow)->applyFromArray([
                'font' => [
                    'color' => ['rgb' => 'FFA500']
                ]
            ]);
        } else {
            $sheet->getStyle('B' . $lastRow)->applyFromArray([
                'font' => [
                    'color' => ['rgb' => 'FF0000']
                ]
            ]);
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
            // Style des entêtes
            2 => [
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
            // Style de l'analyse
            'A' . ($totalRows + 3) => [
                'font' => [
                    'bold' => true,
                    'size' => 12
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT
                ]
            ],
            // Style des données
            'A3:F' . ($totalRows + 1) => [
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
            'evenStripes' => function(Worksheet $sheet) use ($totalRows) {
                for ($i = 3; $i <= $totalRows + 1; $i++) {
                    if ($i % 2 == 0) {
                        $sheet->getStyle('A' . $i . ':F' . $i)->applyFromArray([
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'color' => ['rgb' => 'F9F9F9']
                            ]
                        ]);
                    }
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
        $sheet = new Worksheet();
        $dataCount = count($this->data);
        if ($dataCount <= 0) {
            return [];
        }

        // Préparer les données pour le graphique
        $valeurs = [];
        $cibles = [];
        $libelles = [];

        foreach ($this->data as $index => $indicator) {
            if (isset($indicator['valeur']) && is_numeric($indicator['valeur'])) {
                $valeurs[] = $indicator['valeur'];
                $cibles[] = $indicator['valeur_cible'] ?? 0;
                $libelles[] = $indicator['libelle'] ?? 'Indicateur ' . ($index + 1);
            }
        }

        // Si pas de données numériques, ne pas créer de graphique
        if (empty($valeurs)) {
            return [];
        }

        // Créer un graphique à barres
        $dataSeriesLabels = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Graphique!$B$1', null, 1, ['Valeur']),
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Graphique!$D$1', null, 1, ['Valeur cible'])
        ];

        // Écrire les libellés dans une plage de cellules cachée
        for ($i = 0; $i < count($libelles); $i++) {
            $sheet->setCellValue('H' . ($i + 1), $libelles[$i]);
            $sheet->setCellValue('I' . ($i + 1), $valeurs[$i]);
            $sheet->setCellValue('J' . ($i + 1), $cibles[$i]);
        }

        // Cacher les colonnes de données pour le graphique
        $sheet->getColumnDimension('H')->setVisible(false);
        $sheet->getColumnDimension('I')->setVisible(false);
        $sheet->getColumnDimension('J')->setVisible(false);

        $xAxisTickValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_STRING, 'Graphique!$H$1:$H$' . count($libelles), null, count($libelles))
        ];

        $dataSeriesValues = [
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'Graphique!$I$1:$I$' . count($valeurs), null, count($valeurs)),
            new DataSeriesValues(DataSeriesValues::DATASERIES_TYPE_NUMBER, 'Graphique!$J$1:$J$' . count($cibles), null, count($cibles))
        ];

        // Créer le graphique
        $series = new DataSeries(
            DataSeries::TYPE_BARCHART,
            DataSeries::GROUPING_CLUSTERED,
            range(0, count($dataSeriesValues) - 1),
            $dataSeriesLabels,
            $xAxisTickValues,
            $dataSeriesValues
        );

        $plotArea = new PlotArea(null, [$series]);
        $legend = new Legend(Legend::POSITION_RIGHT, null, false);

        $title = new Title('Comparaison Valeurs vs Cibles - ' . $this->categorie);
        $chart = new Chart('barChart', $title, $legend, $plotArea);

        // Positionner le graphique
        $totalRows = count($this->data) + 1;
        $lastDataRow = $totalRows + 6; // Après l'analyse

        $chart->setTopLeftPosition('A' . ($lastDataRow + 2));
        $chart->setBottomRightPosition('F' . ($lastDataRow + 15));

        return [$chart];
    }
}

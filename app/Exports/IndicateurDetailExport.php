<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Collection;
use App\Models\Entreprise;
use App\Services\IndicateursAnalyseService;

/**
 * Export détaillé pour un indicateur spécifique avec son historique
 */
class IndicateurDetailExport implements FromCollection, WithTitle, WithHeadings, WithStyles, WithMapping, ShouldAutoSize
{
    protected $indicateurId;
    protected $entrepriseId;
    protected $data;
    protected $indicateur;

    /**
     * Constructeur
     *
     * @param int $indicateurId ID de l'indicateur
     * @param int $entrepriseId ID de l'entreprise
     */
    public function __construct(int $indicateurId, int $entrepriseId)
    {
        $this->indicateurId = $indicateurId;
        $this->entrepriseId = $entrepriseId;

        // Récupérer les données détaillées de l'indicateur
        $analyseService = app(IndicateursAnalyseService::class);
        $this->data = $analyseService->getIndicateurHistorique($indicateurId, $entrepriseId);

        // Récupérer les informations de base de l'indicateur
        $this->indicateur = $analyseService->getIndicateurById($indicateurId);
    }

    /**
     * Retourne le titre de la feuille
     *
     * @return string Titre de la feuille
     */
    public function title(): string
    {
        $libelle = $this->indicateur ? $this->indicateur['libelle'] : 'Indicateur ' . $this->indicateurId;
        return 'Détails - ' . substr($libelle, 0, 25); // Limiter la longueur du titre
    }

    /**
     * Retourne les données pour la feuille
     *
     * @return Collection Collection de données
     */
    public function collection()
    {
        return collect($this->data);
    }

    /**
     * Définit les entêtes de colonnes
     *
     * @return array Entêtes de colonnes
     */
    public function headings(): array
    {
        return [
            'Période',
            'Année',
            'Valeur',
            'Valeur cible',
            'Écart',
            'Date de calcul',
            'Tendance'
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
        if (isset($row['valeur']) && isset($row['valeur_cible']) &&
            is_numeric($row['valeur']) && is_numeric($row['valeur_cible'])) {
            $ecart = $row['valeur'] - $row['valeur_cible'];
        }

        // Déterminer la tendance par rapport à la période précédente
        $tendance = '';
        if (isset($row['tendance'])) {
            if ($row['tendance'] > 0) {
                $tendance = '↑ En hausse';
            } elseif ($row['tendance'] < 0) {
                $tendance = '↓ En baisse';
            } else {
                $tendance = '→ Stable';
            }
        }

        return [
            $row['periode'] ?? '',
            $row['annee'] ?? '',
            $row['valeur'] ?? '',
            $row['valeur_cible'] ?? '',
            $ecart,
            $row['date_calcul'] ?? '',
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
        // Récupérer les informations de l'entreprise
        $entreprise = Entreprise::find($this->entrepriseId);
        $entrepriseName = $entreprise ? $entreprise->nom_entreprise : "Entreprise #".$this->entrepriseId;

        // Titre de l'indicateur
        $sheet->mergeCells('A1:G1');
        $libelle = $this->indicateur ? $this->indicateur['libelle'] : 'Indicateur ' . $this->indicateurId;
        $sheet->setCellValue('A1', 'DÉTAIL DE L\'INDICATEUR: ' . $libelle);

        // Sous-titre avec l'entreprise
        $sheet->mergeCells('A2:G2');
        $sheet->setCellValue('A2', 'Entreprise: ' . $entrepriseName);

        // Informations sur l'indicateur
        $sheet->mergeCells('A3:C3');
        $sheet->setCellValue('A3', 'Catégorie:');
        $sheet->mergeCells('D3:G3');
        $sheet->setCellValue('D3', $this->indicateur['categorie'] ?? '');

        $sheet->mergeCells('A4:C4');
        $sheet->setCellValue('A4', 'Description:');
        $sheet->mergeCells('D4:G4');
        $sheet->setCellValue('D4', $this->indicateur['description'] ?? '');

        $sheet->mergeCells('A5:C5');
        $sheet->setCellValue('A5', 'Formule de calcul:');
        $sheet->mergeCells('D5:G5');
        $sheet->setCellValue('D5', $this->indicateur['formule'] ?? '');

        $sheet->mergeCells('A6:C6');
        $sheet->setCellValue('A6', 'Unité:');
        $sheet->mergeCells('D6:G6');
        $sheet->setCellValue('D6', $this->indicateur['unite'] ?? '');

        // Définir les styles pour les différentes tendances
        $totalRows = count($this->data) + 1; // +1 pour l'entête
        for ($i = 8; $i <= $totalRows + 7; $i++) { // +7 car les données commencent à la ligne 8
            $cellG = $sheet->getCell('G' . $i)->getValue();

            if (strpos($cellG, 'En hausse') !== false) {
                $sheet->getStyle('G' . $i)->applyFromArray([
                    'font' => [
                        'color' => ['rgb' => '008800']
                    ]
                ]);
            } elseif (strpos($cellG, 'En baisse') !== false) {
                $sheet->getStyle('G' . $i)->applyFromArray([
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
                    'horizontal' => Alignment::HORIZONTAL_LEFT
                ]
            ],
            // Style des informations sur l'indicateur
            'A3:A6' => [
                'font' => [
                    'bold' => true
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'color' => ['rgb' => 'F0F0F0']
                ]
            ],
            // Style des entêtes
            7 => [
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
            'A8:G' . ($totalRows + 7) => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC']
                    ]
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER
                ]
            ]
        ];
    }
}

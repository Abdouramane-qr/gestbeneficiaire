<?php

namespace App\Exports;

use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Exercice;
use App\Models\Beneficiaire;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Collection;

class MetadataSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    protected $entrepriseId;
    protected $annee;
    protected $periodeType;
    protected $filtres;

    public function __construct(int $entrepriseId, int $annee, string $periodeType, array $filtres = [])
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;
        $this->periodeType = $periodeType;
        $this->filtres = $filtres;
    }

    public function title(): string
    {
        return 'Métadonnées';
    }

    public function collection()
    {
        $metadata = [];

        // Informations générales
        $metadata[] = ['Information', 'Valeur'];
        $metadata[] = ['Date d\'exportation', date('Y-m-d H:i:s')];
        $metadata[] = ['Période exportée', $this->periodeType];
        $metadata[] = ['Année', $this->annee];

        // Informations sur l'entreprise/bénéficiaire
        if ($this->periodeType === 'Occasionnelle' && isset($this->filtres['beneficiaire_id'])) {
            $beneficiaire = Beneficiaire::find($this->filtres['beneficiaire_id']);
            if ($beneficiaire) {
                $metadata[] = ['Bénéficiaire', $beneficiaire->nom . ' ' . $beneficiaire->prenom];
                $metadata[] = ['Type de bénéficiaire', $beneficiaire->type_beneficiaire ?? 'N/A'];
            }
        } else {
            $entreprise = Entreprise::find($this->entrepriseId);
            if ($entreprise) {
                $metadata[] = ['Entreprise', $entreprise->nom_entreprise];
                $metadata[] = ['Secteur d\'activité', $entreprise->secteur_activite];
                $metadata[] = ['Ville', $entreprise->ville ?? 'N/A'];
            }
        }

        // Exercice
        if (isset($this->filtres['exercice_id'])) {
            $exercice = Exercice::find($this->filtres['exercice_id']);
            if ($exercice) {
                $metadata[] = ['Exercice filtré', $exercice->annee];
                $metadata[] = ['Période de l\'exercice', $exercice->date_debut . ' à ' . $exercice->date_fin];
            }
        }

        // Filtres appliqués
        $metadata[] = ['', ''];
        $metadata[] = ['Filtres appliqués', ''];
        foreach ($this->filtres as $key => $value) {
            if ($value && $key !== 'exercice_id' && $key !== 'entreprise_id' && $key !== 'beneficiaires_id') {
                $metadata[] = [ucfirst(str_replace('_', ' ', $key)), $value];
            }
        }

        // Statistiques d'exportation
        $metadata[] = ['', ''];
        $metadata[] = ['Statistiques', ''];
        $metadata[] = ['Date et heure d\'exportation', now()->format('d/m/Y H:i:s')];
        $metadata[] = ['Type d\'exportation', isset($this->filtres['categorie']) ? 'Par catégorie' : 'Complet'];
        $metadata[] = ['Format libellés', isset($this->filtres['format_nice']) && $this->filtres['format_nice'] ? 'Optimisé' : 'Brut'];

        // Information sur les versions
        $metadata[] = ['', ''];
        $metadata[] = ['Informations système', ''];
        $metadata[] = ['Version de l\'application', '3.1.0'];
        $metadata[] = ['Générée par', 'Module d\'export d\'indicateurs'];

        return collect($metadata);
    }

    public function headings(): array
    {
        return ['Attribut', 'Valeur'];
    }

    public function map($row): array
    {
        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];

        // Mettre en gras les en-têtes de section
        $highestRow = $sheet->getHighestRow();
        for ($row = 2; $row <= $highestRow; $row++) {
            $cell = $sheet->getCell("A{$row}");
            if ($cell->getValue() && !$sheet->getCell('B' . $row)->getValue()) {
                $sheet->getStyle("A{$row}")->getFont()->setBold(true);
                $sheet->getStyle("A{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('E5E5E5');
            }
        }

        return $styles;
    }
}

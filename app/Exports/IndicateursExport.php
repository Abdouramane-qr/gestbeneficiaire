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
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class IndicateursExport implements WithMultipleSheets
{
    protected $entrepriseId;
    protected $annee;
    protected $periodeType;
    protected $filtres;
    protected $exportAll;
    protected $includeBasicInfo;
    protected $includeMetadata;
    protected $formatNice;

    public function __construct(int $entrepriseId, int $annee, string $periodeType, array $filtres = [], bool $exportAll = false, bool $includeBasicInfo = true, bool $includeMetadata = true, bool $formatNice = true)
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;
        $this->periodeType = $periodeType;
        $this->filtres = $filtres;
        $this->exportAll = $exportAll;
        $this->includeBasicInfo = $includeBasicInfo;
        $this->includeMetadata = $includeMetadata;
        $this->formatNice = $formatNice;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Feuille d'informations générales (uniquement si demandée)
        if ($this->includeBasicInfo) {
            $sheets[] = new InformationsGeneralesSheet($this->entrepriseId, $this->annee, $this->periodeType, $this->filtres);
        }

        // Si on exporte tout
        if ($this->exportAll) {
            $categories = $this->getAllCategories();
            foreach ($categories as $categorie) {
                $sheets[] = new IndicateursCategorieSheet(
                    $this->entrepriseId,
                    $this->annee,
                    $this->periodeType,
                    $categorie,
                    $this->filtres,
                    $this->formatNice
                );
            }
        }
        // Si on exporte une catégorie spécifique
        else if (isset($this->filtres['categorie']) && !empty($this->filtres['categorie'])) {
            $sheets[] = new IndicateursCategorieSheet(
                $this->entrepriseId,
                $this->annee,
                $this->periodeType,
                $this->filtres['categorie'],
                $this->filtres,
                $this->formatNice
            );
        }
        // Sinon, exporter les catégories disponibles pour le type de période
        else {
            $categories = $this->getAvailableCategories();
            foreach ($categories as $categorie) {
                $sheets[] = new IndicateursCategorieSheet(
                    $this->entrepriseId,
                    $this->annee,
                    $this->periodeType,
                    $categorie,
                    $this->filtres,
                    $this->formatNice
                );
            }
        }

        // Feuille des métadonnées (uniquement si demandée)
        if ($this->includeMetadata) {
            $sheets[] = new MetadataSheet($this->entrepriseId, $this->annee, $this->periodeType, $this->filtres);
        }

        return $sheets;
    }

    protected function getAllCategories(): array
    {
        return [
            "Indicateurs commerciaux de l'entreprise du promoteur",
            "Indicateurs d'activités de l'entreprise du promoteur",
            "Indicateurs de Rentabilité et de solvabilité",
            "Indicateurs de trésorerie de l'entreprise du promoteur",
            "Indicateurs Sociaux et RH",
            "Indicateurs de développement personnel",
            "Indicateurs de performance Projet",
            "Indicateurs de formation",
            "Indicateurs de bancarisation",
            "Indicateurs d'appréciation"
        ];
    }

    protected function getAvailableCategories(): array
    {
        $categories = [];

        // Déterminer les catégories selon le type de période
        switch ($this->periodeType) {
            case 'Trimestrielle':
                $categories = [
                    "Indicateurs commerciaux de l'entreprise du promoteur",
                    "Indicateurs de performance Projet",
                    "Indicateurs de trésorerie de l'entreprise du promoteur"
                ];
                break;
            case 'Semestrielle':
                $categories = [
                    "Indicateurs d'activités de l'entreprise du promoteur",
                    "Indicateurs de Rentabilité et de solvabilité",
                    "Indicateurs de trésorerie",
                    "Indicateurs Sociaux et RH",
                    "Indicateurs de développement personnel",
                    "Indicateurs de performance Projet"
                ];
                break;
            case 'Annuelle':
                $categories = [
                    "Ratios de Rentabilité et de solvabilité de l'entreprise",
                    "Indicateurs de trésorerie de l'entreprise du promoteur"
                ];
                break;
            case 'Occasionnelle':
                $categories = [
                    "Indicateurs de formation",
                    "Indicateurs de bancarisation",
                    "Indicateurs d'appréciation"
                ];
                break;
        }

        return $categories;
    }
}

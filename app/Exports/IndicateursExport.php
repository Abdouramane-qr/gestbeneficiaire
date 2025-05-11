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

    public function __construct(int $entrepriseId, int $annee, string $periodeType, array $filtres = [])
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;
        $this->periodeType = $periodeType;
        $this->filtres = $filtres;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Feuille de résumé
        $sheets[] = new IndicateursSummarySheet($this->entrepriseId, $this->annee, $this->periodeType, $this->filtres);

        // Si on exporte une catégorie spécifique, n'inclure que celle-ci
        if (isset($this->filtres['categorie']) && !empty($this->filtres['categorie'])) {
            $sheets[] = new IndicateursCategorieSheet(
                $this->entrepriseId,
                $this->annee,
                $this->periodeType,
                $this->filtres['categorie'],
                $this->filtres
            );
        } else {
            // Sinon, exporter toutes les catégories disponibles
            $categories = $this->getAvailableCategories();
            foreach ($categories as $categorie) {
                $sheets[] = new IndicateursCategorieSheet(
                    $this->entrepriseId,
                    $this->annee,
                    $this->periodeType,
                    $categorie,
                    $this->filtres
                );
            }
        }

        // Feuille des métadonnées
        $sheets[] = new MetadataSheet($this->entrepriseId, $this->annee, $this->periodeType, $this->filtres);

        return $sheets;
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

class IndicateursSummarySheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
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
        return 'Résumé';
    }

    public function collection()
    {
        // Construction de la requête
        $query = Collecte::with(['entreprise', 'exercice']);

        // Filtrer par période
        $query->where('periode', 'like', '%' . $this->periodeType . '%');

        // Filtrer par exercice
        if (isset($this->filtres['exercice_id']) && $this->filtres['exercice_id']) {
            $query->where('exercice_id', $this->filtres['exercice_id']);
        }

        // Filtrer par entreprise ou bénéficiaire selon la période
        if ($this->periodeType === 'Occasionnelle') {
            if (isset($this->filtres['beneficiaire_id']) && $this->filtres['beneficiaire_id']) {
                $query->whereHas('entreprise', function($q) {
                    $q->where('beneficiaires_id', $this->filtres['beneficiaire_id']);
                });
            }
        } else {
            $query->where('entreprise_id', $this->entrepriseId);
        }

        // Appliquer les filtres géographiques et sectoriels
        if (isset($this->filtres['region']) && $this->filtres['region']) {
            $query->whereHas('entreprise', function($q) {
                $q->where('ville', $this->filtres['region']);
            });
        }

        if (isset($this->filtres['secteur']) && $this->filtres['secteur']) {
            $query->whereHas('entreprise', function($q) {
                $q->where('secteur_activite', $this->filtres['secteur']);
            });
        }

        $collectes = $query->get();

        // Traiter les données
        $donneesTraitees = [];
        foreach ($collectes as $collecte) {
            $donnees = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);

            if ($this->periodeType === 'Occasionnelle' && isset($donnees['formulaire_exceptionnel'])) {
                $form = $donnees['formulaire_exceptionnel'];

                // Traiter les données du formulaire exceptionnel
                $donneesTraitees[] = [
                    'periode' => $collecte->periode,
                    'date' => $collecte->date_collecte,
                    'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                    'beneficiaire' => ($form['beneficiaire_nom'] ?? '') . ' ' . ($form['beneficiaire_prenom'] ?? ''),
                    'formation_entrepreneuriat' => $form['formation_entrepreneuriat_recu'] ? 'Oui' : 'Non',
                    'formation_technique' => $form['formation_technique_recu'] ? 'Oui' : 'Non',
                    'bancarise_debut' => $form['est_bancarise_demarrage'] ? 'Oui' : 'Non',
                    'bancarise_fin' => $form['est_bancarise_fin'] ? 'Oui' : 'Non',
                ];
            } else {
                foreach ($donnees as $categorie => $indicateurs) {
                    if (is_array($indicateurs)) {
                        foreach ($indicateurs as $id => $valeur) {
                            if (is_numeric($valeur)) {
                                $donneesTraitees[] = [
                                    'periode' => $collecte->periode,
                                    'date' => $collecte->date_collecte,
                                    'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                                    'categorie' => $categorie,
                                    'indicateur' => $id,
                                    'valeur' => $valeur,
                                ];
                            }
                        }
                    }
                }
            }
        }

        return collect($donneesTraitees);
    }

    public function headings(): array
    {
        if ($this->periodeType === 'Occasionnelle') {
            return [
                'Période',
                'Date de collecte',
                'Entreprise',
                'Bénéficiaire',
                'Formation Entrepreneuriat',
                'Formation Technique',
                'Bancarisé (Début)',
                'Bancarisé (Fin)',
            ];
        } else {
            return [
                'Période',
                'Date de collecte',
                'Entreprise',
                'Catégorie',
                'Indicateur',
                'Valeur',
            ];
        }
    }

    public function map($row): array
    {
        if ($this->periodeType === 'Occasionnelle') {
            return [
                $row['periode'],
                $row['date'],
                $row['entreprise'],
                $row['beneficiaire'],
                $row['formation_entrepreneuriat'],
                $row['formation_technique'],
                $row['bancarise_debut'],
                $row['bancarise_fin'],
            ];
        } else {
            return [
                $row['periode'],
                $row['date'],
                $row['entreprise'],
                $row['categorie'],
                $row['indicateur'],
                $row['valeur'],
            ];
        }
    }

    public function styles(Worksheet $sheet)
    {
        return [
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
    }
}

class IndicateursCategorieSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
{
    protected $entrepriseId;
    protected $annee;
    protected $periodeType;
    protected $categorie;
    protected $filtres;

    public function __construct(int $entrepriseId, int $annee, string $periodeType, string $categorie, array $filtres = [])
    {
        $this->entrepriseId = $entrepriseId;
        $this->annee = $annee;
        $this->periodeType = $periodeType;
        $this->categorie = $categorie;
        $this->filtres = $filtres;
    }

    public function title(): string
    {
        // Limiter la longueur du titre pour Excel
        $title = substr($this->categorie, 0, 31);
        if (strlen($this->categorie) > 31) {
            $title = substr($title, 0, 28) . '...';
        }
        return $title;
    }

    public function collection()
    {
        // Construction de la requête
        $query = Collecte::with(['entreprise', 'exercice']);

        // Filtrer par période
        $query->where('periode', 'like', '%' . $this->periodeType . '%');

        // Filtrer par exercice
        if (isset($this->filtres['exercice_id']) && $this->filtres['exercice_id']) {
            $query->where('exercice_id', $this->filtres['exercice_id']);
        }

        // Filtrer par entreprise ou bénéficiaire selon la période
        if ($this->periodeType === 'Occasionnelle') {
            if (isset($this->filtres['beneficiaire_id']) && $this->filtres['beneficiaire_id']) {
                $query->whereHas('entreprise', function($q) {
                    $q->where('beneficiaires_id', $this->filtres['beneficiaire_id']);
                });
            }
        } else {
            $query->where('entreprise_id', $this->entrepriseId);
        }

        $collectes = $query->get();

        // Traiter les données pour cette catégorie
        $donneesCategorie = [];

        foreach ($collectes as $collecte) {
            $donnees = is_array($collecte->donnees) ? $collecte->donnees : json_decode($collecte->donnees, true);

            if ($this->periodeType === 'Occasionnelle' && isset($donnees['formulaire_exceptionnel'])) {
                // Traiter les données exceptionnelles selon la catégorie demandée
                $donneesCategorie = $this->traiterDonneesExceptionnelles($donnees['formulaire_exceptionnel'], $collecte);
            } else if (isset($donnees[$this->categorie])) {
                $indicateurs = $donnees[$this->categorie];

                foreach ($indicateurs as $id => $valeur) {
                    if (is_numeric($valeur)) {
                        $donneesCategorie[] = [
                            'periode' => $collecte->periode,
                            'date' => $collecte->date_collecte,
                            'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                            'exercice' => $collecte->exercice->annee ?? '',
                            'indicateur' => $id,
                            'libelle' => $this->formatLibelle($id),
                            'valeur' => $valeur,
                            'unite' => $this->determinerUnite($id),
                        ];
                    }
                }
            }
        }

        return collect($donneesCategorie);
    }

    protected function traiterDonneesExceptionnelles($form, $collecte): array
    {
        $donneesCategorie = [];

        switch ($this->categorie) {
            case 'Indicateurs de formation':
                $donneesCategorie[] = [
                    'periode' => $collecte->periode,
                    'date' => $collecte->date_collecte,
                    'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                    'exercice' => $collecte->exercice->annee ?? '',
                    'indicateur' => 'formation_technique',
                    'libelle' => 'Formation technique reçue',
                    'valeur' => $form['formation_technique_recu'] ? 'Oui' : 'Non',
                    'unite' => '',
                ];
                break;

            case 'Indicateurs de bancarisation':
                $donneesCategorie[] = [
                    'periode' => $collecte->periode,
                    'date' => $collecte->date_collecte,
                    'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                    'exercice' => $collecte->exercice->annee ?? '',
                    'indicateur' => 'bancarise_debut',
                    'libelle' => 'Bancarisé au début du projet',
                    'valeur' => $form['est_bancarise_demarrage'] ? 'Oui' : 'Non',
                    'unite' => '',
                ];
                $donneesCategorie[] = [
                    'periode' => $collecte->periode,
                    'date' => $collecte->date_collecte,
                    'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                    'exercice' => $collecte->exercice->annee ?? '',
                    'indicateur' => 'bancarise_fin',
                    'libelle' => 'Bancarisé à la fin du projet',
                    'valeur' => $form['est_bancarise_fin'] ? 'Oui' : 'Non',
                    'unite' => '',
                ];
                break;

            case 'Indicateurs d\'appréciation':
                $appreciationFields = [
                    'appreciation_organisation_interne_demarrage' => 'Organisation interne (début)',
                    'appreciation_services_adherents_demarrage' => 'Services adhérents (début)',
                    'appreciation_relations_externes_demarrage' => 'Relations externes (début)',
                    'appreciation_organisation_interne_fin' => 'Organisation interne (fin)',
                    'appreciation_services_adherents_fin' => 'Services adhérents (fin)',
                    'appreciation_relations_externes_fin' => 'Relations externes (fin)',
                ];

                foreach ($appreciationFields as $field => $libelle) {
                    if (isset($form[$field]) && is_numeric($form[$field])) {
                        $donneesCategorie[] = [
                            'periode' => $collecte->periode,
                            'date' => $collecte->date_collecte,
                            'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                            'exercice' => $collecte->exercice->annee ?? '',
                            'indicateur' => $field,
                            'libelle' => $libelle,
                            'valeur' => $form[$field],
                            'unite' => '/3',
                        ];
                    }
                }
                break;
        }

        return $donneesCategorie;
    }

    public function headings(): array
    {
        return [
            'Période',
            'Date de collecte',
            'Entreprise',
            'Exercice',
            'Indicateur',
            'Libellé',
            'Valeur',
            'Unité',
        ];
    }

    public function map($row): array
    {
        return [
            $row['periode'],
            $row['date'],
            $row['entreprise'],
            $row['exercice'],
            $row['indicateur'],
            $row['libelle'],
            $row['valeur'],
            $row['unite'],
        ];
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

        // Styles pour les colonnes numériques
        $sheet->getStyle('G:G')->getNumberFormat()->setFormatCode('#,##0.00');

        // Alternance des couleurs pour les lignes
        $highestRow = $sheet->getHighestRow();
        for ($row = 2; $row <= $highestRow; $row++) {
            if ($row % 2 == 0) {
                $sheet->getStyle("A{$row}:H{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('F2F2F2');
            }
        }

        return $styles;
    }

    protected function formatLibelle($id): string
    {
        // Définition des libellés personnalisés
        $libelles = [
            // Indicateurs commerciaux
            'propects_grossites' => 'Clients prospectés (grossistes)',
            'prospects_detaillant' => 'Clients prospectés (détaillants)',
            'clients_grossistes' => 'Nouveaux clients (grossistes)',
            'clients_detaillant' => 'Nouveaux clients (détaillants)',
            'nbr_contrat_conclu' => 'Commandes/contrats obtenus',
            'nbr_contrat_encours' => 'Commandes/contrats en cours',
            'nbr_contrat_perdu' => 'Commandes/contrats perdus',

            // Indicateurs d'activités
            'nbr_cycle_production' => 'Cycles de production réalisés',
            'nbr_clients' => 'Clients fidélisés',
            'chiffre_affaire' => 'Chiffre d\'affaires',

            // Indicateurs de rentabilité
            'cout_matiere_premiere' => 'Coût des matières premières',
            'cout_main_oeuvre' => 'Coût de la main d\'œuvre directe',
            'cout_frais_generaux' => 'Coût des frais généraux',
            'produit_exploitation' => 'Produits d\'exploitation',
            'cout_production' => 'Coût de production',

            // Indicateurs de performance
            'credit_rembourse' => 'Montant cumulé des remboursements',
            'total_autres_revenus' => 'Revenus hors entreprise principale',

            // Indicateurs de trésorerie
            'montant_creance_clients_12m' => 'Créances clients irrécouvrables',
            'nbr_creance_clients_12m' => 'Nombre de créances irrécouvrables',
            'stocks' => 'Stocks',
            'creances_clients' => 'Créances clients',
            'dettes_fournisseurs' => 'Dettes fournisseurs',

            // Indicateurs RH
            'nbr_employes_remunerer_h' => 'Employés rémunérés (hommes)',
            'nbr_employes_remunerer_f' => 'Employés rémunérés (femmes)',
            'nbr_employes_non_remunerer_h' => 'Employés non rémunérés (hommes)',
            'nbr_employes_non_remunerer_f' => 'Employés non rémunérés (femmes)',

            // Indicateurs de développement
            'nbr_initiatives_realises' => 'Initiatives personnelles réalisées',
            'nbr_objectifs_realises' => 'Objectifs personnels réalisés',
        ];

        return $libelles[$id] ?? ucfirst(str_replace('_', ' ', $id));
    }

    protected function determinerUnite($id): string
    {
        // Détermination des unités
        $unites = [
            'montant' => 'FCFA',
            'cout' => 'FCFA',
            'chiffre' => 'FCFA',
            'revenu' => 'FCFA',
            'credit' => 'FCFA',
            'creance' => 'FCFA',
            'taux' => '%',
            'ratio' => '%',
            'proportion' => '%',
        ];

        foreach ($unites as $pattern => $unite) {
            if (strpos(strtolower($id), $pattern) !== false) {
                return $unite;
            }
        }

        return '';
    }
}

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
            if ($value) {
                $metadata[] = [ucfirst(str_replace('_', ' ', $key)), $value];
            }
        }

        // Statistiques d'exportation
        $metadata[] = ['', ''];
        $metadata[] = ['Statistiques', ''];
        $metadata[] = ['Nombre de catégories exportées', count($this->getExportedCategories())];
        $metadata[] = ['Nombre total d\'indicateurs', $this->getTotalIndicators()];

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

    protected function getExportedCategories(): array
    {
        if (isset($this->filtres['categorie']) && !empty($this->filtres['categorie'])) {
            return [$this->filtres['categorie']];
        }

        // Retourner toutes les catégories pour ce type de période
        switch ($this->periodeType) {
            case 'Trimestrielle':
                return [
                    "Indicateurs commerciaux de l'entreprise du promoteur",
                    "Indicateurs de performance Projet",
                    "Indicateurs de trésorerie de l'entreprise du promoteur"
                ];
            case 'Semestrielle':
                return [
                    "Indicateurs d'activités de l'entreprise du promoteur",
                    "Indicateurs de Rentabilité et de solvabilité",
                    "Indicateurs de trésorerie",
                    "Indicateurs Sociaux et RH",
                    "Indicateurs de développement personnel",
                    "Indicateurs de performance Projet"
                ];
            case 'Annuelle':
                return [
                    "Ratios de Rentabilité et de solvabilité de l'entreprise",
                    "Indicateurs de trésorerie de l'entreprise du promoteur"
                ];
            case 'Occasionnelle':
                return [
                    "Indicateurs de formation",
                    "Indicateurs de bancarisation",
                    "Indicateurs d'appréciation"
                ];
            default:
                return [];
        }
    }

    protected function getTotalIndicators(): int
    {
        // Logique pour compter le nombre total d'indicateurs exportés
        return 0; // Placeholder
    }
}

// Export de données brutes pour debug
class RawDataExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
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
        return 'Données Brutes';
    }

    public function collection()
    {
        $query = Collecte::with(['entreprise', 'exercice']);

        // Appliquer les mêmes filtres que les autres feuilles
        $query->where('periode', 'like', '%' . $this->periodeType . '%');

        if (isset($this->filtres['exercice_id']) && $this->filtres['exercice_id']) {
            $query->where('exercice_id', $this->filtres['exercice_id']);
        }

        if ($this->periodeType === 'Occasionnelle') {
            if (isset($this->filtres['beneficiaire_id']) && $this->filtres['beneficiaire_id']) {
                $query->whereHas('entreprise', function($q) {
                    $q->where('beneficiaires_id', $this->filtres['beneficiaire_id']);
                });
            }
        } else {
            $query->where('entreprise_id', $this->entrepriseId);
        }

        $collectes = $query->get();

        $donneesRaw = [];
        foreach ($collectes as $collecte) {
            $donneesRaw[] = [
                'id' => $collecte->id,
                'entreprise' => $collecte->entreprise->nom_entreprise ?? '',
                'periode' => $collecte->periode,
                'date' => $collecte->date_collecte,
                'exercice' => $collecte->exercice->annee ?? '',
                'donnees_json' => is_string($collecte->donnees) ? $collecte->donnees : json_encode($collecte->donnees),
            ];
        }

        return collect($donneesRaw);
    }

    public function headings(): array
    {
        return [
            'ID Collecte',
            'Entreprise',
            'Période',
            'Date de collecte',
            'Exercice',
            'Données JSON',
        ];
    }

    public function map($row): array
    {
        return [
            $row['id'],
            $row['entreprise'],
            $row['periode'],
            $row['date'],
            $row['exercice'],
            $row['donnees_json'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
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
    }
}

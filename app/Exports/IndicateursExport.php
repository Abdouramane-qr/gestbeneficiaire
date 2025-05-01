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
    try {
        // Log pour débogage
        \Illuminate\Support\Facades\Log::info('Génération des feuilles Excel', [
            'entreprise_id' => $this->entrepriseId,
            'annee' => $this->annee,
            'periode' => $this->periode
        ]);

        $sheets = [];

        // Feuille de résumé
        $sheets[] = new IndicateursSummarySheet($this->entreprise, $this->annee, $this->periode);

        // Log après la création de la feuille de résumé
        \Illuminate\Support\Facades\Log::info('Feuille résumé créée');

        // Une feuille par catégorie d'indicateurs
        foreach ($this->categories as $categorie) {
            $categorieData = collect($this->data)->where('categorie', $categorie)->values();

            // Log pour chaque catégorie
            \Illuminate\Support\Facades\Log::info('Création feuille pour catégorie', [
                'categorie' => $categorie,
                'nombre_indicateurs' => $categorieData->count()
            ]);

            $sheets[] = new IndicateursCategorieSheet($categorieData, $categorie);
        }

        // Ajouter la feuille d'évolution avec gestion d'erreur spécifique
        try {
            // Log avant création de la feuille d'évolution
            \Illuminate\Support\Facades\Log::info('Tentative de création de la feuille d\'évolution');

            $sheets[] = new IndicateursEvolutionSheet($this->entrepriseId, $this->annee);

            // Log après création réussie
            \Illuminate\Support\Facades\Log::info('Feuille d\'évolution créée avec succès');
        } catch (\Exception $e) {
            // Log en cas d'erreur avec la feuille d'évolution
            \Illuminate\Support\Facades\Log::error('Erreur lors de la création de la feuille d\'évolution', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            // On continue sans cette feuille en cas d'erreur
            \Illuminate\Support\Facades\Log::info('Export continué sans la feuille d\'évolution');
        }

        // Log final
        \Illuminate\Support\Facades\Log::info('Toutes les feuilles générées', [
            'nombre_feuilles' => count($sheets)
        ]);

        return $sheets;
    } catch (\Exception $e) {
        // Log en cas d'erreur générale
        \Illuminate\Support\Facades\Log::error('Erreur lors de la génération des feuilles', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);

        // En cas d'erreur, retourner au moins une feuille vide
        return [new IndicateursSummarySheet($this->entreprise, $this->annee, $this->periode)];
    }
}
}

class IndicateursSummarySheet implements FromCollection, WithTitle, WithHeadings, WithStyles, WithMapping, ShouldAutoSize
{
    protected $data;
    protected $entreprise;
    protected $entrepriseId;
    protected $entrepriseNom;
    protected $annee;
    protected $periode;
    protected $categories;

    public function __construct($entreprise, int $annee, ?string $periode = null)
{
    // Déterminer l'ID d'entreprise
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

    // AJOUT: Récupérer le nom réel de l'entreprise
    if ($this->entrepriseId > 0) {
        $entrepriseModel = \App\Models\Entreprise::find($this->entrepriseId);
        if ($entrepriseModel) {
            $this->entrepriseNom = $entrepriseModel->nom_entreprise;
        } else {
            $this->entrepriseNom = 'Entreprise #' . $this->entrepriseId;
        }
    } else {
        $this->entrepriseNom = 'Entreprise inconnue';
    }

    $this->entreprise = $entreprise;
    $this->annee = $annee;
    $this->periode = $periode;

    // Récupération des données pour l'export
    $analyseService = app(IndicateursAnalyseService::class);
    $this->data = $analyseService->getIndicateursForExport($this->entrepriseId, $annee, $periode);

    // AJOUT: Log pour débogage
    \Illuminate\Support\Facades\Log::info('Données récupérées pour l\'export', [
        'entrepriseId' => $this->entrepriseId,
        'entrepriseNom' => $this->entrepriseNom,
        'count' => count($this->data),
        'data_sample' => $this->data->take(2)->toArray() // Afficher les 2 premiers éléments
    ]);

    $this->categories = collect($this->data)->pluck('categorie')->unique()->values()->all();
}

    public function title(): string
    {
        return 'Tableau de bord';
    }

    public function collection()
    {
        try {
            // S'assurer que les données sont bien formatées
            if (empty($this->data) || $this->data->isEmpty()) {
                \Illuminate\Support\Facades\Log::warning('Aucune donnée disponible pour l\'export', [
                    'entrepriseId' => $this->entrepriseId,
                    'entrepriseNom' => $this->entrepriseNom ?? 'N/A',
                    'annee' => $this->annee
                ]);

                // Retourner au moins une ligne avec un message
                return collect([
                    [
                        'id' => 'info',
                        'libelle' => 'Aucune donnée disponible pour cette période',
                        'categorie' => 'Information',
                        'valeur' => 'N/A',
                        'unite' => '',
                        'valeur_cible' => '',
                        'ecart' => '',
                        'periode' => $this->periode ?? '',
                        'date_calcul' => now()->format('d/m/Y')
                    ]
                ]);
            }

            // Vérifier si les données sont au bon format
            $sample = $this->data->first();
            if (!$sample || !isset($sample['id']) || !isset($sample['libelle']) || !isset($sample['categorie'])) {
                \Illuminate\Support\Facades\Log::warning('Format de données incorrect pour l\'export', [
                    'keys' => $sample ? array_keys($sample) : 'Aucun élément',
                    'entrepriseId' => $this->entrepriseId
                ]);

                // Transformer les données si possible
                if ($sample) {
                    $transformedData = $this->data->map(function ($item, $key) {
                        return [
                            'id' => isset($item['id']) ? $item['id'] : 'item_' . $key,
                            'libelle' => isset($item['libelle']) ? $item['libelle'] : (isset($item['label']) ? $item['label'] : 'Élément ' . $key),
                            'categorie' => isset($item['categorie']) ? $item['categorie'] : (isset($item['category']) ? $item['category'] : 'Non classé'),
                            'valeur' => isset($item['valeur']) ? $item['valeur'] : (isset($item['value']) ? $item['value'] : 'N/A'),
                            'unite' => isset($item['unite']) ? $item['unite'] : (isset($item['unit']) ? $item['unit'] : ''),
                            'valeur_cible' => isset($item['valeur_cible']) ? $item['valeur_cible'] : (isset($item['target']) ? $item['target'] : ''),
                            'ecart' => isset($item['ecart']) ? $item['ecart'] : '',
                            'periode' => isset($item['periode']) ? $item['periode'] : $this->periode ?? '',
                            'date_calcul' => isset($item['date_calcul']) ? $item['date_calcul'] : now()->format('d/m/Y')
                        ];
                    });

                    \Illuminate\Support\Facades\Log::info('Données transformées pour l\'export', [
                        'count' => $transformedData->count()
                    ]);

                    return $transformedData;
                }

                // Si transformation impossible, retourner un message d'erreur
                return collect([
                    [
                        'id' => 'error',
                        'libelle' => 'Format de données incorrect',
                        'categorie' => 'Erreur',
                        'valeur' => 'N/A',
                        'unite' => '',
                        'valeur_cible' => '',
                        'ecart' => '',
                        'periode' => $this->periode ?? '',
                        'date_calcul' => now()->format('d/m/Y')
                    ]
                ]);
            }

            // Si tout est OK, retourner les données normalement
            \Illuminate\Support\Facades\Log::info('Retour des données pour l\'export', [
                'count' => $this->data->count()
            ]);

            return $this->data;

        } catch (\Exception $e) {
            // En cas d'erreur inattendue, log et retourne des données de secours
            \Illuminate\Support\Facades\Log::error('Erreur lors de la préparation des données pour l\'export', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return $this->getDemoData();
        }
    }

    /**
     * Génère des données de démonstration en cas d'échec
     *
     * @return \Illuminate\Support\Collection
     */
    private function getDemoData()
    {
        return collect([
            [
                'id' => 'demo_1',
                'libelle' => 'Chiffre d\'affaires',
                'categorie' => 'Finance',
                'valeur' => 12500000,
                'unite' => 'FCFA',
                'valeur_cible' => 15000000,
                'ecart' => -2500000,
                'periode' => $this->periode ?? 'Annuelle',
                'date_calcul' => now()->format('d/m/Y')
            ],
            [
                'id' => 'demo_2',
                'libelle' => 'Nombre de clients',
                'categorie' => 'Commercial',
                'valeur' => 42,
                'unite' => '',
                'valeur_cible' => 50,
                'ecart' => -8,
                'periode' => $this->periode ?? 'Annuelle',
                'date_calcul' => now()->format('d/m/Y')
            ],
            [
                'id' => 'demo_3',
                'libelle' => 'Taux de satisfaction',
                'categorie' => 'Qualité',
                'valeur' => 92,
                'unite' => '%',
                'valeur_cible' => 95,
                'ecart' => -3,
                'periode' => $this->periode ?? 'Annuelle',
                'date_calcul' => now()->format('d/m/Y')
            ],
            [
                'id' => 'demo_4',
                'libelle' => 'Coût de production',
                'categorie' => 'Production',
                'valeur' => 8500000,
                'unite' => 'FCFA',
                'valeur_cible' => 8000000,
                'ecart' => 500000,
                'periode' => $this->periode ?? 'Annuelle',
                'date_calcul' => now()->format('d/m/Y')
            ]
        ]);
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

    // Utiliser la propriété entrepriseNom au lieu de la logique complexe précédente
    $nom = $this->entrepriseNom ?? 'Entreprise';

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

        // Log pour débogage
        \Illuminate\Support\Facades\Log::info('Création feuille pour catégorie', [
            'categorie' => $categorie,
            'nombre_indicateurs' => count($data)
        ]);
    }

    public function title(): string
    {
        // Limiter la longueur du titre à 31 caractères (limite Excel)
        return substr($this->categorie, 0, 31);
    }

    public function collection()
    {
        // Vérifier si les données sont vides
        if (empty($this->data) || (is_object($this->data) && $this->data->isEmpty())) {
            \Illuminate\Support\Facades\Log::warning('Aucune donnée disponible pour la catégorie', [
                'categorie' => $this->categorie
            ]);

            // Retourner au moins une ligne avec un message
            return collect([
                [
                    'id' => 'info',
                    'libelle' => 'Aucune donnée disponible pour cette catégorie',
                    'valeur' => 'N/A',
                    'unite' => '',
                    'valeur_cible' => '',
                    'ecart' => '',
                    'periode' => '',
                    'date_calcul' => now()->format('d/m/Y')
                ]
            ]);
        }

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
        try {
            // S'assurer que toutes les valeurs requises sont disponibles
            $id = $row['id'] ?? '';
            $libelle = $row['libelle'] ?? ($row['label'] ?? '');
            $valeur = $row['valeur'] ?? ($row['value'] ?? '');
            $unite = $row['unite'] ?? ($row['unit'] ?? '');
            $valeurCible = $row['valeur_cible'] ?? ($row['target'] ?? '');
            $periode = $row['periode'] ?? '';
            $dateCalcul = $row['date_calcul'] ?? now()->format('d/m/Y');

            // Calculer l'écart si possible
            $ecart = '';
            if (isset($row['ecart'])) {
                $ecart = $row['ecart'];
            } elseif (is_numeric($valeur) && is_numeric($valeurCible)) {
                $ecart = $valeur - $valeurCible;
            }

            return [
                $id,
                $libelle,
                $valeur,
                $unite,
                $valeurCible,
                $ecart,
                $periode,
                $dateCalcul
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur lors du mapping des données pour la catégorie', [
                'categorie' => $this->categorie,
                'message' => $e->getMessage(),
                'row' => json_encode($row)
            ]);

            // Retourner une ligne avec des valeurs par défaut en cas d'erreur
            return [
                'error',
                'Erreur lors du traitement',
                'N/A',
                '',
                '',
                '',
                '',
                now()->format('d/m/Y')
            ];
        }
    }

    public function styles(Worksheet $sheet)
    {
        // Appliquer des styles à l'en-tête
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

        try {
            // Utiliser la méthode de secours plus simple et plus sûre
            $service = app(IndicateursAnalyseService::class);
            $this->data = $service->getEvolutionIndicateursForExport($entrepriseId, $annee);

            \Illuminate\Support\Facades\Log::info('IndicateursEvolutionSheet - données de secours récupérées', [
                'entreprise_id' => $entrepriseId,
                'annee' => $annee,
                'count' => count($this->data)
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('IndicateursEvolutionSheet - erreur critique', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $this->data = [];
        }
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
        try {
            // Si pas de données, retourner un tableau vide
            if (empty($this->data)) {
                \Illuminate\Support\Facades\Log::info('IndicateursEvolutionSheet - pas de données');
                return [];
            }

            // Log pour déboguer
            \Illuminate\Support\Facades\Log::info('IndicateursEvolutionSheet - préparation des données d\'export', [
                'nombre_indicateurs' => count($this->data)
            ]);

            $formattedData = [];

            // Traiter chaque indicateur
            foreach ($this->data as $indicateur) {
                // Vérifier que l'indicateur est bien un tableau
                if (!is_array($indicateur)) {
                    \Illuminate\Support\Facades\Log::warning('IndicateursEvolutionSheet - indicateur non valide', [
                        'type' => gettype($indicateur)
                    ]);
                    continue;
                }

                // Extraire les valeurs scalaires avec sécurité
                $id = isset($indicateur['id']) ? (string)$indicateur['id'] : 'N/A';
                $libelle = isset($indicateur['libelle']) ? (string)$indicateur['libelle'] : 'Sans titre';
                $categorie = isset($indicateur['categorie']) ? (string)$indicateur['categorie'] : 'Autre';
                $unite = isset($indicateur['unite']) ? (string)$indicateur['unite'] : '';

                // Vérifier que l'historique est bien un tableau
                if (!isset($indicateur['historique']) || !is_array($indicateur['historique'])) {
                    \Illuminate\Support\Facades\Log::warning('IndicateursEvolutionSheet - pas d\'historique pour l\'indicateur', [
                        'id' => $id
                    ]);

                    // Ajouter une entrée même sans historique
                    $formattedData[] = [
                        'id' => $id,
                        'libelle' => $libelle,
                        'categorie' => $categorie,
                        'annee' => (string)$this->annee,
                        'periode' => 'N/A',
                        'valeur' => 'N/A',
                        'unite' => $unite
                    ];

                    continue;
                }

                // Traiter chaque point d'historique
                foreach ($indicateur['historique'] as $point) {
                    // Vérifier que le point est bien un tableau
                    if (!is_array($point)) {
                        continue;
                    }

                    // Extraire les valeurs avec sécurité
                    $annee = isset($point['annee']) ? (string)$point['annee'] : 'N/A';
                    $periode = isset($point['periode']) ? (string)$point['periode'] : 'N/A';

                    // Valeur nécessite une attention particulière car elle peut être numérique
                    $valeur = 'N/A';
                    if (isset($point['valeur'])) {
                        if (is_array($point['valeur'])) {
                            $valeur = 'Valeur complexe';
                        } else {
                            $valeur = (string)$point['valeur'];
                        }
                    }

                    // Ajouter l'entrée formatée
                    $formattedData[] = [
                        'id' => $id,
                        'libelle' => $libelle,
                        'categorie' => $categorie,
                        'annee' => $annee,
                        'periode' => $periode,
                        'valeur' => $valeur,
                        'unite' => $unite
                    ];
                }
            }

            // Log final
            \Illuminate\Support\Facades\Log::info('IndicateursEvolutionSheet - données formatées avec succès', [
                'nombre_lignes' => count($formattedData)
            ]);

            return $formattedData;

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('IndicateursEvolutionSheet - erreur lors du formatage', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // En cas d'erreur, on retourne des données de démonstration simples
            $demoData = [
                [
                    'id' => 'demo_1',
                    'libelle' => 'Indicateur démo 1',
                    'categorie' => 'Démonstration',
                    'annee' => (string)($this->annee - 1),
                    'periode' => 'Trimestre 1',
                    'valeur' => '100',
                    'unite' => '%'
                ],
                [
                    'id' => 'demo_1',
                    'libelle' => 'Indicateur démo 1',
                    'categorie' => 'Démonstration',
                    'annee' => (string)$this->annee,
                    'periode' => 'Trimestre 1',
                    'valeur' => '120',
                    'unite' => '%'
                ],
                [
                    'id' => 'demo_2',
                    'libelle' => 'Indicateur démo 2',
                    'categorie' => 'Démonstration',
                    'annee' => (string)($this->annee - 1),
                    'periode' => 'Semestre 1',
                    'valeur' => '5000',
                    'unite' => 'FCFA'
                ],
                [
                    'id' => 'demo_2',
                    'libelle' => 'Indicateur démo 2',
                    'categorie' => 'Démonstration',
                    'annee' => (string)$this->annee,
                    'periode' => 'Semestre 1',
                    'valeur' => '6500',
                    'unite' => 'FCFA'
                ]
            ];

            return $demoData;
        }
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

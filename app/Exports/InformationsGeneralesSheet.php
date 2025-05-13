<?php

namespace App\Exports;

use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Exercice;
use App\Models\Beneficiaire;
use App\Models\Coach;
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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class InformationsGeneralesSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithTitle
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

    // Débogage immédiat lors de la construction
    $this->debugCollection();
}

    public function title(): string
    {
        return 'Informations Générales';
    }

    public function collection()
    {
        try {
            // Construction de la requête
            $query = Collecte::with([
                'entreprise',
                'entreprise.beneficiaire',
                'entreprise.beneficiaire.ong',
                'entreprise.beneficiaire.coaches',
                'entreprise.beneficiaire.institutionFinanciere',
                'exercice',
                'user'
            ]);

            // Filtrer par période
            $query->where('periode', 'like', '%' . $this->periodeType . '%');

            // Filtrer par exercice
            if (isset($this->filtres['exercice_id']) && $this->filtres['exercice_id']) {
                $query->where('exercice_id', $this->filtres['exercice_id']);
            }

            // Filtrer par entreprise ou bénéficiaire selon la période
            if ($this->periodeType === 'Occasionnelle') {
                if (isset($this->filtres['beneficiaire_id']) && $this->filtres['beneficiaire_id']) {
                    $query->whereHas('entreprise', function ($q) {
                        $q->where('beneficiaires_id', $this->filtres['beneficiaire_id']);
                    });
                }
            } else {
                $query->where('entreprise_id', $this->entrepriseId);
            }

            // Appliquer les filtres géographiques et sectoriels
            if (isset($this->filtres['region']) && $this->filtres['region']) {
                $query->whereHas('entreprise', function ($q) {
                    $q->where('ville', $this->filtres['region']);
                });
            }

            if (isset($this->filtres['commune']) && $this->filtres['commune']) {
                $query->whereHas('entreprise', function ($q) {
                    $q->where('commune', $this->filtres['commune']);
                });
            }

            if (isset($this->filtres['secteur']) && $this->filtres['secteur']) {
                $query->whereHas('entreprise', function ($q) {
                    $q->where('secteur_activite', $this->filtres['secteur']);
                });
            }

            $collectes = $query->get();

            if ($collectes->isEmpty()) {
                // Si aucune collecte n'est trouvée avec les filtres, essayer de récupérer l'entreprise
                $entreprise = Entreprise::with([
                    'beneficiaire',
                    'beneficiaire.ong',
                    'beneficiaire.coaches',
                    'beneficiaire.institutionFinanciere'
                ])->find($this->entrepriseId);

                if ($entreprise) {
                    // Initialize coaches variable with default value
                    $coaches = 'N/A';

                    return collect([
                        [
                            'id_entreprise' => $entreprise->id,
                            'nom_entreprise' => $entreprise->nom_entreprise,
                            'exercice' => $this->annee,
                            'frequence' => $this->periodeType,
                            'periode' => 'N/A',
                            'statut' => 'Non collecté',
                            'date_collecte' => 'N/A',
                            'type_collecte' => 'N/A',
                            'collecte_par' => 'N/A',
                            'date_creation' => 'N/A',
                            'date_modification' => 'N/A',
                            'ong' => $entreprise->beneficiaire && $entreprise->beneficiaire->ong ? $entreprise->beneficiaire->ong->nom : 'N/A',
                            'coaches' => $coaches,
                            'province' => $entreprise->beneficiaire ? $entreprise->beneficiaire->provinces : 'N/A',
                            'region' => $entreprise->ville ?? 'N/A',
                            'secteur_activite' => $entreprise->secteur_activite ?? 'N/A',
                            'institutionFinanciere' => $entreprise->beneficiaire && $entreprise->beneficiaire->institutionFinanciere ? $entreprise->beneficiaire->institutionFinanciere->nom : 'N/A',
                        ]
                    ]);
                }

                return collect([]);
            }

            // Préparer les données
            $infoGenerales = [];

            foreach ($collectes as $collecte) {
                // Gérer la récupération sécurisée des coaches
                $coaches = 'N/A';
                if ($collecte->entreprise && $collecte->entreprise->beneficiaire) {
                    $coaches = $this->getCoachesInfo($collecte->entreprise->beneficiaire);
                }

                $infoGenerales[] =$this->prepareExportData([
                    'id_entreprise' => $collecte->entreprise_id,
                    'nom_entreprise' => $collecte->entreprise ? $collecte->entreprise->nom_entreprise : 'N/A',
                    'exercice' => $collecte->exercice ? $collecte->exercice->annee : $this->annee,
                    'frequence' => $this->periodeType,
                    'periode' => $collecte->periode,
                    'statut' => $collecte->status ?? 'N/A',
                    'date_collecte' => $collecte->date_collecte,
                    'type_collecte' => $collecte->type_collecte ?? 'N/A',
                    'collecte_par' => $collecte->user ? $collecte->user->name : 'N/A',
                    'date_creation' => $collecte->created_at,
                    'date_modification' => $collecte->updated_at,
                    'ong' => $collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->ong ?
                        $collecte->entreprise->beneficiaire->ong->nom : 'N/A',
                    'coaches' => $coaches,
                    'province' => $collecte->entreprise && $collecte->entreprise->beneficiaire ?
                        $collecte->entreprise->beneficiaire->provinces : 'N/A',
                    'region' => $collecte->entreprise ? $collecte->entreprise->ville : 'N/A',
                    'secteur_activite' => $collecte->entreprise ? $collecte->entreprise->secteur_activite : 'N/A',
                    'institutionFinanciere' => $collecte->entreprise && $collecte->entreprise->beneficiaire && $collecte->entreprise->beneficiaire->institutionFinanciere ?
                        $collecte->entreprise->beneficiaire->institutionFinanciere->nom : 'N/A',
                ]);
            }

            return collect($infoGenerales);
        } catch (\Exception $e) {
            // Log l'erreur pour faciliter le débogage
            Log::error('Erreur dans InformationsGeneralesSheet::collection', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // Retourner une collection vide en cas d'erreur pour éviter une panne complète
            return collect([
                [
                    'id_entreprise' => 'Erreur',
                    'nom_entreprise' => 'Une erreur est survenue lors de la génération du rapport',
                    'exercice' => $this->annee,
                    'frequence' => $this->periodeType,
                    'periode' => 'N/A',
                    'statut' => 'Erreur',
                    'date_collecte' => 'N/A',
                    'type_collecte' => 'N/A',
                    'collecte_par' => 'N/A',
                    'date_creation' => 'N/A',
                    'date_modification' => 'N/A',
                    'ong' => 'N/A',
                   'coaches' => 'N/A',
                    'province' => 'N/A',
                    'region' => 'N/A',
                    'secteur_activite' => 'N/A',
                    'institutionFinanciere' => 'N/A',
                ]
            ]);
        }
    }



    public function headings(): array
    {
        return [
            'ID Entreprise',
            'Nom Entreprise',
            'Exercice',
            'Fréquence',
            'Période',
            'Statut',
            'Date de collecte',
            'Type',
            'Collecté par',
            'Date de création',
            'Dernière modification',
            'ONG',
            'Coaches',
            'Province',
            'Region',
            'Secteur activité',
            'Institution Financière'
        ];
    }

    public function map($row): array
    {
        // S'assurer que toutes les valeurs sont correctement formatées pour l'export
        return [
            $row['id_entreprise'],
            $row['nom_entreprise'],
            $row['exercice'],
            $row['frequence'],
            $row['periode'],
            $row['statut'],
            $row['date_collecte'],
            $row['type_collecte'],
            $row['collecte_par'],
            $row['date_creation'],
            $row['date_modification'],
            $row['ong'],
            // S'assurer que coaches est toujours une chaîne de caractères
        isset($row['coaches']) ? (is_array($row['coaches']) ? implode(', ', $row['coaches']) : (string)$row['coaches']) : 'N/A',
            $row['province'],
            $row['region'],
            $row['secteur_activite'],
            $row['institutionFinanciere'],
        ];
    }

    /**
     * Get formatted coaches information for a beneficiary
     */
    private function getCoachesInfo($beneficiaire): string
    {
        if (!$beneficiaire || !$beneficiaire->coaches) {
            return 'N/A';
        }

        return $beneficiaire->coaches->pluck('nom')->implode(', ');
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

        // Alternance des couleurs pour les lignes
        $highestRow = $sheet->getHighestRow();
        for ($row = 2; $row <= $highestRow; $row++) {
            if ($row % 2 == 0) {
                $sheet->getStyle("A{$row}:Q{$row}")->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('F2F2F2');
            }
        }

        return $styles;
    }

     /**
     * Tester spécifiquement la classe InformationsGeneralesSheet
     */
    public static function testExport($entrepriseId, $annee, $periodeType)
    {
        try {
            // Simuler l'exportation sans générer de fichier
            $sheet = new \App\Exports\InformationsGeneralesSheet($entrepriseId, $annee, $periodeType);
            $data = $sheet->collection();

            return [
                'success' => true,
                'count' => $data->count(),
                'sample' => $data->take(1)->toArray()
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => explode("\n", $e->getTraceAsString())
            ];
        }
    }

    /**
     * Tester la méthode getCoachesInfo directement
     */
    public static function testCoachesRetrieval($beneficiaireId)
    {
        try {
            $beneficiaire = Beneficiaire::with('coaches')->find($beneficiaireId);

            if (!$beneficiaire) {
                return [
                    'success' => false,
                    'message' => "Bénéficiaire avec ID {$beneficiaireId} non trouvé"
                ];
            }

            // Utiliser la même logique que dans InformationsGeneralesSheet
            $instance = new self(0, 0, '');
          //  $coachesInfo = $instance->getCoachesInfo($beneficiaire);

            // Vérifier également la table pivot directement
            $pivotData = DB::table('coach_beneficiaires')
                ->where('beneficiaires_id', $beneficiaireId)
                ->get();

            return [
                'success' => true,
                'beneficiaire' => [
                    'id' => $beneficiaire->id,
                    'nom' => $beneficiaire->nom_complet
                ],
                //'coaches_info' => $coachesInfo,
                'raw_coaches' => isset($beneficiaire->coaches)
                    ? ($beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection
                        ? $beneficiaire->coaches->toArray()
                        : $beneficiaire->coaches)
                    : null,
                'pivot_data' => $pivotData->toArray()
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => explode("\n", $e->getTraceAsString())
            ];
        }
    }
/**
 * Prépare les données pour l'export en s'assurant que toutes les clés nécessaires sont présentes
 */
private function prepareExportData($data): array
{
    // Liste des clés obligatoires avec leurs valeurs par défaut
    $requiredKeys = [
        'id_entreprise' => 'N/A',
        'nom_entreprise' => 'N/A',
        'exercice' => $this->annee,
        'frequence' => $this->periodeType,
        'periode' => 'N/A',
        'statut' => 'N/A',
        'date_collecte' => 'N/A',
        'type_collecte' => 'N/A',
        'collecte_par' => 'N/A',
        'date_creation' => 'N/A',
        'date_modification' => 'N/A',
        'ong' => 'N/A',
        'coaches' => 'N/A',
        'province' => 'N/A',
        'region' => 'N/A',
        'secteur_activite' => 'N/A',
        'institutionFinanciere' => 'N/A',
    ];

    // Fusionner les données existantes avec les valeurs par défaut
    return array_merge($requiredKeys, $data);
}


public function debugCollection()
{
    try {
        $result = $this->collection();
        if (!$result instanceof Collection) {
            Log::critical('InformationsGeneralesSheet::collection() ne retourne pas une Collection!', [
                'type' => gettype($result),
                'value' => $result
            ]);
        }
        return $result;
    } catch (\Exception $e) {
        Log::critical('Exception dans InformationsGeneralesSheet::debugCollection', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return collect([['error' => $e->getMessage()]]);
    }
}

}


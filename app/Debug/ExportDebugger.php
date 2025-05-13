<?php
namespace App\Debug;

use App\Models\Beneficiaire;
use App\Models\Coach;
use App\Models\Entreprise;
use App\Models\Collecte;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ExportDebugger
{
    /**
     * Exécuter des diagnostics sur les relations
     */
    public static function diagnoseRelations()
    {
        $results = [];

        // 1. Tester la relation coaches sur les bénéficiaires
        try {
            $beneficiaires = Beneficiaire::with('coaches')->take(5)->get();

            foreach ($beneficiaires as $b) {
                $results['beneficiaires'][] = [
                    'id' => $b->id,
                    'nom' => $b->nom_complet,
                    'has_coaches_relation' => method_exists($b, 'coaches'),
                    'coaches_type' => gettype($b->coaches),
                    'coaches_count' => $b->coaches instanceof \Illuminate\Database\Eloquent\Collection ? $b->coaches->count() : 'N/A',
                ];
            }
        } catch (\Exception $e) {
            $results['error_beneficiaires'] = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }

        // 2. Tester la relation beneficiaire->coaches sur les entreprises
        try {
            $entreprises = Entreprise::with('beneficiaire.coaches')->take(5)->get();

            foreach ($entreprises as $e) {
                $coachesInfo = [];

                if ($e->beneficiaire) {
                    if (method_exists($e->beneficiaire, 'coaches')) {
                        if ($e->beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection) {
                            $coachesInfo = [
                                'type' => 'Collection',
                                'count' => $e->beneficiaire->coaches->count(),
                                'names' => $e->beneficiaire->coaches->pluck('nom')->toArray()
                            ];
                        } else {
                            $coachesInfo = [
                                'type' => gettype($e->beneficiaire->coaches),
                                'value' => $e->beneficiaire->coaches
                            ];
                        }
                    } else {
                        $coachesInfo = ['message' => 'Méthode coaches absente'];
                    }
                } else {
                    $coachesInfo = ['message' => 'Pas de bénéficiaire associé'];
                }

                $results['entreprises'][] = [
                    'id' => $e->id,
                    'nom' => $e->nom_entreprise,
                    'beneficiaire_id' => $e->beneficiaire ? $e->beneficiaire->id : null,
                    'coaches_info' => $coachesInfo
                ];
            }
        } catch (\Exception $e) {
            $results['error_entreprises'] = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }

        // 3. Examiner la table pivot coach_beneficiaires
        try {
            $pivotEntries = DB::table('coach_beneficiaires')
                ->select('coach_beneficiaires.*')
                ->take(10)
                ->get();

            $results['pivot_table'] = [
                'count' => $pivotEntries->count(),
                'sample' => $pivotEntries->take(3)->toArray()
            ];
        } catch (\Exception $e) {
            $results['error_pivot'] = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }

        // 4. Vérifier les collectes pour détecter les problèmes potentiels
        try {
            $collectes = Collecte::with([
                'entreprise',
                'entreprise.beneficiaire',
                'entreprise.beneficiaire.coaches'
            ])->take(5)->get();

            $results['collectes'] = [];

            foreach ($collectes as $collecte) {
                $collecteInfo = [
                    'id' => $collecte->id,
                    'entreprise_id' => $collecte->entreprise_id,
                    'entreprise_exists' => $collecte->entreprise ? true : false,
                ];

                if ($collecte->entreprise) {
                    $collecteInfo['beneficiaire_id'] = $collecte->entreprise->beneficiaires_id ?? null;
                    $collecteInfo['beneficiaire_exists'] = $collecte->entreprise->beneficiaire ? true : false;

                    if ($collecte->entreprise->beneficiaire) {
                        // Vérification du type de la relation coaches
                        $coachesInfo = null;

                        if (isset($collecte->entreprise->beneficiaire->coaches)) {
                            if (is_object($collecte->entreprise->beneficiaire->coaches)) {
                                $coachesInfo = [
                                    'type' => get_class($collecte->entreprise->beneficiaire->coaches),
                                    'is_collection' => $collecte->entreprise->beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection,
                                    'count' => $collecte->entreprise->beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection
                                        ? $collecte->entreprise->beneficiaire->coaches->count()
                                        : 'N/A'
                                ];
                            } else {
                                $coachesInfo = [
                                    'type' => gettype($collecte->entreprise->beneficiaire->coaches),
                                    'raw_value' => $collecte->entreprise->beneficiaire->coaches
                                ];
                            }
                        } else {
                            $coachesInfo = ['message' => 'Propriété coaches non définie'];
                        }

                        $collecteInfo['coaches_info'] = $coachesInfo;
                    }
                }

                $results['collectes'][] = $collecteInfo;
            }
        } catch (\Exception $e) {
            $results['error_collectes'] = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }

        // 5. Vérifier les requêtes SQL qui seraient utilisées pendant l'export
        try {
            DB::enableQueryLog();

            // Tenter d'exécuter une requête similaire à celle utilisée dans InformationsGeneralesSheet
            $query = Collecte::with([
                'entreprise',
                'entreprise.beneficiaire',
                'entreprise.beneficiaire.ong',
                'entreprise.beneficiaire.coaches',
                'entreprise.beneficiaire.institutionFinanciere',
                'exercice',
                'user'
            ])->where('periode', 'like', '%Annuelle%')->take(2)->get();

            $queryLog = DB::getQueryLog();
            DB::disableQueryLog();

            $results['query_log'] = [
                'count' => count($queryLog),
                'queries' => array_map(function($q) {
                    return [
                        'query' => $q['query'],
                        'bindings' => $q['bindings'],
                        'time' => $q['time']
                    ];
                }, $queryLog)
            ];
        } catch (\Exception $e) {
            $results['error_query_log'] = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ];
        }

        return $results;
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
            $coachesInfo = self::getCoachesInfo($beneficiaire);

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
                'coaches_info' => $coachesInfo,
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
     * Méthode sécurisée pour récupérer les informations des coaches
     * (copie de la méthode dans InformationsGeneralesSheet)
     */
    protected static function getCoachesInfo($beneficiaire)
    {
        if (!$beneficiaire) {
            return 'N/A';
        }

        try {
            // Si beneficiaire a une relation coaches chargée et c'est une collection
            if (isset($beneficiaire->coaches) && $beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection) {
                if ($beneficiaire->coaches->isNotEmpty()) {
                    // Récupérer les noms des coaches de façon sécurisée
                    $coachNames = [];
                    foreach ($beneficiaire->coaches as $coach) {
                        if (isset($coach->nom)) {
                            $coachNames[] = $coach->nom;
                        } elseif (isset($coach->name)) {
                            $coachNames[] = $coach->name;
                        }
                    }
                    return implode(', ', $coachNames);
                }
                return 'Aucun coach';
            }

            // Si la relation coaches existe mais n'est pas chargée, la charger
            if (method_exists($beneficiaire, 'coaches') && !isset($beneficiaire->coaches)) {
                $beneficiaire->load('coaches');
                if ($beneficiaire->coaches->isNotEmpty()) {
                    return $beneficiaire->coaches->pluck('nom')->implode(', ');
                }
                return 'Aucun coach';
            }

            // Si relation coach simple existe et c'est un objet
            if (isset($beneficiaire->coach) && is_object($beneficiaire->coach)) {
                return $beneficiaire->coach->nom ?? $beneficiaire->coach->name ?? 'N/A';
            }

            // Si c'est juste un ID de coach
            if (isset($beneficiaire->coach_id) && is_numeric($beneficiaire->coach_id)) {
                try {
                    $coach = Coach::find($beneficiaire->coach_id);
                    return $coach ? $coach->nom : 'Coach ID: ' . $beneficiaire->coach_id;
                } catch (\Exception $e) {
                    return 'Erreur Coach ID: ' . $beneficiaire->coach_id;
                }
            }

            // Fallback pour vérifier s'il s'agit d'un entier (coach_id) directement
            if (isset($beneficiaire->coaches) && is_int($beneficiaire->coaches)) {
                try {
                    $coach = Coach::find($beneficiaire->coaches);
                    return $coach ? $coach->nom : 'Coach ID direct: ' . $beneficiaire->coaches;
                } catch (\Exception $e) {
                    return 'Erreur Coach ID direct: ' . $beneficiaire->coaches;
                }
            }

            return 'Aucun coach assigné';
        } catch (\Exception $e) {
            Log::error('Erreur dans getCoachesInfo', [
                'message' => $e->getMessage(),
                'bénéficiaire_id' => $beneficiaire->id ?? 'Unknown'
            ]);
            return 'Erreur lors de la récupération des coaches';
        }
    }
}

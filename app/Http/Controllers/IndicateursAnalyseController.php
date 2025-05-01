<?php

namespace App\Http\Controllers;

use App\Services\IndicateursAnalyseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Exercice;
use App\Models\Entreprise;
use App\Models\Collecte;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class IndicateursAnalyseController extends Controller
{
    protected $indicateursService;

    /**
     * Constructeur
     *
     * @param IndicateursAnalyseService $indicateursService
     */
    public function __construct(IndicateursAnalyseService $indicateursService)
    {
        $this->indicateursService = $indicateursService;
    }

    /**
     * Affiche la page du tableau de bord d'analyse
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Récupérer les exercices et les entreprises pour les filtres
        $exercices = Exercice::orderBy('annee', 'desc')->get();
        $entreprises = Entreprise::select('id', 'nom_entreprise')->orderBy('nom_entreprise')->get();

        // Par défaut, on utilise le dernier exercice actif
        $exerciceActif = Exercice::where('actif', true)->orderBy('annee', 'desc')->first();
        $exerciceId = $request->input('exercice_id', $exerciceActif ? $exerciceActif->id : null);

        // Période par défaut
        $periodeType = $request->input('periode_type', 'Trimestrielle');

        // S'assurer que exceptionnel est inclus dans les périodes
        $periodes = ['Trimestrielle', 'Semestrielle', 'Annuelle', 'Occasionnelle'];

        return Inertia::render('Indicateurs/Analyse', [
            'exercices' => $exercices,
            'entreprises' => $entreprises,
            'defaultExerciceId' => $exerciceId,
            'defaultPeriodeType' => $periodeType,
            'periodes' => $periodes, // Périodes standardisées
            // On ne charge pas les données ici, elles seront chargées via une API
        ]);
    }

    /**
     * Récupère les données d'analyse pour une période
     * Endpoint API pour AJAX
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAnalyseData(Request $request)
    {
        try {
            // Récupérer les paramètres avec des valeurs par défaut
            $periodeType = $request->input('periode_type', 'Trimestrielle');
            $exerciceId = $request->input('exercice_id') ? (int)$request->input('exercice_id') : null;
            $entrepriseId = $request->input('entreprise_id') ? (int)$request->input('entreprise_id') : null;

            // Log des paramètres reçus
            Log::info('Paramètres reçus dans getAnalyseData', [
                'periode_type' => $periodeType,
                'exercice_id' => $exerciceId,
                'entreprise_id' => $entrepriseId
            ]);

            // Normaliser le type de période pour éviter les problèmes de casse
            $periodeType = $this->normalizePeriodeType($periodeType);

            // Vérifier la validité du type de période
            $periodesValides = ['Trimestriel', 'Semestriel', 'Annuel', 'Occasionnelle'];
            if (!in_array($periodeType, $periodesValides)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Type de période invalide',
                    'error' => 'Le type de période doit être Trimestrielle, Semestrielle, Annuelle ou Occasionnelle'
                ], 422);
            }

            // Initialiser les variables pour les données
            $donneesAvecCalculs = [];
            $donnees = [];
            $donneesVides = true;
            $isDemo = false;

            // Déterminer les variations possibles du nom de période
            $variationsPeriode = $this->getVariationsPeriode($periodeType);

            // Récupérer les collectes pour la période demandée avec toutes les variations possibles
            $query = Collecte::where(function($q) use ($variationsPeriode) {
                foreach ($variationsPeriode as $index => $variation) {
                    if ($index === 0) {
                        $q->where('periode', 'like', '%' . $variation . '%');
                    } else {
                        $q->orWhere('periode', 'like', '%' . $variation . '%');
                    }
                }
            });

            // Appliquer le filtre exercice si fourni
            if ($exerciceId) {
                $query->where('exercice_id', $exerciceId);
            }

            // Appliquer le filtre entreprise si fourni
            if ($entrepriseId) {
                $query->where('entreprise_id', $entrepriseId);
            }

            $collectes = $query->get();

            Log::info('Collectes pour période ' . $periodeType . ' (avec variations)', [
                'nombre' => $collectes->count(),
                'ids' => $collectes->pluck('id')->toArray(),
                'variations_recherchees' => $variationsPeriode
            ]);

            // Si des collectes existent, traiter leurs données
            if ($collectes->count() > 0) {
                // Utiliser la première collecte pour extraire les données
                $collecte = $collectes->first();
                $donneesBrutes = $collecte->donnees;

                Log::info('Traitement de la collecte ' . $collecte->id, [
                    'periode_valeur' => $collecte->periode,
                    'type_collecte' => $collecte->type_collecte
                ]);

                // Traiter les données différemment selon leur type
                if (is_array($donneesBrutes)) {
                    Log::info('Données déjà sous forme de tableau PHP');
                    $donnees = $donneesBrutes;
                } else {
                    // Essayer de décoder le JSON
                    try {
                        $donnees = json_decode($donneesBrutes, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            Log::warning('Erreur de décodage JSON: ' . json_last_error_msg());
                            $donnees = [];
                        } else {
                            Log::info('Structure des données JSON décodées', [
                                'cles_principales' => array_keys($donnees)
                            ]);
                        }
                    } catch (\Exception $e) {
                        Log::error('Exception lors du décodage JSON: ' . $e->getMessage());
                        $donnees = [];
                    }
                }

                // Vérifier si nous avons des données dans un format spécial (comme "formulaire_exceptionnel")
                if (isset($donnees['formulaire_exceptionnel']) && is_array($donnees['formulaire_exceptionnel'])) {
                    Log::info('Détection du format "formulaire_exceptionnel"');
                    $donnees = $this->transformerDonneesExceptionnelles($donnees['formulaire_exceptionnel'], $periodeType);
                }

                // Vérifier si des données valides ont été récupérées
                $donneesVides = empty($donnees);

                if (!$donneesVides) {
                    // Transformer les données dans le format attendu par le frontend
                    foreach ($donnees as $categorie => $indicateurs) {
                        // Ignorer les clés qui ne sont pas des catégories d'indicateurs
                        if (!is_array($indicateurs) ||
                            in_array($categorie, [
                                'type_collecte', 'formType', 'beneficiaires_id',
                                'nom', 'prenom'
                            ])) {
                            continue;
                        }

                        $donneesAvecCalculs[$categorie] = [];

                        foreach ($indicateurs as $id => $valeur) {
                            // Ignorer les valeurs non numériques ou vides
                            if (!is_numeric($valeur) || empty($valeur)) {
                                continue;
                            }

                            // Construire l'indicateur au format attendu par le frontend
                            $indicateur = [
                                'id' => $id,
                                'label' => $this->formatIndicateurLibelle($id),
                                'value' => (float)$valeur,
                                'target' => (float)$valeur * 1.1, // Target = +10% par défaut
                                'evolution' => $this->genererEvolutionAleatoire(), // Simuler une évolution
                                'unite' => $this->determinerUnite($id, $categorie), // Déterminer l'unité
                                'definition' => $this->determinerDefinition($id, $categorie), // Déterminer la définition
                                'is_calculated' => false,
                                'metadata' => [
                                    'entreprise_ids' => [$collecte->entreprise_id],
                                    'collecte_ids' => [$collecte->id],
                                    'nombre_points_donnees' => 1
                                ]
                            ];

                            $donneesAvecCalculs[$categorie][] = $indicateur;
                        }
                    }

                    // Logs pour vérifier la transformation
                    Log::info('Transformation des données brutes en format frontend', [
                        'categories' => array_keys($donneesAvecCalculs),
                        'nombre_categories' => count($donneesAvecCalculs)
                    ]);
                }
            }

            // Si aucune donnée valide n'a été trouvée, utiliser des données de démo
            if (empty($donneesAvecCalculs)) {
                Log::warning('Aucune donnée trouvée ou traitable');

                // Retourner la réponse sans données de démo
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'raw_data' => [],
                    'periode_type' => $periodeType,
                    'exercice_id' => $exerciceId,
                    'entreprise_id' => $entrepriseId,
                    'demo_data' => false,
                    'no_data' => true, // Nouveau flag pour indiquer clairement l'absence de données
                    'timestamp' => now()->toIso8601String(),
                ]);
            }
            // Retourner la réponse avec les données
            return response()->json([
                'success' => true,
                'data' => $donneesAvecCalculs,
                'raw_data' => $donnees,
                'periode_type' => $periodeType,
                'exercice_id' => $exerciceId,
                'entreprise_id' => $entrepriseId,
                'demo_data' => $isDemo, // Indiquer si ce sont des données de démo
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur dans getAnalyseData: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des données',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Normalise le type de période pour éviter les problèmes de casse
     *
     * @param string $periodeType
     * @return string
     */
    private function normalizePeriodeType(string $periodeType): string
    {
        // Convertir en minuscules pour la comparaison
        $type = strtolower($periodeType);

        // Renvoyer le format standard
        if (strpos($type, 'trimestre') !== false || strpos($type, 'trimestriel') !== false) {
            return 'Trimestriel';
        }
        if (strpos($type, 'semestre') !== false || strpos($type, 'semestriel') !== false) {
            return 'Semestriel';
        }
        if (strpos($type, 'annuel') !== false || strpos($type, 'annee') !== false || strpos($type, 'an') !== false) {
            return 'Annuel';
        }
        if (strpos($type, 'exception') !== false || strpos($type, 'occasion') !== false) {
            return 'Occasionnelle';
        }

        // Par défaut, retourner la valeur originale
        return $periodeType;
    }

    /**
     * Obtenir les variations possibles d'un nom de période
     *
     * @param string $periodeType
     * @return array
     */
    private function getVariationsPeriode(string $periodeType): array
    {
        $variations = [];

        // Ajouter la valeur originale
        $variations[] = $periodeType;

        // Ajouter la version en minuscules
        $variations[] = strtolower($periodeType);

        // Ajouter des variations spécifiques selon le type
        switch ($periodeType) {
            case 'Trimestrielle':
                $variations[] = 'trimestre';
                $variations[] = 'Trimestriel';
                $variations[] = 'trim';
                $variations[] = 't1'; // Premier trimestre
                $variations[] = 't2'; // Deuxième trimestre
                $variations[] = 't3'; // Troisième trimestre
                $variations[] = 't4'; // Quatrième trimestre
                break;
            case 'Semestrielle':
                $variations[] = 'semestre';
                $variations[] = 'Semestriel';
                $variations[] = 'sem';
                $variations[] = 's1'; // Premier semestre
                $variations[] = 's2'; // Deuxième semestre
                break;
            case 'Annuelle':
                $variations[] = 'annuel';
                $variations[] = 'Annuel';
                $variations[] = 'an';
                $variations[] = 'année';
                $variations[] = 'ann';
                break;
            case 'Occasionnelle':
                $variations[] = 'occasionnel';
                $variations[] = 'exceptionnel';
                $variations[] = 'exception';
                $variations[] = 'except';
                $variations[] = 'occasion';
                $variations[] = 'occa';
                break;
        }

        return array_unique($variations);
    }

    /**
     * Transformer les données exceptionnelles en format standard
     *
     * @param array $donneesExceptionnelles
     * @param string $periodeType
     * @return array
     */
    // private function transformerDonneesExceptionnelles(array $donneesExceptionnelles, string $periodeType): array
    // {
    //     // Créer une structure standard compatible avec votre frontend
    //     $donneesTransformees = [];

    //     // Traiter spécifiquement selon la période
    //     if ($periodeType === 'Occasionnelle') {
    //         // Création de catégories basées sur les données exceptionnelles
    //         $indicateursFormation = [];
    //         $indicateursBancarisation = [];
    //         $indicateursAppreciation = [];

    //         // Traiter les données de formation
    //         if (isset($donneesExceptionnelles['formation_technique_recu']) && $donneesExceptionnelles['formation_technique_recu']) {
    //             $indicateursFormation['formation_technique_recu'] = 1;
    //         }

    //         if (isset($donneesExceptionnelles['formation_entrepreneuriat_recu']) && $donneesExceptionnelles['formation_entrepreneuriat_recu']) {
    //             $indicateursFormation['formation_entrepreneuriat_recu'] = 1;
    //         }

    //         if (isset($donneesExceptionnelles['formations_techniques']) && is_array($donneesExceptionnelles['formations_techniques'])) {
    //             $indicateursFormation['nbr_formations_techniques'] = count($donneesExceptionnelles['formations_techniques']);
    //         }

    //         if (isset($donneesExceptionnelles['formations_entrepreneuriat']) && is_array($donneesExceptionnelles['formations_entrepreneuriat'])) {
    //             $indicateursFormation['nbr_formations_entrepreneuriat'] = count($donneesExceptionnelles['formations_entrepreneuriat']);
    //         }

    //         // Traiter les données de bancarisation
    //         if (isset($donneesExceptionnelles['est_bancarise_demarrage'])) {
    //             $indicateursBancarisation['est_bancarise_demarrage'] = $donneesExceptionnelles['est_bancarise_demarrage'] ? 1 : 0;
    //         }

    //         if (isset($donneesExceptionnelles['est_bancarise_fin'])) {
    //             $indicateursBancarisation['est_bancarise_fin'] = $donneesExceptionnelles['est_bancarise_fin'] ? 1 : 0;
    //         }

    //         // Traiter les données d'appréciation
    //         foreach (['appreciation_organisation_interne_demarrage', 'appreciation_services_adherents_demarrage',
    //                   'appreciation_relations_externes_demarrage', 'appreciation_organisation_interne_fin',
    //                   'appreciation_services_adherents_fin', 'appreciation_relations_externes_fin'] as $cle) {
    //             if (isset($donneesExceptionnelles[$cle]) && is_numeric($donneesExceptionnelles[$cle])) {
    //                 $indicateursAppreciation[$cle] = $donneesExceptionnelles[$cle];
    //             }
    //         }

    //         // Regrouper par catégories
    //         if (!empty($indicateursFormation)) {
    //             $donneesTransformees['Indicateurs de formation'] = $indicateursFormation;
    //         }

    //         if (!empty($indicateursBancarisation)) {
    //             $donneesTransformees['Indicateurs de bancarisation'] = $indicateursBancarisation;
    //         }

    //         if (!empty($indicateursAppreciation)) {
    //             $donneesTransformees['Indicateurs d\'appréciation'] = $indicateursAppreciation;
    //         }

    //         // Ajouter les autres données comme catégorie générique si nécessaire
    //         $autresIndicateurs = [];
    //         foreach ($donneesExceptionnelles as $cle => $valeur) {
    //             if (is_numeric($valeur) &&
    //                 !in_array($cle, array_merge(
    //                     array_keys($indicateursFormation),
    //                     array_keys($indicateursBancarisation),
    //                     array_keys($indicateursAppreciation)
    //                 ))) {
    //                 $autresIndicateurs[$cle] = $valeur;
    //             }
    //         }

    //         if (!empty($autresIndicateurs)) {
    //             $donneesTransformees['Autres indicateurs exceptionnels'] = $autresIndicateurs;
    //         }
    //     }

    //     // Si aucune donnée transformée, retourner les données brutes
    //     if (empty($donneesTransformees)) {
    //         // Extraire seulement les valeurs numériques
    //         $donneesNumeriques = [];
    //         foreach ($donneesExceptionnelles as $cle => $valeur) {
    //             if (is_numeric($valeur)) {
    //                 $donneesNumeriques[$cle] = $valeur;
    //             }
    //         }

    //         if (!empty($donneesNumeriques)) {
    //             $donneesTransformees['Indicateurs exceptionnels'] = $donneesNumeriques;
    //         }
    //     }

    //     return $donneesTransformees;
    // }
    private function transformerDonneesExceptionnelles(array $donneesExceptionnelles, string $periodeType): array
    {
        // Créer une structure standard compatible avec votre frontend
        $donneesTransformees = [];

        // Si le tableau contient déjà la clé 'beneficiaire_nom', c'est probablement un formulaire exceptionnel complet
        if (isset($donneesExceptionnelles['beneficiaire_nom']) ||
            isset($donneesExceptionnelles['beneficiaires_id'])) {

            // Traitement spécifique pour le type de formulaire exceptionnel
            Log::info('Détection d\'un formulaire exceptionnel complet');

            // Création de catégories basées sur les données exceptionnelles
            $indicateursFormation = [];
            $indicateursBancarisation = [];
            $indicateursAppreciation = [];

            // Traiter les données de formation
            if (isset($donneesExceptionnelles['formation_technique_recu']) && $donneesExceptionnelles['formation_technique_recu']) {
                $indicateursFormation['formation_technique_recu'] = 1;
            }

            if (isset($donneesExceptionnelles['formation_entrepreneuriat_recu']) && $donneesExceptionnelles['formation_entrepreneuriat_recu']) {
                $indicateursFormation['formation_entrepreneuriat_recu'] = 1;
            }

            if (isset($donneesExceptionnelles['formations_techniques']) && is_array($donneesExceptionnelles['formations_techniques'])) {
                $indicateursFormation['nbr_formations_techniques'] = count($donneesExceptionnelles['formations_techniques']);
            }

            if (isset($donneesExceptionnelles['formations_entrepreneuriat']) && is_array($donneesExceptionnelles['formations_entrepreneuriat'])) {
                $indicateursFormation['nbr_formations_entrepreneuriat'] = count($donneesExceptionnelles['formations_entrepreneuriat']);
            }

            // Traiter les données de bancarisation
            if (isset($donneesExceptionnelles['est_bancarise_demarrage'])) {
                $indicateursBancarisation['est_bancarise_demarrage'] = $donneesExceptionnelles['est_bancarise_demarrage'] ? 1 : 0;
            }

            if (isset($donneesExceptionnelles['est_bancarise_fin'])) {
                $indicateursBancarisation['est_bancarise_fin'] = $donneesExceptionnelles['est_bancarise_fin'] ? 1 : 0;
            }

            // Traiter les données d'appréciation
            foreach (['appreciation_organisation_interne_demarrage', 'appreciation_services_adherents_demarrage',
                      'appreciation_relations_externes_demarrage', 'appreciation_organisation_interne_fin',
                      'appreciation_services_adherents_fin', 'appreciation_relations_externes_fin'] as $cle) {
                if (isset($donneesExceptionnelles[$cle]) && is_numeric($donneesExceptionnelles[$cle])) {
                    $indicateursAppreciation[$cle] = $donneesExceptionnelles[$cle];
                }
            }

            // Regrouper par catégories
            if (!empty($indicateursFormation)) {
                $donneesTransformees['Indicateurs de formation'] = $indicateursFormation;
            }

            if (!empty($indicateursBancarisation)) {
                $donneesTransformees['Indicateurs de bancarisation'] = $indicateursBancarisation;
            }

            if (!empty($indicateursAppreciation)) {
                $donneesTransformees['Indicateurs d\'appréciation'] = $indicateursAppreciation;
            }

            // Ajouter des informations sur le bénéficiaire pour aider à l'identification
            if (isset($donneesExceptionnelles['nom']) || isset($donneesExceptionnelles['prenom'])) {
                $nomComplet = trim(($donneesExceptionnelles['nom'] ?? '') . ' ' .
                                 ($donneesExceptionnelles['prenom'] ?? ''));

                if (!empty($nomComplet)) {
                    $donneesTransformees['Informations bénéficiaire'] = [
                        'nom_beneficiaire' => $nomComplet,
                        'id_beneficiaire' => $donneesExceptionnelles['beneficiaires_id'] ?? 0
                    ];
                }
            }
        }

        // Si aucune donnée transformée, extraire les valeurs numériques
        if (empty($donneesTransformees)) {
            // Log pour débogage
            Log::info('Extraction des valeurs numériques depuis les données exceptionnelles', [
                'keys' => array_keys($donneesExceptionnelles)
            ]);

            $donneesNumeriques = [];
            foreach ($donneesExceptionnelles as $cle => $valeur) {
                if (is_numeric($valeur)) {
                    $donneesNumeriques[$cle] = $valeur;
                }
            }

            if (!empty($donneesNumeriques)) {
                $donneesTransformees['Indicateurs exceptionnels'] = $donneesNumeriques;
            }
        }

        // Log du résultat pour débogage
        Log::info('Données transformées depuis le format exceptionnel', [
            'categories' => array_keys($donneesTransformees)
        ]);

        return $donneesTransformees;
    }
    /**
     * Générer des données de démonstration pour le tableau de bord selon la période
     * Les données de démo sont clairement marquées
     *
     * @param string $periodeType
     * @param float $facteur
     * @param int|null $entrepriseId
     * @return array
     */
    private function getDonneesDemoParPeriode(string $periodeType, float $facteur, ?int $entrepriseId = null): array
    {
        switch ($periodeType) {
            case 'Trimestrielle':
                return [
                    "Indicateurs commerciaux de l'entreprise du promoteur" => [
                        [
                            'id' => 'propects_grossites',
                            'label' => 'Nombre de clients prospectés (grossistes)',
                            'value' => round(25 * $facteur),
                            'target' => round(30 * $facteur),
                            'evolution' => '+12%',
                            'unite' => '',
                            'definition' => "Le nombre de clients potentiels prospectés par le promoteur",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'prospects_detaillant',
                            'label' => 'Nombre de clients prospectés (détaillants)',
                            'value' => round(45 * $facteur),
                            'target' => round(50 * $facteur),
                            'evolution' => '+8%',
                            'unite' => '',
                            'definition' => "Le nombre de clients potentiels prospectés par le promoteur",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'clients_grossistes',
                            'label' => 'Nombre de nouveaux clients (grossistes)',
                            'value' => round(15 * $facteur),
                            'target' => round(18 * $facteur),
                            'evolution' => '+5%',
                            'unite' => '',
                            'definition' => "Nombre de nouveaux clients obtenus",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    'Indicateurs de performance Projet' => [
                        [
                            'id' => 'credit_rembourse',
                            'label' => 'Montants cumulés des remboursements',
                            'value' => round(1200000 * $facteur),
                            'target' => round(1300000 * $facteur),
                            'evolution' => '+7%',
                            'unite' => 'FCFA',
                            'definition' => 'Collecte des montants de crédits remboursés',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    "Indicateurs de trésorerie de l'entreprise du promoteur" => [
                        [
                            'id' => 'montant_creance_clients_12m',
                            'label' => 'Montant des créances clients irrécouvrables',
                            'value' => round(500000 * $facteur),
                            'target' => round(450000 * $facteur),
                            'evolution' => '-5%',
                            'unite' => 'FCFA',
                            'definition' => 'Montant des créances clients irrécouvrables',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ]
                ];

            case 'Semestrielle':
                return [
                    "Indicateurs d'activités de l'entreprise du promoteur" => [
                        [
                            'id' => 'nbr_cycle_production',
                            'label' => 'Nombre de cycles de production réalisés',
                            'value' => 20,
                            'target' => 22,
'evolution' => '-12%',
                            'unite' => '',
                            'definition' => 'Nombre de cycles de production réalisés au cours du semestre',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'nbr_clients',
                            'label' => 'Nombre de clients fidélisés',
                            'value' => 30,
                            'target' => 33,
                            'evolution' => '-4%',
                            'unite' => '',
                            'definition' => 'Nombre de clients fidélisés',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'chiffre_affaire',
                            'label' => "Chiffre d'affaires",
                            'value' => 20000,
                            'target' => 22000,
                            'evolution' => '-8%',
                            'unite' => 'FCFA',
                            'definition' => "Montant cumulé des ventes réalisées",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'taux_croissance_ca',
                            'label' => "Taux de croissance du Chiffre d'affaires",
                            'value' => 25000,
                            'target' => 27500,
                            'evolution' => '+7%',
                            'unite' => '',
                            'definition' => "Taux de croissance du chiffre d'affaires",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    'Indicateurs de Rentabilité et de solvabilité' => [
                        [
                            'id' => 'cout_matiere_premiere',
                            'label' => 'Coût des matières premières',
                            'value' => 25100,
                            'target' => 22590,
                            'evolution' => '+10%',
                            'unite' => '',
                            'definition' => 'Coût total des matières premières',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'cout_main_oeuvre',
                            'label' => "Coût de la main d'œuvre directe",
                            'value' => 36000,
                            'target' => 32400,
                            'evolution' => '+1%',
                            'unite' => '',
                            'definition' => "Coût de la main d'œuvre",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'cout_frais_generaux',
                            'label' => 'Coût des frais généraux',
                            'value' => 5000,
                            'target' => 4500,
                            'evolution' => '+13%',
                            'unite' => '',
                            'definition' => "Coût des frais généraux",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    'Indicateurs de performance Projet' => [
                        [
                            'id' => 'total_autres_revenus',
                            'label' => 'Revenus hors entreprise principale',
                            'value' => 2500,
                            'target' => 2750,
                            'evolution' => '-10%',
                            'unite' => 'FCFA',
                            'definition' => "Revenus hors entreprise principale",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'chiffre_affaire',
                            'label' => "Chiffre d'affaires",
                            'value' => 6022222222,
                            'target' => 6624444444,
                            'evolution' => '+25%',
                            'unite' => 'FCFA',
                            'definition' => "Chiffre d'affaires total",
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ]
                ];

            case 'Annuelle':
                return [
                    "Ratios de Rentabilité et de solvabilité de l'entreprise" => [
                        [
                            'id' => 'charges_financieres',
                            'label' => 'Charges financières (intérêts et frais)',
                            'value' => 25000,
                            'target' => 22500,
                            'evolution' => '+5%',
                            'unite' => '',
                            'definition' => 'Charges financières annuelles',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'dette_financement',
                            'label' => 'Dettes de financement',
                            'value' => 30000,
                            'target' => 27000,
                            'evolution' => '+8%',
                            'unite' => '',
                            'definition' => 'Dettes de financement',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'moyenne_capitaux_propre',
                            'label' => 'Moyenne des capitaux propres',
                            'value' => 2555,
                            'target' => 2810,
                            'evolution' => '+10%',
                            'unite' => '',
                            'definition' => 'Moyenne des capitaux propres',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    "Indicateurs de trésorerie de l'entreprise du promoteur" => [
                        [
                            'id' => 'montant_credit',
                            'label' => 'Montant cumulé des crédits reçus',
                            'value' => 256000,
                            'target' => 281600,
                            'evolution' => '+10%',
                            'unite' => 'FCFA',
                            'definition' => 'Montant cumulé des crédits reçus',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'nombres_credits',
                            'label' => 'Nombre de crédits reçus',
                            'value' => 3,
                            'target' => 4,
                            'evolution' => '+33%',
                            'unite' => '',
                            'definition' => 'Nombre de crédits reçus',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ]
                ];

            case 'Occasionnelle':
                return [
                    'Indicateurs de formation' => [
                        [
                            'id' => 'nbr_formation_entrepreneuriat_h',
                            'label' => 'Nombre d\'hommes formés en entrepreneuriat',
                            'value' => 25,
                            'target' => 30,
                            'evolution' => '+15%',
                            'unite' => '',
                            'definition' => 'Nombre de jeunes hommes participant aux formations en entrepreneuriat',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'nbr_formation_entrepreneuriat_f',
                            'label' => 'Nombre de femmes formées en entrepreneuriat',
                            'value' => 35,
                            'target' => 40,
                            'evolution' => '+12%',
                            'unite' => '',
                            'definition' => 'Nombre de jeunes femmes participant aux formations en entrepreneuriat',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    'Indicateurs de bancarisation' => [
                        [
                            'id' => 'nbr_bancarisation_h',
                            'label' => 'Nombre d\'hommes bancarisés',
                            'value' => 18,
                            'target' => 22,
                            'evolution' => '+10%',
                            'unite' => '',
                            'definition' => 'Nombre de promoteurs hommes disposant de comptes bancaires',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'nbr_bancarisation_f',
                            'label' => 'Nombre de femmes bancarisées',
                            'value' => 22,
                            'target' => 25,
                            'evolution' => '+8%',
                            'unite' => '',
                            'definition' => 'Nombre de promotrices femmes disposant de comptes bancaires',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ],
                    'Indicateurs d\'appréciation' => [
                        [
                            'id' => 'appreciation_ong',
                            'label' => 'Appréciation de l\'organisation interne',
                            'value' => 2.7,
                            'target' => 3,
                            'evolution' => '+5%',
                            'unite' => '/3',
                            'definition' => 'Score moyen d\'appréciation de l\'organisation interne',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ],
                        [
                            'id' => 'insertion_professionnelle',
                            'label' => 'Taux d\'insertion professionnelle',
                            'value' => 85,
                            'target' => 90,
                            'evolution' => '+2%',
                            'unite' => '%',
                            'definition' => 'Pourcentage de jeunes ayant développé des initiatives d\'insertion',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ]
                ];

            default:
                return [
                    'Indicateurs par défaut' => [
                        [
                            'id' => 'valeur_demo',
                            'label' => 'Valeur de démonstration',
                            'value' => 100,
                            'target' => 110,
                            'evolution' => '+10%',
                            'unite' => '',
                            'definition' => 'Valeur de démonstration',
                            'is_calculated' => false,
                            'metadata' => ['demo' => true]
                        ]
                    ]
                ];
        }
    }

    /**
     * Formater le libellé d'un indicateur à partir de son identifiant
     *
     * @param string $indicateurId
     * @return string
     */
    private function formatIndicateurLibelle(string $indicateurId): string
    {
        // Convertir snake_case en texte lisible
        $libelle = str_replace('_', ' ', $indicateurId);

        // Mettre la première lettre en majuscule
        return ucfirst($libelle);
    }

    /**
     * Déterminer l'unité d'un indicateur en fonction de son ID et de sa catégorie
     *
     * @param string $id
     * @param string $categorie
     * @return string
     */
    private function determinerUnite(string $id, string $categorie): string
    {
        // Indicateurs monétaires
        if (strpos($id, 'cout') !== false ||
            strpos($id, 'montant') !== false ||
            strpos($id, 'capital') !== false ||
            strpos($id, 'chiffre') !== false ||
            strpos($id, 'revenu') !== false ||
            strpos($id, 'credit') !== false ||
            strpos($id, 'financ') !== false) {
            return 'FCFA';
        }

        // Indicateurs en pourcentage
        if (strpos($id, 'taux') !== false ||
            strpos($id, 'proportion') !== false ||
            strpos($id, 'pourcentage') !== false) {
            return '%';
        }

        // Par défaut
        return '';
    }

    /**
     * Déterminer la définition d'un indicateur en fonction de son ID et de sa catégorie
     *
     * @param string $id
     * @param string $categorie
     * @return string
     */
    private function determinerDefinition(string $id, string $categorie): string
    {
        // Définitions spécifiques pour certains indicateurs courants
        $definitions = [
            'chiffre_affaire' => "Montant cumulé des ventes réalisées par l'entreprise sur une période donnée",
            'resultat_net' => "Bénéfice ou perte après impôts",
            'ratio_rentabilite' => "Rapport entre le résultat net et le chiffre d'affaires",
            'taux_croissance_ca' => "Taux de croissance du chiffre d'affaires par rapport à la période précédente"
        ];

        // Retourner la définition spécifique si elle existe
        if (isset($definitions[$id])) {
            return $definitions[$id];
        }

        // Sinon, retourner une définition générique basée sur le libellé
        return "Indicateur " . $this->formatIndicateurLibelle($id);
    }

    /**
     * Générer une valeur d'évolution aléatoire pour les démonstrations
     *
     * @return string
     */
    private function genererEvolutionAleatoire(): string
    {
        $valeur = mt_rand(-15, 25);
        $signe = $valeur >= 0 ? '+' : '';
        return $signe . $valeur . '%';
    }

    /**
     * Récupère les données d'évolution d'un indicateur spécifique
     * Endpoint API pour AJAX
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIndicateurEvolution(Request $request)
    {
        try {
            $validated = $request->validate([
                'indicateur_id' => 'required|string',
                'categorie' => 'required|string',
                'periode_type' => 'required|string|in:Trimestriel, Semestriel, Annuel,Occasionnelle',
                'exercice_id' => 'nullable|integer|exists:exercices,id',
                'entreprise_id' => 'nullable|integer|exists:entreprises,id',
            ]);

            $indicateurId = $validated['indicateur_id'];
            $categorie = $validated['categorie'];
            $periodeType = $validated['periode_type'];
            $exerciceId = $validated['exercice_id'] ?? null;
            $entrepriseId = $validated['entreprise_id'] ?? null;

            // Récupérer les données d'évolution
            $evolutionData = $this->indicateursService->getIndicateurEvolutionData(
                $indicateurId,
                $categorie,
                $periodeType,
                $exerciceId,
                $entrepriseId
            );

            // Indiquer si ce sont des données de démo
            $isDemo = count($evolutionData['evolution_data']) === 0 ||
                      (isset($evolutionData['metadata']) && isset($evolutionData['metadata']['demo']) && $evolutionData['metadata']['demo']);

            return response()->json([
                'success' => true,
                'data' => $evolutionData,
                'demo_data' => $isDemo
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des données d\'évolution: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des données d\'évolution',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Exporte les indicateurs au format Excel
     * Endpoint API
     *
     * @param Request $request
     * @return BinaryFileResponse
     */
    public function exportExcel(Request $request)
    {
        try {
            // Validation des entrées
            $validated = $request->validate([
                'periode_type' => 'required|string|in:Trimestrielle,Semestrielle,Annuelle,Occasionnelle',
                'categorie' => 'nullable|string',
                'exercice_id' => 'nullable|integer|exists:exercices,id',
                'entreprise_id' => 'nullable|integer|exists:entreprises,id',
            ]);

            $periodeType = $validated['periode_type'];
            $categorie = $validated['categorie'] ?? null;
            $exerciceId = $validated['exercice_id'] ?? null;
            $entrepriseId = $validated['entreprise_id'] ?? null;

            // Log détaillé pour le débogage
            Log::info('Demande d\'exportation Excel', [
                'periodeType' => $periodeType,
                'categorie' => $categorie,
                'exerciceId' => $exerciceId,
                'entrepriseId' => $entrepriseId
            ]);

            // Déléguer au service avec gestion d'erreur explicite
            $response = $this->indicateursService->exportIndicateursToExcel(
                $periodeType,
                $categorie,
                $exerciceId,
                $entrepriseId
            );

            // Si le service retourne une réponse JSON (en cas d'erreur), la relayer
            if ($response instanceof \Illuminate\Http\JsonResponse) {
                Log::info('Réponse JSON reçue du service, relai au client', [
                    'status' => $response->getStatusCode()
                ]);
                return $response;
            }

            // Sinon, c'est une réponse de téléchargement de fichier
            Log::info('Fichier Excel généré avec succès');
            return $response;

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Erreur de validation des entrées
            Log::warning('Validation échouée pour l\'exportation Excel', [
                'errors' => $e->errors()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Paramètres d\'exportation invalides',
                'error' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            // Autre erreur inattendue
            Log::error('Erreur inattendue lors de l\'exportation Excel', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'exportation',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur interne du serveur'
            ], 500);
        }
    }

    /**
     * Affiche la page de détail d'un indicateur
     * Page Inertia
     *
     * @param Request $request
     * @param string $indicateurId
     * @return \Inertia\Response
     */
    public function showIndicateur(Request $request, string $indicateurId)
    {
        try {
            $categorie = $request->query('categorie');
            $periodeType = $request->query('periode_type', 'Trimestrielle');
            $exerciceId = $request->query('exercice_id');

            // Normaliser le type de période
            $periodeType = $this->normalizePeriodeType($periodeType);

            if (!$categorie) {
                return redirect()->route('indicateurs.analyse')
                    ->with('error', 'La catégorie est requise pour afficher les détails d\'un indicateur');
            }

            // Récupérer les informations de l'indicateur
            $evolutionData = $this->indicateursService->getIndicateurEvolutionData(
                $indicateurId,
                $categorie,
                $periodeType,
                $exerciceId
            );

            // Récupérer les exercices pour les filtres
            $exercices = Exercice::orderBy('annee', 'desc')->get();

            // Vérifier si ce sont des données de démo
            $isDemo = count($evolutionData['evolution_data']) === 0 ||
                     (isset($evolutionData['metadata']) && isset($evolutionData['metadata']['demo']) && $evolutionData['metadata']['demo']);

            return Inertia::render('Indicateurs/Detail', [
                'indicateur' => $evolutionData,
                'exercices' => $exercices,
                'periodeType' => $periodeType,
                'categorie' => $categorie,
                'exerciceId' => $exerciceId,
                'demo_data' => $isDemo
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'affichage des détails de l\'indicateur: ' . $e->getMessage());
            return redirect()->route('indicateurs.analyse')
                ->with('error', 'Une erreur est survenue lors de l\'affichage des détails de l\'indicateur');
        }
    }


    public function showAnalyseIntegree(Request $request)
    {
        // Récupérer les exercices et les entreprises pour les filtres
        $exercices = Exercice::orderBy('annee', 'desc')->get();
        $entreprises = Entreprise::select('id', 'nom_entreprise')->orderBy('nom_entreprise')->get();

        // Par défaut, on utilise le dernier exercice actif
        $exerciceActif = Exercice::where('actif', true)->orderBy('annee', 'desc')->first();
        $exerciceId = $request->input('exercice_id', $exerciceActif ? $exerciceActif->id : null);

        // Période par défaut
        $periodeType = $request->input('periode_type', 'Trimestrielle');

        // Périodes standardisées
        $periodes = ['Trimestriel', 'Semestriel', 'Annuel', 'Occasionnelle'];

        return Inertia::render('Indicateurs/AnalyseIntegree', [
            'exercices' => $exercices,
            'entreprises' => $entreprises,
            'defaultExerciceId' => $exerciceId,
            'defaultPeriodeType' => $periodeType,
            'periodes' => $periodes,
        ]);
    }


    /**
     * Récupère la liste des exercices disponibles
     * Endpoint API pour AJAX
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExercices()
    {
        try {
            $exercices = $this->indicateursService->getExercicesDisponibles();

            return response()->json([
                'success' => true,
                'data' => $exercices,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des exercices: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des exercices',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Récupère la liste des entreprises disponibles
     * Endpoint API pour AJAX
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEntreprises()
    {
        try {
            $entreprises = $this->indicateursService->getEntreprisesDisponibles();

            return response()->json([
                'success' => true,
                'data' => $entreprises,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des entreprises: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des entreprises',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Récupère la liste des périodes disponibles
     * Endpoint API pour AJAX
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPeriodes(Request $request)
    {
        try {
            $exerciceId = $request->input('exercice_id');
            $exercice = Exercice::find($exerciceId);
            $annee = $exercice ? $exercice->annee : date('Y');

            // Assurez-vous que cette méthode fonctionne avec les bons paramètres
            $periodes = $this->indicateursService->getPeriodesDisponibles($annee, $exerciceId);

            return response()->json([
                'success' => true,
                'data' => $periodes,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des périodes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des périodes',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}


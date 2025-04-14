<?php

namespace App\Http\Controllers;

use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Exercice;
use App\Models\Indicateur;
use App\Models\Periode;
use App\Models\Beneficiaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class AnalyseController extends Controller
{
    /**
     * Affiche la page d'analyse des indicateurs
     */
    public function index()
    {
        // Récupérer l'exercice actif
        $exerciceActif = Exercice::where('actif', true)->first();

        if (!$exerciceActif) {
            return Inertia::render('Analyses/Index', [
                'error' => 'Aucun exercice actif trouvé. Veuillez activer un exercice pour continuer.'
            ]);
        }

        // Récupérer les périodes de l'exercice actif
        $periodes = Periode::where('exercice_id', $exerciceActif->id)->get();

        // Récupérer tous les exercices pour les filtres
        $exercices = Exercice::all();

        // Récupérer les indicateurs
        $indicateurs = Indicateur::all();

        // Récupérer les filtres géographiques et démographiques
        $regions = DB::table('beneficiaires')->select('regions')->distinct()->pluck('regions');
        $provinces = DB::table('beneficiaires')->select('provinces')->distinct()->pluck('provinces');
        $communes = DB::table('beneficiaires')->select('communes')->distinct()->pluck('communes');

        $typesBeneficiaires = DB::table('beneficiaires')->select('type_beneficiaire')->distinct()->pluck('type_beneficiaire');
        $genres = DB::table('beneficiaires')->select('genre')->distinct()->pluck('genre');

        // Nouveaux filtres
        $handicaps = ['Oui', 'Non'];
        $niveauxInstruction = ['Analphabète', 'Alphabétisé', 'Primaire', 'CEPE', 'BEPC', 'BAC', 'Universitaire'];
        $descriptionsActivite = DB::table('beneficiaires')->select('domaine_activite')->distinct()->pluck('domaine_activite');
        $niveauxDeveloppement = DB::table('beneficiaires')->select('niveau_mise_en_oeuvre')->distinct()->pluck('niveau_mise_en_oeuvre');

        // Récupérer les secteurs d'activité des entreprises
        $secteursActivite = DB::table('entreprises')->select('secteur_activite')->distinct()->pluck('secteur_activite');

        return Inertia::render('Analyses/Index', [
            'exerciceActif' => $exerciceActif,
            'exercices' => $exercices,
            'periodes' => $periodes,
            'indicateurs' => $indicateurs,
            'filtres' => [
                'regions' => $regions,
                'provinces' => $provinces,
                'communes' => $communes,
                'typesBeneficiaires' => $typesBeneficiaires,
                'genres' => $genres,
                'secteursActivite' => $secteursActivite,
                'handicaps' => $handicaps,
                'niveauxInstruction' => $niveauxInstruction,
                'descriptionsActivite' => $descriptionsActivite,
                'niveauxDeveloppement' => $niveauxDeveloppement
            ]
        ]);
    }

    /**
     * Affiche la page de synthèse des indicateurs
     *//**
 * Affiche la page de synthèse des indicateurs
 */
public function synthese()
{
    // Récupérer l'exercice actif
    $exerciceActif = Exercice::where('actif', true)->first();

    if (!$exerciceActif) {
        return Inertia::render('Analyses/Synthese', [
            'error' => 'Aucun exercice actif trouvé. Veuillez activer un exercice pour continuer.'
        ]);
    }

    // Récupérer les périodes de l'exercice actif
    $periodes = Periode::where('exercice_id', $exerciceActif->id)->get();

    // Charger les données des collectes pour l'exercice actif
    $collectes = Collecte::where('exercice_id', $exerciceActif->id)
        ->with(['entreprise', 'entreprise.beneficiaire'])
        ->get();

    // Transformer les données des collectes en indicateurs
    $indicateurs = [];
    foreach ($collectes as $collecte) {
        $entreprise = $collecte->entreprise;
        $beneficiaire = $entreprise->beneficiaire;
        $donnees = $collecte->donnees;

        foreach ($donnees as $categorie => $indicateursData) {
            // Normaliser le nom de la catégorie
            $categorieNormalisee = $categorie;
            if ($categorie === 'tresorerie') $categorieNormalisee = 'tresorerie';

            foreach ($indicateursData as $nomIndicateur => $valeur) {
                // Convertir explicitement la valeur en nombre
                $valeurNumerique = is_numeric($valeur) ? floatval($valeur) : 0;

                // Calculer la tendance (stable par défaut)
                $tendance = 'stable';
                if (is_numeric($valeur)) {
                    $periodes = Periode::where('exercice_id', $collecte->exercice_id)
                        ->orderBy('id', 'asc')
                        ->pluck('id')
                        ->toArray();

                    $indexPeriode = array_search($collecte->periode_id, $periodes);

                    if ($indexPeriode > 0) {
                        $periodePrecedente = $periodes[$indexPeriode - 1];

                        $collectePrecedente = Collecte::where('entreprise_id', $collecte->entreprise_id)
                            ->where('exercice_id', $collecte->exercice_id)
                            ->where('periode_id', $periodePrecedente)
                            ->first();

                        if ($collectePrecedente) {
                            $donneesPrecedentes = $collectePrecedente->donnees;

                            if (isset($donneesPrecedentes[$categorie][$nomIndicateur])) {
                                $valeurPrecedente = $donneesPrecedentes[$categorie][$nomIndicateur];
                                $valeurPrecedente = is_numeric($valeurPrecedente) ? floatval($valeurPrecedente) : 0;

                                if ($valeurNumerique > $valeurPrecedente) {
                                    $tendance = 'hausse';
                                } elseif ($valeurNumerique < $valeurPrecedente) {
                                    $tendance = 'baisse';
                                }
                            }
                        }
                    }
                }

                // Créer un ID d'indicateur fictif s'il n'existe pas dans la base
                $indicateurId = Indicateur::where('nom', $nomIndicateur)
                                        ->where('categorie', $categorieNormalisee)
                                        ->value('id') ?? 0;

                $indicateurs[] = [
                    'id' => count($indicateurs) + 1,
                    'indicateur_id' => $indicateurId,
                    'nom' => $nomIndicateur,
                    'valeur' => $valeurNumerique,
                    'categorie' => $categorieNormalisee,
                    'region' => $beneficiaire->regions,
                    'province' => $beneficiaire->provinces,
                    'commune' => $beneficiaire->communes,
                    'secteur_activite' => $entreprise->secteur_activite,
                    'typeBeneficiaire' => $beneficiaire->type_beneficiaire,
                    'genre' => $beneficiaire->genre,
                    'tendance' => $tendance,
                    'entreprise_id' => $entreprise->id,
                    'entreprise_nom' => $entreprise->nom_entreprise,
                    'exercice_id' => $collecte->exercice_id,
                    'periode_id' => $collecte->periode_id
                ];
            }
        }
    }

    return Inertia::render('Analyses/Synthese', [
        'exerciceActif' => $exerciceActif,
        'periodes' => $periodes,
        'indicateurs' => $indicateurs
    ]);
}
    /**
     * Résumé simplifié des données
     */
    public function resume()
    {
        $exerciceActif = Exercice::where('actif', true)->first();
        $exercices = Exercice::all();
        $periodes = $exerciceActif ? Periode::where('exercice_id', $exerciceActif->id)->get() : [];

        $filtres = [
            'regions' => DB::table('beneficiaires')->select('regions')->distinct()->pluck('regions'),
            'provinces' => DB::table('beneficiaires')->select('provinces')->distinct()->pluck('provinces'),
            'communes' => DB::table('beneficiaires')->select('communes')->distinct()->pluck('communes')
        ];

        return Inertia::render('Analyses/Index', [
            'exerciceActif' => $exerciceActif,
            'exercices' => $exercices,
            'periodes' => $periodes,
            'filtres' => $filtres
        ]);
    }

    /**
     * Récupérer les données d'indicateurs filtrées
     */
    public function getDonneesIndicateurs(Request $request)
    {
        // Valider les filtres
        $validated = $request->validate([
            'exercice_id' => 'nullable|exists:exercices,id',
            'periode_id' => 'nullable|exists:periodes,id',
            'categorie' => 'nullable|string',
            'region' => 'nullable|string',
            'province' => 'nullable|string',
            'commune' => 'nullable|string',
            'secteur_activite' => 'nullable|string',
            'type_beneficiaire' => 'nullable|string',
            'genre' => 'nullable|string',
        ]);

        // Si l'exercice n'est pas spécifié, utiliser l'exercice actif
        if (!isset($validated['exercice_id'])) {
            $exercice = Exercice::where('actif', true)->first();
            $validated['exercice_id'] = $exercice ? $exercice->id : null;
        }

        // Construire la requête
        $query = Collecte::query()
            ->where('exercice_id', $validated['exercice_id']);

        // Filtrer par période
        if (isset($validated['periode_id'])) {
            $query->where('periode_id', $validated['periode_id']);
        }

        // Récupérer les collectes
        $collectes = $query->with(['entreprise', 'entreprise.beneficiaire'])->get();

        Log::debug('Nombre de collectes trouvées: ' . $collectes->count());

        // Mapping des catégories dans les données JSON vers les catégories dans l'interface
        $categoriesMapping = [
            'commercial' => 'commercial',
            'tresorerie' => 'tresorerie'
        ];

        // Transformer les données
        $donneesIndicateurs = [];

        foreach ($collectes as $collecte) {
            $entreprise = $collecte->entreprise;
            $beneficiaire = $entreprise->beneficiaire;

            Log::debug('Analyse collecte #' . $collecte->id . ' pour entreprise ' . $entreprise->nom_entreprise);

            // Vérifier les filtres géographiques et démographiques
            if (
                (isset($validated['region']) && $beneficiaire->regions !== $validated['region']) ||
                (isset($validated['province']) && $beneficiaire->provinces !== $validated['province']) ||
                (isset($validated['commune']) && $beneficiaire->communes !== $validated['commune']) ||
                (isset($validated['type_beneficiaire']) && $beneficiaire->type_beneficiaire !== $validated['type_beneficiaire']) ||
                (isset($validated['genre']) && $beneficiaire->genre !== $validated['genre']) ||
                (isset($validated['secteur_activite']) && $entreprise->secteur_activite !== $validated['secteur_activite'])
            ) {
                Log::debug('Collecte exclue par les filtres géographiques/démographiques');
                continue; // Ignorer cette collecte si elle ne correspond pas aux filtres
            }

            $donnees = $collecte->donnees; // Cast automatique en tableau grâce au cast 'array'
            Log::debug('Catégories dans la collecte: ' . implode(', ', array_keys($donnees)));

            // Si un filtre de catégorie est appliqué, ne prendre que cette catégorie
            if (isset($validated['categorie']) && $validated['categorie'] !== 'all') {
                // Vérifier si la catégorie existe directement
                if (isset($donnees[$validated['categorie']])) {
                    $donneesFiltrees = [$validated['categorie'] => $donnees[$validated['categorie']]];
                }
                // Sinon chercher dans le mapping
                else {
                    $categorieOriginal = array_search($validated['categorie'], $categoriesMapping);
                    if ($categorieOriginal && isset($donnees[$categorieOriginal])) {
                        $donneesFiltrees = [$validated['categorie'] => $donnees[$categorieOriginal]];
                    } else {
                        $donneesFiltrees = [];
                    }
                }
            } else {
                // Prendre toutes les catégories mais les transformer selon le mapping
                $donneesFiltrees = [];
                foreach ($donnees as $categorieOriginal => $valeurs) {
                    $categorieNormalisee = $categoriesMapping[$categorieOriginal] ?? $categorieOriginal;
                    $donneesFiltrees[$categorieNormalisee] = $valeurs;
                }
            }

            Log::debug('Catégories filtrées: ' . implode(', ', array_keys($donneesFiltrees)));

            // Transformer les données pour l'affichage
            foreach ($donneesFiltrees as $categorie => $indicateursData) {
                foreach ($indicateursData as $nomIndicateur => $valeurs) {
                    // Calculer la tendance (stable par défaut)
                    $tendance = 'stable';
                    if (is_numeric($valeurs)) {
                        $periodes = Periode::where('exercice_id', $collecte->exercice_id)
                            ->orderBy('id', 'asc')
                            ->pluck('id')
                            ->toArray();

                        $indexPeriode = array_search($collecte->periode_id, $periodes);

                        if ($indexPeriode > 0) {
                            $periodePrecedente = $periodes[$indexPeriode - 1];

                            $collectePrecedente = Collecte::where('entreprise_id', $collecte->entreprise_id)
                                ->where('exercice_id', $collecte->exercice_id)
                                ->where('periode_id', $periodePrecedente)
                                ->first();

                            if ($collectePrecedente) {
                                $donneesPrecedentes = $collectePrecedente->donnees;
                                $categoriePrec = isset($categoriesMapping[$categorie]) ? array_search($categorie, $categoriesMapping) : $categorie;

                                if (isset($donneesPrecedentes[$categoriePrec][$nomIndicateur])) {
                                    $valeurPrecedente = $donneesPrecedentes[$categoriePrec][$nomIndicateur];

                                    if ($valeurs > $valeurPrecedente) {
                                        $tendance = 'hausse';
                                    } elseif ($valeurs < $valeurPrecedente) {
                                        $tendance = 'baisse';
                                    }
                                }
                            }
                        }
                    }

                    // Créer un ID d'indicateur fictif s'il n'existe pas dans la base
                    $indicateurId = Indicateur::where('nom', $nomIndicateur)
                                              ->where('categorie', $categorie)
                                              ->value('id') ?? 0;

                    $donneesIndicateurs[] = [
                        'id' => count($donneesIndicateurs) + 1,
                        'indicateur_id' => $indicateurId,
                        'nom' => $nomIndicateur,
                        'valeur' => $valeurs,
                        'categorie' => $categorie,
                        'region' => $beneficiaire->regions,
                        'province' => $beneficiaire->provinces,
                        'commune' => $beneficiaire->communes,
                        'secteur_activite' => $entreprise->secteur_activite,
                        'typeBeneficiaire' => $beneficiaire->type_beneficiaire,
                        'genre' => $beneficiaire->genre,
                        'tendance' => $tendance,
                        'entreprise_id' => $entreprise->id,
                        'entreprise_nom' => $entreprise->nom_entreprise,
                        'exercice_id' => $collecte->exercice_id,
                        'periode_id' => $collecte->periode_id
                    ];
                }
            }
        }

        Log::debug('Nombre total d\'indicateurs après filtrage: ' . count($donneesIndicateurs));

        return response()->json([
            'donneesIndicateurs' => $donneesIndicateurs
        ]);
    }

  /**
 * Récupérer des données agrégées pour la synthèse
 */
public function getSyntheseDonnees(Request $request)
{
    // Valider les filtres
    $validated = $request->validate([
        'exercice_id' => 'nullable|exists:exercices,id',
        'periode_id' => 'nullable|exists:periodes,id',
        'categorie' => 'nullable|string',
        'critere_regroupement' => 'nullable|string',
    ]);

    // Si l'exercice n'est pas spécifié, utiliser l'exercice actif
    if (!isset($validated['exercice_id'])) {
        $exercice = Exercice::where('actif', true)->first();
        $validated['exercice_id'] = $exercice ? $exercice->id : null;
    }

    // Récupérer les indicateurs filtrés
    $response = $this->getDonneesIndicateurs($request);
    $indicateurs = json_decode($response->getContent(), true)['donneesIndicateurs'];

    // Critère de regroupement
    $critereRegroupement = $validated['critere_regroupement'] ?? 'region';

    // Variables pour les statistiques
    $statistiquesGlobales = [
        'count' => count($indicateurs),
        'valeurTotale' => 0,
        'parCategorie' => [],
        'tendances' => [
            'hausse' => 0,
            'baisse' => 0,
            'stable' => 0
        ]
    ];

    // Grouper les données selon le critère de regroupement
    $groupes = [];

    foreach ($indicateurs as $indicateur) {
        // Convertir explicitement la valeur en nombre
        $valeur = is_numeric($indicateur['valeur']) ? floatval($indicateur['valeur']) : 0;

        $cleGroupe = $indicateur[$critereRegroupement] ?? 'Non spécifié';

        // Statistiques globales
        $statistiquesGlobales['valeurTotale'] += $valeur;
        $statistiquesGlobales['tendances'][$indicateur['tendance']]++;

        // Statistiques par catégorie
        if (!isset($statistiquesGlobales['parCategorie'][$indicateur['categorie']])) {
            $statistiquesGlobales['parCategorie'][$indicateur['categorie']] = [
                'count' => 0,
                'valeurTotale' => 0
            ];
        }
        $statistiquesGlobales['parCategorie'][$indicateur['categorie']]['count']++;
        $statistiquesGlobales['parCategorie'][$indicateur['categorie']]['valeurTotale'] += $valeur;

        // Groupement par critère
        if (!isset($groupes[$cleGroupe])) {
            $groupes[$cleGroupe] = [
                'nom' => $cleGroupe,
                'count' => 0,
                'valeurTotale' => 0,
                'parCategorie' => [],
                'tendances' => [
                    'hausse' => 0,
                    'baisse' => 0,
                    'stable' => 0
                ],
                'parIndicateur' => []
            ];
        }

        $groupe = &$groupes[$cleGroupe];
        $groupe['count']++;
        $groupe['valeurTotale'] += $valeur;
        $groupe['tendances'][$indicateur['tendance']]++;

        // Statistiques par catégorie dans ce groupe
        if (!isset($groupe['parCategorie'][$indicateur['categorie']])) {
            $groupe['parCategorie'][$indicateur['categorie']] = [
                'count' => 0,
                'valeurTotale' => 0
            ];
        }
        $groupe['parCategorie'][$indicateur['categorie']]['count']++;
        $groupe['parCategorie'][$indicateur['categorie']]['valeurTotale'] += $valeur;

        // Statistiques par nom d'indicateur
        if (!isset($groupe['parIndicateur'][$indicateur['nom']])) {
            $groupe['parIndicateur'][$indicateur['nom']] = [
                'count' => 0,
                'valeurTotale' => 0,
                'min' => PHP_FLOAT_MAX,
                'max' => PHP_FLOAT_MIN
            ];
        }
        $groupe['parIndicateur'][$indicateur['nom']]['count']++;
        $groupe['parIndicateur'][$indicateur['nom']]['valeurTotale'] += $valeur;
        $groupe['parIndicateur'][$indicateur['nom']]['min'] = min($groupe['parIndicateur'][$indicateur['nom']]['min'], $valeur);
        $groupe['parIndicateur'][$indicateur['nom']]['max'] = max($groupe['parIndicateur'][$indicateur['nom']]['max'], $valeur);
    }

    // Calculer les moyennes et transformer en tableau
    $statistiquesGlobales['valeurMoyenne'] = $statistiquesGlobales['count'] > 0
        ? $statistiquesGlobales['valeurTotale'] / $statistiquesGlobales['count']
        : 0;

    foreach ($statistiquesGlobales['parCategorie'] as &$stats) {
        $stats['valeurMoyenne'] = $stats['count'] > 0
            ? $stats['valeurTotale'] / $stats['count']
            : 0;
    }

    $donneesGroupees = [];
    foreach ($groupes as $nom => $groupe) {
        $groupe['valeurMoyenne'] = $groupe['count'] > 0
            ? $groupe['valeurTotale'] / $groupe['count']
            : 0;

        foreach ($groupe['parCategorie'] as &$cats) {
            $cats['valeurMoyenne'] = $cats['count'] > 0
                ? $cats['valeurTotale'] / $cats['count']
                : 0;
        }

        foreach ($groupe['parIndicateur'] as &$indStats) {
            $indStats['valeurMoyenne'] = $indStats['count'] > 0
                ? $indStats['valeurTotale'] / $indStats['count']
                : 0;
        }

        $donneesGroupees[] = $groupe;
    }

    // Trier par valeur totale décroissante
    usort($donneesGroupees, function($a, $b) {
        return $b['valeurTotale'] <=> $a['valeurTotale'];
    });

    return response()->json([
        'statistiquesGlobales' => $statistiquesGlobales,
        'donneesGroupees' => $donneesGroupees
    ]);
}
    /**
     * Générer un rapport d'analyse
     */
    public function genererRapport(Request $request)
    {
        // Valider les filtres
        $validated = $request->validate([
            'exercice_id' => 'required|exists:exercices,id',
            'periode_id' => 'nullable|exists:periodes,id',
            'categories' => 'required|array',
            'region' => 'nullable|string',
            'province' => 'nullable|string',
            'commune' => 'nullable|string',
            'secteur_activite' => 'nullable|string',
            'type_beneficiaire' => 'nullable|string',
            'genre' => 'nullable|string',
        ]);

        // Récupérer les données filtrées (réutilise la logique de la méthode précédente)
        $donneesResponse = $this->getDonneesIndicateurs($request);
        $donnees = json_decode($donneesResponse->getContent(), true)['donneesIndicateurs'];

        // Organiser les données par catégorie
        $donneesParCategorie = [];
        foreach ($donnees as $indicateur) {
            if (!isset($donneesParCategorie[$indicateur['categorie']])) {
                $donneesParCategorie[$indicateur['categorie']] = [];
            }

            $donneesParCategorie[$indicateur['categorie']][] = $indicateur;
        }

        // Récupérer l'exercice et la période pour le rapport
        $exercice = Exercice::find($validated['exercice_id']);
        $periode = isset($validated['periode_id']) ? Periode::find($validated['periode_id']) : null;

        // Calculer des statistiques supplémentaires pour le rapport
        $statistiques = [
            'total_entreprises' => Entreprise::count(),
            'entreprises_analysees' => count(array_unique(array_column($donnees, 'entreprise_id'))),
        ];

        // Statistiques par région
        $statistiquesRegions = [];
        foreach ($donnees as $indicateur) {
            $region = $indicateur['region'];

            if (!isset($statistiquesRegions[$region])) {
                $statistiquesRegions[$region] = [
                    'count' => 0,
                    'valeurs' => []
                ];
            }

            $statistiquesRegions[$region]['count']++;

            if (!isset($statistiquesRegions[$region]['valeurs'][$indicateur['categorie']])) {
                $statistiquesRegions[$region]['valeurs'][$indicateur['categorie']] = [];
            }

            if (!isset($statistiquesRegions[$region]['valeurs'][$indicateur['categorie']][$indicateur['nom']])) {
                $statistiquesRegions[$region]['valeurs'][$indicateur['categorie']][$indicateur['nom']] = [
                    'somme' => 0,
                    'count' => 0
                ];
            }

            $statistiquesRegions[$region]['valeurs'][$indicateur['categorie']][$indicateur['nom']]['somme'] += $indicateur['valeur'];
            $statistiquesRegions[$region]['valeurs'][$indicateur['categorie']][$indicateur['nom']]['count']++;
        }

        // Calculer les moyennes
        foreach ($statistiquesRegions as $region => $stats) {
            foreach ($stats['valeurs'] as $categorie => $indicateurs) {
                foreach ($indicateurs as $nomIndicateur => $valeurs) {
                    $statistiquesRegions[$region]['valeurs'][$categorie][$nomIndicateur]['moyenne'] =
                        $valeurs['count'] > 0 ? $valeurs['somme'] / $valeurs['count'] : 0;
                }
            }
        }

        return Inertia::render('Analyses/Synthese', [
            'donnees' => $donneesParCategorie,
            'exercice' => $exercice,
            'periode' => $periode,
            'statistiques' => $statistiques,
            'statistiquesRegions' => $statistiquesRegions,
            'filtres' => $validated
        ]);
    }
}

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
    // Dans AnalyseController.php, mettre à jour la méthode index

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
                    // Ajouter l'entrée aux données d'indicateurs même sans correspondance exacte dans la base
                    // Pour permettre d'afficher les données existantes

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

        return Inertia::render('Analyses/Rapport', [
            'donnees' => $donneesParCategorie,
            'exercice' => $exercice,
            'periode' => $periode,
            'statistiques' => $statistiques,
            'statistiquesRegions' => $statistiquesRegions,
            'filtres' => $validated
        ]);
    }

    /**
     * Exporter les données d'analyse au format Excel ou CSV
     */
    public function exporterDonnees(Request $request)
    {
        // Valider les filtres
        $validated = $request->validate([
            'exercice_id' => 'required|exists:exercices,id',
            'periode_id' => 'nullable|exists:periodes,id',
            'categories' => 'required|array',
            'format' => 'required|in:excel,csv', // Format d'export
            'region' => 'nullable|string',
            'province' => 'nullable|string',
            'commune' => 'nullable|string',
            'secteur_activite' => 'nullable|string',
            'type_beneficiaire' => 'nullable|string',
            'genre' => 'nullable|string',
        ]);

        // Récupérer les données filtrées
        $donneesResponse = $this->getDonneesIndicateurs($request);
        $donnees = json_decode($donneesResponse->getContent(), true)['donneesIndicateurs'];

        // Préparation des données pour l'export
        $dataForExport = [];

        // En-têtes du fichier
        $headers = [
            'Catégorie',
            'Indicateur',
            'Valeur',
            'Tendance',
            'Entreprise',
            'Région',
            'Province',
            'Commune',
            'Secteur d\'activité',
            'Type de bénéficiaire',
            'Genre'
        ];

        $dataForExport[] = $headers;

        // Données
        foreach ($donnees as $indicateur) {
            $dataForExport[] = [
                $indicateur['categorie'],
                $indicateur['nom'],
                $indicateur['valeur'],
                $indicateur['tendance'],
                $indicateur['entreprise_nom'],
                $indicateur['region'],
                $indicateur['province'],
                $indicateur['commune'],
                $indicateur['secteur_activite'],
                $indicateur['typeBeneficiaire'],
                $indicateur['genre']
            ];
        }

        // Générer le nom du fichier
        $exercice = Exercice::find($validated['exercice_id']);
        $periode = isset($validated['periode_id']) ? Periode::find($validated['periode_id']) : null;

        $fileName = 'analyse_indicateurs_' . $exercice->annee;
        if ($periode) {
            $fileName .= '_' . $periode->nom;
        }
        $fileName .= '_' . date('Y-m-d');

        // Export au format demandé
        if ($validated['format'] === 'excel') {
            return Excel::download(
                new \App\Exports\IndicateursExport($dataForExport),
                $fileName . '.xlsx'
            );
        } else {
            return Excel::download(
                new \App\Exports\IndicateursExport($dataForExport),
                $fileName . '.csv',
                \Maatwebsite\Excel\Excel::CSV
            );
        }
    }

    /**
     * Méthode de débogage pour vérifier les données des collectes
     */
    public function debug()
    {
        $collectes = Collecte::with(['entreprise', 'entreprise.beneficiaire'])->limit(5)->get();

        $debug = [];
        foreach ($collectes as $collecte) {
            $debug[] = [
                'id' => $collecte->id,
                'entreprise' => $collecte->entreprise->nom_entreprise,
                'categories' => array_keys($collecte->donnees),
                'donnees' => $collecte->donnees
            ];
        }

        return response()->json($debug);
    }
}

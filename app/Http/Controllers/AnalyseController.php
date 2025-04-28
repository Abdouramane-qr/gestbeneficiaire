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
        $descriptionsActivite = DB::table('entreprises')->select('nom_entreprise')->distinct()->pluck('nom_entreprise');
        $niveauxDeveloppement = DB::table('entreprises')->select('secteur_activite')->distinct()->pluck('secteur_activite');

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
     * Récupérer les données pour le tableau de bord
     */
    public function donnees(Request $request)
    {
        // Récupérer les paramètres de filtrage
        $exerciceId = $request->input('exercice_id');
        $periodeId = $request->input('periode_id');
        $region = $request->input('region');
        $province = $request->input('province');
        $commune = $request->input('commune');
        $secteurActivite = $request->input('secteur_activite');
        $genre = $request->input('genre');
        $periodicite = $request->input('periodicite');
        $categorie = $request->input('categorie');

        // Requête pour obtenir les données filtrées
        $query = DB::table('collectes')
            ->join('entreprises', 'collectes.entreprise_id', '=', 'entreprises.id')
            ->join('beneficiaires', 'entreprises.beneficiaires_id', '=', 'beneficiaires.id')
            ->where('collectes.exercice_id', $exerciceId);

        // Ajouter les filtres conditionnels
        if ($periodeId) {
            $query->where('collectes.periode_id', $periodeId);
        }

        if ($region) {
            $query->where('beneficiaires.regions', $region);
        }

        if ($province) {
            $query->where('beneficiaires.provinces', $province);
        }

        if ($commune) {
            $query->where('beneficiaires.communes', $commune);
        }

        if ($secteurActivite) {
            $query->where('entreprises.secteur_activite', $secteurActivite);
        }

        if ($genre) {
            $query->where('beneficiaires.genre', $genre);
        }

        // Récupérer les données agrégées
        $collectes = $query->select(
            'collectes.id',
            'collectes.donnees',
            'collectes.exercice_id',
            'collectes.periode_id',
            'collectes.date_collecte as date',
            'entreprises.id as entreprise_id',
            'entreprises.nom_entreprise as entreprise_nom',
            'entreprises.secteur_activite',
            'beneficiaires.regions as region',
            'beneficiaires.provinces as province',
            'beneficiaires.communes as commune',
            'beneficiaires.genre'
        )->get();

        // Traiter les données JSON pour extraire les indicateurs
        $donneesIndicateurs = [];
        foreach ($collectes as $collecte) {
            // Récupérer le modèle Collecte pour pouvoir utiliser getDonneesAsArray()
            $collecteModel = Collecte::find($collecte->id);
            if (!$collecteModel) continue;

            // Assurons-nous que les données sont correctement décodées
            $indicateursData = $collecteModel->getDonneesAsArray();

            if (empty($indicateursData)) {
                Log::warning("Données de collecte vides ou invalides (ID: {$collecte->id})");
                continue; // Ignorer les données JSON invalides
            }

            // Pour chaque indicateur dans les données JSON
            foreach ($indicateursData as $key => $value) {
                // Déterminer la catégorie et le nom de l'indicateur
                list($categorieIndicateur, $nomIndicateur) = $this->determinerCategorieEtNom($key);

                // Appliquer le filtre par catégorie et périodicité si nécessaire
                if (($categorie && $categorieIndicateur !== $categorie) ||
                    ($periodicite && !$this->estDeLaPeriodicite($key, $periodicite))) {
                    continue;
                }

                // Calculer la tendance en comparant avec les données précédentes
                $tendance = $this->calculerTendance($key, $value, $exerciceId, $periodeId, $collecte->entreprise_id);

                $donneesIndicateurs[] = [
                    'id' => $collecte->id,
                    'indicateur_id' => $key,
                    'nom' => $nomIndicateur,
                    'valeur' => $value,
                    'categorie' => $categorieIndicateur,
                    'entreprise_id' => $collecte->entreprise_id,
                    'entreprise_nom' => $collecte->entreprise_nom,
                    'exercice_id' => $collecte->exercice_id,
                    'periode_id' => $collecte->periode_id,
                    'region' => $collecte->region,
                    'province' => $collecte->province,
                    'commune' => $collecte->commune,
                    'genre' => $collecte->genre,
                    'secteur_activite' => $collecte->secteur_activite,
                    'date' => $collecte->date,
                    'tendance' => $tendance
                ];
            }
        }

        return response()->json([
            'donnees' => $donneesIndicateurs
        ]);
    }

    /**
     * Déterminer la catégorie et le nom d'un indicateur à partir de sa clé
     *
     * @param string $key Clé de l'indicateur
     * @return array Tableau contenant [catégorie, nom]
     */
    private function determinerCategorieEtNom($key)
    {
        // Récupérer l'indicateur depuis la base de données si possible
        $indicateur = Indicateur::where('nom', $key)->first();

        if ($indicateur) {
            return [$indicateur->categorie, $indicateur->libelle];
        }

        // Si l'indicateur n'est pas en base, déterminer à partir de la clé
        $categories = [
            'ca_' => "Indicateurs commerciaux de l'entreprise du promoteur",
            'fi_' => "Indicateurs financiers",
            'pr_' => "Indicateurs de production",
            'rh_' => "Indicateurs Sociaux et ressources humaines de l'entreprise du promoteur",
            'tr_' => "Indicateurs de trésorerie de l'entreprise du promoteur",
            'rt_' => "Ratios de Rentabilité et de solvabilité de l'entreprise",
            'pj_' => "Indicateurs de performance Projet"
        ];

        $categorieIndicateur = "Autre";
        foreach ($categories as $prefix => $cat) {
            if (strpos($key, $prefix) === 0) {
                $categorieIndicateur = $cat;
                break;
            }
        }

        // Convertir le code en nom lisible
        $nomIndicateur = ucfirst(str_replace('_', ' ', $key));

        return [$categorieIndicateur, $nomIndicateur];
    }

    /**
     * Vérifier si un indicateur appartient à une périodicité spécifique
     *
     * @param string $key Clé de l'indicateur
     * @param string $periodicite Périodicité à vérifier
     * @return bool
     */
    private function estDeLaPeriodicite($key, $periodicite)
    {
        // Mapping entre indicateurs et périodicités (à adapter selon votre logique)
        $mappingPeriodicite = [
            'Mensuelle' => ['creation_entreprise', 'nbr_employe'],
            'Trimestrielle' => ['propects_grossites', 'prospects_detaillant', 'clients_grossistes'],
            'Semestrielle' => ['nbr_cycle_production', 'nbr_clients', 'chiffre_affaire'],
            'Annuelle' => ['r_n_exploitation_aimp', 'autosuffisance', 'marge_beneficiaire'],
            'Occasionnelle' => ['nbr_formation_entrepreneuriat_h', 'nbr_formation_entrepreneuriat_f']
        ];

        // Vérifier si l'indicateur est dans la périodicité demandée
        if (isset($mappingPeriodicite[$periodicite])) {
            return in_array($key, $mappingPeriodicite[$periodicite]);
        }

        return false;
    }

    /**
     * Calcule la tendance d'un indicateur en comparant la valeur actuelle à celle de la période précédente.
     *
     * @param string $indicateur Clé de l'indicateur à comparer
     * @param float|int $valeurActuelle Valeur actuelle de l'indicateur
     * @param int $exerciceId ID de l'exercice actuel
     * @param int|null $periodeId ID de la période actuelle (peut être null)
     * @param int $entrepriseId ID de l'entreprise concernée
     * @return string 'hausse', 'baisse' ou 'stable'
     */
    private function calculerTendance(string $indicateur, $valeurActuelle, int $exerciceId, ?int $periodeId, int $entrepriseId): string
    {
        // Récupérer la période précédente
        $periodePrecedente = null;

        if ($periodeId) {
            $periodeActuelle = Periode::find($periodeId);

            if ($periodeActuelle) {
                $periodePrecedente = Periode::where('exercice_id', $exerciceId)
                    ->where('ordre', '<', $periodeActuelle->ordre)
                    ->orderBy('ordre', 'desc')
                    ->first();
            }
        }

        // Si pas de période précédente dans le même exercice, chercher dans l'exercice précédent
        if (!$periodePrecedente) {
            $exerciceActuel = Exercice::find($exerciceId);

            if ($exerciceActuel) {
                $exercicePrecedent = Exercice::where('annee', '<', $exerciceActuel->annee)
                    ->orderBy('annee', 'desc')
                    ->first();

                if ($exercicePrecedent) {
                    $periodePrecedente = Periode::where('exercice_id', $exercicePrecedent->id)
                        ->orderBy('ordre', 'desc')
                        ->first();
                }
            }
        }

        // Si pas de période précédente trouvée, retourner 'stable' par défaut
        if (!$periodePrecedente) {
            return 'stable';
        }

        // Chercher la collecte de la période précédente
        $collectePrecedente = Collecte::where('entreprise_id', $entrepriseId)
            ->where('periode_id', $periodePrecedente->id)
            ->first();

        if (!$collectePrecedente) {
            return 'stable';
        }

        // Récupérer les données précédentes en s'assurant qu'elles sont un tableau
        $donneesPrecedentes = $collectePrecedente->getDonneesAsArray();

        if (!isset($donneesPrecedentes[$indicateur])) {
            return 'stable';
        }

        $valeurPrecedente = floatval($donneesPrecedentes[$indicateur]);
        $valeurActuelle = floatval($valeurActuelle);

        // Calcul de la tendance
        $difference = $valeurActuelle - $valeurPrecedente;
        $tolerance = 0.001;

        if (abs($difference) < $tolerance) {
            return 'stable';
        } elseif ($difference > 0) {
            return 'hausse';
        } else {
            return 'baisse';
        }
    }

    /**
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

            // Décoder les données JSON si nécessaire
            $donnees = $collecte->donnees;
            if (is_string($donnees)) {
                $donnees = json_decode($donnees, true);

                // Si le décodage échoue, passer à la collecte suivante
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Erreur de décodage JSON pour la collecte #'.$collecte->id);
                    continue;
                }
            }

            // Vérifier que $donnees est bien un tableau avant de boucler
            if (!is_array($donnees)) {
                Log::warning('Données invalides pour la collecte #'.$collecte->id);
                continue;
            }

            foreach ($donnees as $categorie => $indicateursData) {
                // Vérifier que $indicateursData est bien un tableau
                if (!is_array($indicateursData)) {
                    Log::warning('Format d\'indicateurs invalide pour la catégorie '.$categorie.' dans la collecte #'.$collecte->id);
                    continue;
                }

                // Normaliser le nom de la catégorie
                $categorieNormalisee = $categorie;
                if ($categorie === 'tresorerie') {
                    $categorieNormalisee = 'tresorerie';
                }

                foreach ($indicateursData as $nomIndicateur => $valeur) {
                    // Convertir explicitement la valeur en nombre
                    $valeurNumerique = is_numeric($valeur) ? floatval($valeur) : 0;

                    // Calculer la tendance (stable par défaut)
                    $tendance = 'stable';
                    if (is_numeric($valeur)) {
                        $periodesIds = Periode::where('exercice_id', $collecte->exercice_id)
                            ->orderBy('id', 'asc')
                            ->pluck('id')
                            ->toArray();

                        $indexPeriode = array_search($collecte->periode_id, $periodesIds);

                        if ($indexPeriode > 0) {
                            $periodePrecedente = $periodesIds[$indexPeriode - 1];

                            $collectePrecedente = Collecte::where('entreprise_id', $collecte->entreprise_id)
                                ->where('exercice_id', $collecte->exercice_id)
                                ->where('periode_id', $periodePrecedente)
                                ->first();

                            if ($collectePrecedente) {
                                $donneesPrecedentes = $collectePrecedente->donnees;
                                if (is_string($donneesPrecedentes)) {
                                    $donneesPrecedentes = json_decode($donneesPrecedentes, true);
                                }

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

            // Vérifier que l'entreprise et le bénéficiaire existent
            if (!$entreprise || !$entreprise->beneficiaire) {
                Log::warning("Entreprise ou bénéficiaire manquant pour collecte ID: {$collecte->id}");
                continue;
            }

            $beneficiaire = $entreprise->beneficiaire;

            Log::debug('Analyse collecte #' . $collecte->id . ' pour entreprise ' . $entreprise->nom_entreprise);

            // Vérifier les filtres géographiques et démographiques
            if (
                (isset($validated['region']) && $validated['region'] !== 'all' && $beneficiaire->regions !== $validated['region']) ||
                (isset($validated['province']) && $validated['province'] !== 'all' && $beneficiaire->provinces !== $validated['province']) ||
                (isset($validated['commune']) && $validated['commune'] !== 'all' && $beneficiaire->communes !== $validated['commune']) ||
                (isset($validated['type_beneficiaire']) && $validated['type_beneficiaire'] !== 'all' && $beneficiaire->type_beneficiaire !== $validated['type_beneficiaire']) ||
                (isset($validated['genre']) && $validated['genre'] !== 'all' && $beneficiaire->genre !== $validated['genre']) ||
                (isset($validated['secteur_activite']) && $validated['secteur_activite'] !== 'all' && $entreprise->secteur_activite !== $validated['secteur_activite'])
            ) {
                Log::debug('Collecte exclue par les filtres géographiques/démographiques');
                continue; // Ignorer cette collecte si elle ne correspond pas aux filtres
            }

            // Utiliser la méthode getDonneesAsArray pour s'assurer que les données sont un tableau
            $donnees = $collecte->getDonneesAsArray();

            if (empty($donnees)) {
                Log::debug('Données vides ou invalides pour la collecte #' . $collecte->id);
                continue;
            }

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
                // Vérifier que indicateursData est bien un tableau
                if (!is_array($indicateursData)) {
                    Log::warning("Données d'indicateurs invalides pour catégorie {$categorie} (collecte ID: {$collecte->id})");
                    continue;
                }

                foreach ($indicateursData as $nomIndicateur => $valeurs) {
                    // Convertir explicitement la valeur en nombre
                    $valeurNumerique = is_numeric($valeurs) ? floatval($valeurs) : 0;

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
                                $donneesPrecedentes = $collectePrecedente->getDonneesAsArray();
                                $categoriePrec = isset($categoriesMapping[$categorie]) ? array_search($categorie, $categoriesMapping) : $categorie;

                                if (isset($donneesPrecedentes[$categoriePrec][$nomIndicateur])) {
                                    $valeurPrecedente = $donneesPrecedentes[$categoriePrec][$nomIndicateur];
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
                                            ->where('categorie', $categorie)
                                            ->value('id') ?? 0;

                    $donneesIndicateurs[] = [
                        'id' => count($donneesIndicateurs) + 1,
                        'indicateur_id' => $indicateurId,
                        'nom' => $nomIndicateur,
                        'valeur' => $valeurNumerique,
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

        // Créer une nouvelle requête pour éviter la récursion infinie
        $request2 = new Request($validated);
        // Construire la requête
        $query = Collecte::query()
            ->where('exercice_id', $validated['exercice_id']);

        // Filtrer par période
        if (isset($validated['periode_id'])) {
            $query->where('periode_id', $validated['periode_id']);
        }

        // Récupérer les collectes
        $collectes = $query->with(['entreprise', 'entreprise.beneficiaire'])->get();

        // Transformer les données en indicateurs
        $indicateurs = $this->transformerCollectesEnIndicateurs($collectes, $validated);

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
     * Méthode auxiliaire pour transformer les collectes en indicateurs
     * Évite la récursion infinie dans getSyntheseDonnees
     */
    private function transformerCollectesEnIndicateurs($collectes, $filters)
    {
        $categoriesMapping = [
            'commercial' => 'commercial',
            'tresorerie' => 'tresorerie'
        ];

        $donneesIndicateurs = [];

        foreach ($collectes as $collecte) {
            $entreprise = $collecte->entreprise;

            if (!$entreprise || !$entreprise->beneficiaire) {
                continue;
            }

            $beneficiaire = $entreprise->beneficiaire;

            // Vérifier les filtres géographiques et démographiques
            if (
                (isset($filters['region']) && $filters['region'] !== 'all' && $beneficiaire->regions !== $filters['region']) ||
                (isset($filters['province']) && $filters['province'] !== 'all' && $beneficiaire->provinces !== $filters['province']) ||
                (isset($filters['commune']) && $filters['commune'] !== 'all' && $beneficiaire->communes !== $filters['commune']) ||
                (isset($filters['type_beneficiaire']) && $filters['type_beneficiaire'] !== 'all' && $beneficiaire->type_beneficiaire !== $filters['type_beneficiaire']) ||
                (isset($filters['genre']) && $filters['genre'] !== 'all' && $beneficiaire->genre !== $filters['genre']) ||
                (isset($filters['secteur_activite']) && $filters['secteur_activite'] !== 'all' && $entreprise->secteur_activite !== $filters['secteur_activite'])
            ) {
                continue;
            }

            $donnees = $collecte->getDonneesAsArray();

            if (empty($donnees)) {
                continue;
            }

            // Filtrer par catégorie si nécessaire
            if (isset($filters['categorie']) && $filters['categorie'] !== 'all') {
                if (isset($donnees[$filters['categorie']])) {
                    $donneesFiltrees = [$filters['categorie'] => $donnees[$filters['categorie']]];
                } else {
                    $categorieOriginal = array_search($filters['categorie'], $categoriesMapping);
                    if ($categorieOriginal && isset($donnees[$categorieOriginal])) {
                        $donneesFiltrees = [$filters['categorie'] => $donnees[$categorieOriginal]];
                    } else {
                        $donneesFiltrees = [];
                    }
                }
            } else {
                $donneesFiltrees = [];
                foreach ($donnees as $categorieOriginal => $valeurs) {
                    $categorieNormalisee = $categoriesMapping[$categorieOriginal] ?? $categorieOriginal;
                    $donneesFiltrees[$categorieNormalisee] = $valeurs;
                }
            }

            foreach ($donneesFiltrees as $categorie => $indicateursData) {
                if (!is_array($indicateursData)) {
                    continue;
                }

                foreach ($indicateursData as $nomIndicateur => $valeurs) {
                    $valeurNumerique = is_numeric($valeurs) ? floatval($valeurs) : 0;

                    // Calculer la tendance
                    $tendance = $this->calculerTendance(
                        $nomIndicateur,
                        $valeurNumerique,
                        $collecte->exercice_id,
                        $collecte->periode_id,
                        $collecte->entreprise_id
                    );

                    $indicateurId = Indicateur::where('nom', $nomIndicateur)
                                            ->where('categorie', $categorie)
                                            ->value('id') ?? 0;

                    $donneesIndicateurs[] = [
                        'id' => count($donneesIndicateurs) + 1,
                        'indicateur_id' => $indicateurId,
                        'nom' => $nomIndicateur,
                        'valeur' => $valeurNumerique,
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

        return $donneesIndicateurs;
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

        // Construire la requête pour récupérer les collectes
        $query = Collecte::query()
            ->where('exercice_id', $validated['exercice_id']);

        // Filtrer par période
        if (isset($validated['periode_id'])) {
            $query->where('periode_id', $validated['periode_id']);
        }

        // Récupérer les collectes
        $collectes = $query->with(['entreprise', 'entreprise.beneficiaire'])->get();

        // Transformer les données en indicateurs
        $donnees = $this->transformerCollectesEnIndicateurs($collectes, $validated);

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

<?php

namespace App\Http\Controllers;

use App\Strategies\{
    PeriodeStrategyInterface,
    MoisPrecedentStrategy,
    TrimestrePrecedentStrategy,
    SemestrePrecedentStrategy,
    ExercicePrecedentStrategy,
    DefaultPeriodeStrategy
};
use App\Exports\SimpleIndicateursExport;
use App\Exports\MultiSheetIndicateursExport;
use App\Services\IndicateursAnalyseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Exercice;
use App\Models\Entreprise;
use App\Models\Collecte;
use App\Models\Beneficiaire;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\JsonResponse;

/**
 * IndicateursAnalyseController
 *
 * Ce contrôleur gère l'affichage et le traitement des indicateurs d'analyse.
 */
class IndicateursAnalyseController extends Controller
{
    protected $indicateursService;

    public function __construct(IndicateursAnalyseService $indicateursService)
    {
        $this->indicateursService = $indicateursService;
    }

    /**
     * Affiche la page du tableau de bord d'analyse avec les nouveaux filtres
     */
    public function index(Request $request)
    {
        $exercices = Exercice::orderBy('annee', 'desc')->get();
        $entreprises = Entreprise::select('id', 'nom_entreprise', 'secteur_activite', 'ville', /* 'commune', */ 'beneficiaires_id')
            ->orderBy('nom_entreprise')
            ->get();

        $beneficiaires = Beneficiaire::select('id', 'nom', 'prenom', 'type_beneficiaire')
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        // Par défaut, on utilise le dernier exercice actif
        $exerciceActif = Exercice::where('actif', true)->orderBy('annee', 'desc')->first();
        $exerciceId = $request->input('exercice_id', $exerciceActif ? $exerciceActif->id : null);

        // Période par défaut
        $periodeType = $request->input('periode_type', 'Trimestrielle');

        // Périodes standardisées
        $periodes = ['Trimestrielle', 'Semestrielle', 'Annuelle', 'Occasionnelle'];

        return Inertia::render('Indicateurs/Analyse', [
            'exercices' => $exercices,
            'entreprises' => $entreprises,
            'beneficiaires' => $beneficiaires,
            'defaultExerciceId' => $exerciceId,
            'defaultPeriodeType' => $periodeType,
            'periodes' => $periodes,
        ]);
    }


    public function getAnalyseData(Request $request): JsonResponse
    {
        try {
            // Validation des paramètres avec messages personnalisés
            $validated = $request->validate([
                'periode_type' => 'required|string|in:Trimestrielle,Semestrielle,Annuelle,Occasionnelle',
                'exercice_id' => 'nullable|integer|exists:exercices,id',
                'entreprise_id' => 'nullable|integer|exists:entreprises,id',
                'beneficiaire_id' => 'nullable|integer|exists:beneficiaires,id',
                'region' => 'nullable|string|max:255',
                'commune' => 'nullable|string|max:255',
                'secteur' => 'nullable|string|max:255',
                'beneficiaire_type' => 'nullable|string|max:255',
            ], [
                'periode_type.required' => 'Le type de période est requis.',
                'periode_type.in' => 'Le type de période doit être l\'un des suivants : Trimestrielle, Semestrielle, Annuelle, Occasionnelle.',
                'exercice_id.exists' => 'L\'exercice sélectionné n\'existe pas.',
                'entreprise_id.exists' => 'L\'entreprise sélectionnée n\'existe pas.',
                'beneficiaire_id.exists' => 'Le bénéficiaire sélectionné n\'existe pas.',
            ]);

            // Construire la requête avec les nouveaux filtres
            $query = $this->buildQueryWithFilters($request);

            // Exécuter la requête
            $collectes = $query->orderBy('date_collecte', 'asc')->get();

            Log::info('Collectes récupérées', [
                'nombre' => $collectes->count(),
                'filtres' => $validated
            ]);

            if ($collectes->count() === 0) {
                return $this->createEmptyResponse($validated);
            }

            // Traiter les données selon le type de période
            $donneesAvecCalculs = $validated['periode_type'] === 'Occasionnelle'
                ? $this->processerCollectesOccasionnelles($collectes)
                : $this->processerCollectesStandard($collectes, $validated['periode_type']);

            // Si aucune donnée valide n'a été trouvée
            if (empty($donneesAvecCalculs)) {
                return $this->createEmptyResponse($validated, 'Aucune donnée disponible pour les critères sélectionnés');
            }

            // Retourner la réponse avec les données
            return response()->json([
                'success' => true,
                'data' => $donneesAvecCalculs,
                'raw_data' => [],
                'periode_type' => $validated['periode_type'],
                'filtres_appliques' => array_filter($validated),
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur dans getAnalyseData', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des données',
                'error' => config('app.debug') ? $e->getMessage() : 'Erreur serveur interne',
            ], 500);
        }
    }

    /**
     * Crée une réponse vide standardisée
     */
    private function createEmptyResponse(array $validated, ?string $message = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [],
            'raw_data' => [],
            'periode_type' => $validated['periode_type'],
            'filtres_appliques' => array_filter($validated),
            'no_data' => true,
            'message' => $message,
            'timestamp' => now()->toIso8601String(),
        ]);
    }


    /**
     * Construire la requête avec tous les filtres
     */
    protected function buildQueryWithFilters(Request $request): \Illuminate\Database\Eloquent\Builder
    {
        $query = Collecte::with(['entreprise.beneficiaire', 'exercice']);

        // Type de période avec normalisation
        if ($periodeType = $request->input('periode_type')) {
            $this->applyPeriodeFilter($query, $periodeType);
        }

        // Filtres additionnels
        $this->applyFilters($query, $request);

        return $query;
    }

    /**
     * Applique le filtre de période
     */
    private function applyPeriodeFilter(\Illuminate\Database\Eloquent\Builder $query, string $periodeType): void
    {
        $variationsPeriode = $this->getVariationsPeriode($periodeType);

        $query->where(function ($q) use ($variationsPeriode) {
            foreach ($variationsPeriode as $index => $variation) {
                if ($index === 0) {
                    $q->where('periode', 'like', '%' . $variation . '%');
                } else {
                    $q->orWhere('periode', 'like', '%' . $variation . '%');
                }
            }
        });
    }

    /**
     * Applique les autres filtres
     */
    private function applyFilters(\Illuminate\Database\Eloquent\Builder $query, Request $request): void
    {
        // Exercice
        if ($exerciceId = $request->input('exercice_id')) {
            $query->where('exercice_id', $exerciceId);
        }

        // Entreprise ou Bénéficiaire selon la période
        $periodeType = $request->input('periode_type');
        if ($periodeType === 'Occasionnelle') {
            if ($beneficiaireId = $request->input('beneficiaire_id')) {
                $query->whereHas('entreprise', function ($q) use ($beneficiaireId) {
                    $q->where('beneficiaires_id', $beneficiaireId);
                });
            }
        } else {
            if ($entrepriseId = $request->input('entreprise_id')) {
                $query->where('entreprise_id', $entrepriseId);
            }
        }

        // Filtres entreprise
        if ($region = $request->input('region')) {
            $query->whereHas('entreprise', function ($q) use ($region) {
                $q->where('ville', $region);
            });
        }

        if ($commune = $request->input('commune')) {
            $query->whereHas('beneficiaire', function ($q) use ($commune) {
                $q->where('commune', $commune);
            });
        }

        if ($secteur = $request->input('secteur')) {
            $query->whereHas('entreprise', function ($q) use ($secteur) {
                $q->where('secteur_activite', $secteur);
            });
        }

        // Filtre type de bénéficiaire
        if ($beneficiaireType = $request->input('beneficiaire_type')) {
            $query->whereHas('entreprise.beneficiaire', function ($q) use ($beneficiaireType) {
                $q->where('type_beneficiaire', $beneficiaireType);
            });
        }
    }


    /**
     * Traiter les collectes standard avec extraction des définitions
     */
    protected function processerCollectesStandard($collectes, string $periodeType): array
    {
        $donneesAvecCalculs = [];
        $definitions = $this->getIndicateursDefinitions();

        foreach ($collectes as $collecte) {
            try {
                $donnees = $this->normaliseDonnees($collecte->donnees);

                if (empty($donnees)) {
                    continue;
                }

                // Utiliser un helper pour traiter chaque catégorie
                $this->traiterCategoriesCollecte($donnees, $collecte, $definitions, $donneesAvecCalculs);

                // Appliquer les calculs si nécessaire
                $this->appliquerCalculsStandard($donneesAvecCalculs, $periodeType);
            } catch (\Exception $e) {
                Log::error('Erreur lors du traitement de la collecte', [
                    'collecte_id' => $collecte->id,
                    'message' => $e->getMessage()
                ]);
                continue;
            }
        }

        // Après avoir traité toutes les collectes, ajouter les indicateurs calculés globaux
        return $this->ajouterIndicateursCalculesGlobaux($donneesAvecCalculs, $periodeType);
    }

    /**
     * Helper pour traiter les catégories d'une collecte
     */
    private function traiterCategoriesCollecte(
        array $donnees,
        $collecte,
        array $definitions,
        array &$donneesAvecCalculs
    ): void {
        foreach ($donnees as $categorie => $indicateurs) {
            if (!is_array($indicateurs)) continue;

            if (!isset($donneesAvecCalculs[$categorie])) {
                $donneesAvecCalculs[$categorie] = [];
            }

            foreach ($indicateurs as $id => $valeur) {
                if (!is_numeric($valeur)) continue;

                $this->traiterIndicateur(
                    $id,
                    $valeur,
                    $collecte,
                    $definitions,
                    $categorie,
                    $donneesAvecCalculs
                );
            }
        }
    }

    /**
     * Helper pour traiter un indicateur individuel
     */
    private function traiterIndicateur(
        string $id,
        $valeur,
        $collecte,
        array $definitions,
        string $categorie,
        array &$donneesAvecCalculs
    ): void {
        // Obtenir les métadonnées
        $metadata = $definitions[$categorie][$id] ?? null;

        $indicateur = [
            'id' => $id,
            'label' => $metadata['label'] ?? $this->formatIndicateurLibelle($id),
            'value' => (float)$valeur,
            'target' => $metadata['target'] ?? 0,
            'unite' => $metadata['unite'] ?? '',
            'definition' => $metadata['definition'] ?? '',
            'is_calculated' => $metadata['is_calculated'] ?? false,
            'metadata' => [
                'entreprise_ids' => [$collecte->entreprise_id],
                'collecte_ids' => [$collecte->id],
                'nombre_points_donnees' => 1
            ]
        ];

        // Vérifier si l'indicateur existe déjà et le mettre à jour ou l'ajouter
        $this->mergeOrAddIndicateur($donneesAvecCalculs[$categorie], $indicateur, $collecte);
    }

    /**
     * Fusionne ou ajoute un indicateur à la collection
     */
    private function mergeOrAddIndicateur(array &$category, array $indicateur, $collecte): void
    {
        $existingIndex = array_search($indicateur['id'], array_column($category, 'id'));

        if ($existingIndex !== false) {
            // Mise à jour de l'indicateur existant
            $category[$existingIndex]['value'] += $indicateur['value'];
            $category[$existingIndex]['metadata']['entreprise_ids'][] = $collecte->entreprise_id;
            $category[$existingIndex]['metadata']['collecte_ids'][] = $collecte->id;
            $category[$existingIndex]['metadata']['nombre_points_donnees']++;
        } else {
            // Nouveau indicateur
            $category[] = $indicateur;
        }
    }

    // // Ajoutez aussi cette méthode pour vérifier la requête des collectes
    protected function getCollectesOccasionnelles()
    {
        $query = Collecte::with('entreprise')
            ->where('type_collecte', 'Exceptionnelle')
            ->whereIn('periode', ['Exceptionnelle', 'Ponctuelle']);

        // Log de debug pour vérifier la requête
        Log::info('Collectes exceptionnelles query', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
            'count' => $query->count()
        ]);

        return $query->get();
    }
    /**
     * Traiter les collectes occasionnelles avec tous les indicateurs calculés
     */
    protected function processerCollectesOccasionnelles($collectes)
{
    // Log de débogage au début
    Log::info('Processing collectes exceptionnelles', [
        'collectes_count' => $collectes->count(),
        'collectes_ids' => $collectes->pluck('id')->toArray()
    ]);

    // Vérification des relations pour chaque collecte
    foreach ($collectes as $collecte) {
        Log::info('Vérification des relations pour collecte', [
            'collecte_id' => $collecte->id,
            'entreprise_id' => $collecte->entreprise_id ?? null,
            'has_entreprise' => isset($collecte->entreprise),
            'has_beneficiaire' => isset($collecte->entreprise) && isset($collecte->entreprise->beneficiaire),
            'beneficiaire_id' => $collecte->entreprise->beneficiaire->id ?? 'N/A',
            'beneficiaire_sexe' => $collecte->entreprise->beneficiaire->sexe ?? 'N/A',
        ]);
    }

    $donneesAvecCalculs = [];

    // Initialiser les catégories pour les données occasionnelles
    $statistiquesFormation = [
        'hommes_formation_entrepreneuriat' => 0,
        'femmes_formation_entrepreneuriat' => 0,
        'hommes_formation_technique' => 0,
        'femmes_formation_technique' => 0,
    ];

    $statistiquesBancarisation = [
        'hommes_bancarises_debut' => 0,
        'femmes_bancarises_debut' => 0,
        'hommes_bancarises_fin' => 0,
        'femmes_bancarises_fin' => 0,
    ];

    $statistiquesAppreciation = [
        'organisation_interne_debut' => [],
        'services_adherents_debut' => [],
        'relations_externes_debut' => [],
        'organisation_interne_fin' => [],
        'services_adherents_fin' => [],
        'relations_externes_fin' => [],
    ];

    $statistiquesInsertionProfessionnelle = [
        'total_jeunes_selectionnes' => 0,
        'jeunes_insertions_realisees' => 0,
    ];

    // Ajouter un compteur pour vérifier si des données ont été trouvées
    $hasData = false;

    foreach ($collectes as $collecte) {
        try {
            $donnees = $this->normaliseDonnees($collecte->donnees);

            // Debug: vérifier la structure des données
            Log::info('Collecte data structure', [
                'collecte_id' => $collecte->id,
                'entreprise_id' => $collecte->entreprise_id ?? null,
                'has_formulaire_exceptionnel' => isset($donnees['formulaire_exceptionnel']),
                'has_formation' => isset($donnees['formation']),
                'has_bancarisation' => isset($donnees['bancarisation']),
                'donnees_keys' => array_keys($donnees)
            ]);

            // Si c'est un formulaire exceptionnel
            if (isset($donnees['formulaire_exceptionnel'])) {
                $form = $donnees['formulaire_exceptionnel'];

                // Debug: vérifier le contenu du formulaire
                Log::info('Formulaire exceptionnel content', [
                    'collecte_id' => $collecte->id,
                    'form_keys' => array_keys($form),
                    'form_values' => $form, // Afficher toutes les valeurs pour diagnostic
                    'has_formation_entrepreneuriat' => isset($form['formation_entrepreneuriat_recu']),
                    'has_formation_technique' => isset($form['formation_technique_recu']),
                    'has_bancarisation_debut' => isset($form['est_bancarise_demarrage']),
                    'has_bancarisation_fin' => isset($form['est_bancarise_fin'])
                ]);

                $hasData = true;

                // Traiter les données de formation entrepreneuriat
                if (isset($form['formation_entrepreneuriat_recu'])) {
                    $formationValue = filter_var($form['formation_entrepreneuriat_recu'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                    Log::info('Valeur formation entrepreneuriat', [
                        'collecte_id' => $collecte->id,
                        'valeur_brute' => $form['formation_entrepreneuriat_recu'],
                        'valeur_filtree' => $formationValue
                    ]);

                    if ($formationValue === true) {
                        if ($collecte->entreprise && $collecte->entreprise->beneficiaire) {
                            $genre = $collecte->entreprise->beneficiaire->sexe ?? '';

                            Log::info('Genre détecté pour formation entrepreneuriat', [
                                'collecte_id' => $collecte->id,
                                'genre' => $genre,
                                'beneficiaire_id' => $collecte->entreprise->beneficiaire->id ?? null
                            ]);

                            if ($genre === 'Homme') {
                                $statistiquesFormation['hommes_formation_entrepreneuriat']++;
                                Log::info('Incrémentation hommes_formation_entrepreneuriat', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesFormation['hommes_formation_entrepreneuriat']
                                ]);
                            } elseif ($genre === 'Femme') {
                                $statistiquesFormation['femmes_formation_entrepreneuriat']++;
                                Log::info('Incrémentation femmes_formation_entrepreneuriat', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesFormation['femmes_formation_entrepreneuriat']
                                ]);
                            } else {
                                // Si le genre n'est pas reconnu
                                $statistiquesFormation['hommes_formation_entrepreneuriat']++;
                                Log::warning('Genre non reconnu pour formation entrepreneuriat', [
                                    'collecte_id' => $collecte->id,
                                    'genre' => $genre,
                                    'beneficiaire_id' => $collecte->entreprise->beneficiaire->id ?? null
                                ]);
                            }
                        } else {
                            // Si pas de bénéficiaire
                            $statistiquesFormation['hommes_formation_entrepreneuriat']++;
                            Log::warning('Pas de bénéficiaire pour formation entrepreneuriat', [
                                'collecte_id' => $collecte->id,
                                'entreprise_id' => $collecte->entreprise_id ?? null
                            ]);
                        }
                    }
                }

                // Traiter les données de formation technique
                if (isset($form['formation_technique_recu'])) {
                    $formationTechValue = filter_var($form['formation_technique_recu'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                    Log::info('Valeur formation technique', [
                        'collecte_id' => $collecte->id,
                        'valeur_brute' => $form['formation_technique_recu'],
                        'valeur_filtree' => $formationTechValue
                    ]);

                    if ($formationTechValue === true) {
                        if ($collecte->entreprise && $collecte->entreprise->beneficiaire) {
                            $genre = $collecte->entreprise->beneficiaire->sexe ?? '';

                            Log::info('Genre détecté pour formation technique', [
                                'collecte_id' => $collecte->id,
                                'genre' => $genre
                            ]);

                            if ($genre === 'Homme') {
                                $statistiquesFormation['hommes_formation_technique']++;
                                Log::info('Incrémentation hommes_formation_technique', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesFormation['hommes_formation_technique']
                                ]);
                            } elseif ($genre === 'Femme') {
                                $statistiquesFormation['femmes_formation_technique']++;
                                Log::info('Incrémentation femmes_formation_technique', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesFormation['femmes_formation_technique']
                                ]);
                            } else {
                                $statistiquesFormation['hommes_formation_technique']++;
                                Log::warning('Genre non reconnu pour formation technique', [
                                    'collecte_id' => $collecte->id,
                                    'genre' => $genre
                                ]);
                            }
                        } else {
                            $statistiquesFormation['hommes_formation_technique']++;
                            Log::warning('Pas de bénéficiaire pour formation technique', [
                                'collecte_id' => $collecte->id
                            ]);
                        }
                    }
                }

                // Traiter les données de bancarisation au début
                if (isset($form['est_bancarise_demarrage'])) {
                    $bancariseDebutValue = filter_var($form['est_bancarise_demarrage'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                    Log::info('Valeur bancarisation début', [
                        'collecte_id' => $collecte->id,
                        'valeur_brute' => $form['est_bancarise_demarrage'],
                        'valeur_filtree' => $bancariseDebutValue
                    ]);

                    if ($bancariseDebutValue === true) {
                        if ($collecte->entreprise && $collecte->entreprise->beneficiaire) {
                            $genre = $collecte->entreprise->beneficiaire->sexe ?? '';

                            Log::info('Genre détecté pour bancarisation début', [
                                'collecte_id' => $collecte->id,
                                'genre' => $genre
                            ]);

                            if ($genre === 'Homme') {
                                $statistiquesBancarisation['hommes_bancarises_debut']++;
                                Log::info('Incrémentation hommes_bancarises_debut', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesBancarisation['hommes_bancarises_debut']
                                ]);
                            } elseif ($genre === 'Femme') {
                                $statistiquesBancarisation['femmes_bancarises_debut']++;
                                Log::info('Incrémentation femmes_bancarises_debut', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesBancarisation['femmes_bancarises_debut']
                                ]);
                            } else {
                                $statistiquesBancarisation['hommes_bancarises_debut']++;
                                Log::warning('Genre non reconnu pour bancarisation début', [
                                    'collecte_id' => $collecte->id,
                                    'genre' => $genre
                                ]);
                            }
                        } else {
                            $statistiquesBancarisation['hommes_bancarises_debut']++;
                            Log::warning('Pas de bénéficiaire pour bancarisation début', [
                                'collecte_id' => $collecte->id
                            ]);
                        }
                    }
                }

                // Traiter les données de bancarisation à la fin
                if (isset($form['est_bancarise_fin'])) {
                    $bancariseFinValue = filter_var($form['est_bancarise_fin'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                    Log::info('Valeur bancarisation fin', [
                        'collecte_id' => $collecte->id,
                        'valeur_brute' => $form['est_bancarise_fin'],
                        'valeur_filtree' => $bancariseFinValue
                    ]);

                    if ($bancariseFinValue === true) {
                        if ($collecte->entreprise && $collecte->entreprise->beneficiaire) {
                            $genre = $collecte->entreprise->beneficiaire->sexe ?? '';

                            Log::info('Genre détecté pour bancarisation fin', [
                                'collecte_id' => $collecte->id,
                                'genre' => $genre
                            ]);

                            if ($genre === 'Homme') {
                                $statistiquesBancarisation['hommes_bancarises_fin']++;
                                Log::info('Incrémentation hommes_bancarises_fin', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesBancarisation['hommes_bancarises_fin']
                                ]);
                            } elseif ($genre === 'Femme') {
                                $statistiquesBancarisation['femmes_bancarises_fin']++;
                                Log::info('Incrémentation femmes_bancarises_fin', [
                                    'collecte_id' => $collecte->id,
                                    'nouvelle_valeur' => $statistiquesBancarisation['femmes_bancarises_fin']
                                ]);
                            } else {
                                $statistiquesBancarisation['hommes_bancarises_fin']++;
                                Log::warning('Genre non reconnu pour bancarisation fin', [
                                    'collecte_id' => $collecte->id,
                                    'genre' => $genre
                                ]);
                            }
                        } else {
                            $statistiquesBancarisation['hommes_bancarises_fin']++;
                            Log::warning('Pas de bénéficiaire pour bancarisation fin', [
                                'collecte_id' => $collecte->id
                            ]);
                        }
                    }
                }

                // Traiter les appréciations
                $appreciationFields = [
                    'appreciation_organisation_interne_demarrage' => 'organisation_interne_debut',
                    'appreciation_services_adherents_demarrage' => 'services_adherents_debut',
                    'appreciation_relations_externes_demarrage' => 'relations_externes_debut',
                    'appreciation_organisation_interne_fin' => 'organisation_interne_fin',
                    'appreciation_services_adherents_fin' => 'services_adherents_fin',
                    'appreciation_relations_externes_fin' => 'relations_externes_fin',
                ];

                foreach ($appreciationFields as $formField => $statField) {
                    if (isset($form[$formField]) && is_numeric($form[$formField])) {
                        $statistiquesAppreciation[$statField][] = (float)$form[$formField];

                        Log::info('Ajout appréciation', [
                            'collecte_id' => $collecte->id,
                            'champ' => $formField,
                            'valeur' => $form[$formField],
                            'categorie' => $statField,
                            'nombre_valeurs' => count($statistiquesAppreciation[$statField])
                        ]);
                    }
                }

                // Comptabiliser pour l'insertion professionnelle
                if (isset($form['est_jeune_selectionne'])) {
                    $jeuneSelectValue = filter_var($form['est_jeune_selectionne'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                    if ($jeuneSelectValue === true) {
                        $statistiquesInsertionProfessionnelle['total_jeunes_selectionnes']++;

                        if (isset($form['a_developpe_initiative'])) {
                            $aDeveloppeValue = filter_var($form['a_developpe_initiative'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

                            if ($aDeveloppeValue === true) {
                                $statistiquesInsertionProfessionnelle['jeunes_insertions_realisees']++;
                            }
                        }
                    }
                }
            }

            // Traiter les données de formation directes
            if (isset($donnees['formation'])) {
                $hasData = true;
                foreach ($donnees['formation'] as $key => $value) {
                    if (isset($statistiquesFormation[$key])) {
                        $statistiquesFormation[$key] += (int)$value;

                        Log::info('Ajout formation directe', [
                            'collecte_id' => $collecte->id,
                            'champ' => $key,
                            'valeur' => (int)$value,
                            'nouvelle_valeur' => $statistiquesFormation[$key]
                        ]);
                    }
                }
            }

            // Traiter les données de bancarisation directes
            if (isset($donnees['bancarisation'])) {
                $hasData = true;
                foreach ($donnees['bancarisation'] as $key => $value) {
                    if (isset($statistiquesBancarisation[$key])) {
                        $statistiquesBancarisation[$key] += (int)$value;

                        Log::info('Ajout bancarisation directe', [
                            'collecte_id' => $collecte->id,
                            'champ' => $key,
                            'valeur' => (int)$value,
                            'nouvelle_valeur' => $statistiquesBancarisation[$key]
                        ]);
                    }
                }
            }

            // Traiter les données d'appréciation directes
            if (isset($donnees['appreciation'])) {
                $hasData = true;
                foreach ($donnees['appreciation'] as $key => $value) {
                    if (is_numeric($value)) {
                        if (!isset($statistiquesAppreciation[$key])) {
                            $statistiquesAppreciation[$key] = [];
                        }
                        $statistiquesAppreciation[$key][] = (float)$value;

                        Log::info('Ajout appréciation directe', [
                            'collecte_id' => $collecte->id,
                            'champ' => $key,
                            'valeur' => (float)$value,
                            'nombre_valeurs' => count($statistiquesAppreciation[$key])
                        ]);
                    }
                }
            }

        } catch (\Exception $e) {
            Log::error('Erreur lors du traitement de la collecte occasionnelle', [
                'collecte_id' => $collecte->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            continue;
        }
    }

    // Debug final
    Log::info('Processing complete', [
        'hasData' => $hasData,
        'statistiquesFormation' => $statistiquesFormation,
        'statistiquesBancarisation' => $statistiquesBancarisation,
        'statistiquesInsertionProfessionnelle' => $statistiquesInsertionProfessionnelle
    ]);

    // Si aucune donnée trouvée
    if (!$hasData) {
        Log::warning('Aucune donnée trouvée dans les collectes occasionnelles', [
            'nombre_collectes' => $collectes->count()
        ]);
        return [];
    }

    // Construire les résultats finaux - toujours inclure tous les indicateurs
    $donneesAvecCalculs['Indicateurs de formation'] = [
        [
            'id' => 'hommes_formation_entrepreneuriat',
            'label' => 'Hommes formés en entrepreneuriat',
            'value' => $statistiquesFormation['hommes_formation_entrepreneuriat'],
            'target' => max(1, $statistiquesFormation['hommes_formation_entrepreneuriat']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre d\'hommes ayant reçu une formation en entrepreneuriat',
            'is_calculated' => false,
        ],
        [
            'id' => 'femmes_formation_entrepreneuriat',
            'label' => 'Femmes formées en entrepreneuriat',
            'value' => $statistiquesFormation['femmes_formation_entrepreneuriat'],
            'target' => max(1, $statistiquesFormation['femmes_formation_entrepreneuriat']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre de femmes ayant reçu une formation en entrepreneuriat',
            'is_calculated' => false,
        ],
        [
            'id' => 'total_formation_entrepreneuriat',
            'label' => 'Total formations entrepreneuriat',
            'value' => $statistiquesFormation['hommes_formation_entrepreneuriat'] + $statistiquesFormation['femmes_formation_entrepreneuriat'],
            'target' => max(1, $statistiquesFormation['hommes_formation_entrepreneuriat'] + $statistiquesFormation['femmes_formation_entrepreneuriat']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre total de personnes formées en entrepreneuriat',
            'is_calculated' => true,
        ],
        [
            'id' => 'hommes_formation_technique',
            'label' => 'Hommes formés techniquement',
            'value' => $statistiquesFormation['hommes_formation_technique'],
            'target' => max(1, $statistiquesFormation['hommes_formation_technique']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre d\'hommes ayant reçu une formation technique',
            'is_calculated' => false,
        ],
        [
            'id' => 'femmes_formation_technique',
            'label' => 'Femmes formées techniquement',
            'value' => $statistiquesFormation['femmes_formation_technique'],
            'target' => max(1, $statistiquesFormation['femmes_formation_technique']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre de femmes ayant reçu une formation technique',
            'is_calculated' => false,
        ],
        [
            'id' => 'total_formation_technique',
            'label' => 'Total formations techniques',
            'value' => $statistiquesFormation['hommes_formation_technique'] + $statistiquesFormation['femmes_formation_technique'],
            'target' => max(1, $statistiquesFormation['hommes_formation_technique'] + $statistiquesFormation['femmes_formation_technique']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre total de personnes formées techniquement',
            'is_calculated' => true,
        ],
        // Ajout des indicateurs manquants de formation par type d'activité et de bénéficiaire
        [
            'id' => 'nbr_former_technique_typeactivite',
            'label' => 'Formations techniques par type d\'activité',
            'value' => $statistiquesFormation['hommes_formation_technique'] + $statistiquesFormation['femmes_formation_technique'],
            'target' => 0,
            'unite' => '',
            'definition' => 'Nombre de jeunes formés techniquement, ventilé par type d\'activité',
            'is_calculated' => true,
        ],
        [
            'id' => 'nbr_former_technique_typebenef',
            'label' => 'Formations techniques par type de bénéficiaire',
            'value' => $statistiquesFormation['hommes_formation_technique'] + $statistiquesFormation['femmes_formation_technique'],
            'target' => 0,
            'unite' => '',
            'definition' => 'Nombre de jeunes formés techniquement, ventilé par type de bénéficiaire',
            'is_calculated' => true,
        ],
    ];

    // Calculs pour la bancarisation - toujours afficher
    $donneesAvecCalculs['Indicateurs de bancarisation'] = [
        [
            'id' => 'hommes_bancarises_debut',
            'label' => 'Hommes bancarisés (début)',
            'value' => $statistiquesBancarisation['hommes_bancarises_debut'],
            'target' => max(1, $statistiquesBancarisation['hommes_bancarises_debut']) * 1.2,
            'unite' => '',
            'definition' => 'Nombre d\'hommes bancarisés au début du projet',
            'is_calculated' => false,
        ],
        [
            'id' => 'femmes_bancarises_debut',
            'label' => 'Femmes bancarisées (début)',
            'value' => $statistiquesBancarisation['femmes_bancarises_debut'],
            'target' => max(1, $statistiquesBancarisation['femmes_bancarises_debut']) * 1.2,
            'unite' => '',
            'definition' => 'Nombre de femmes bancarisées au début du projet',
            'is_calculated' => false,
        ],
        [
            'id' => 'total_bancarises_debut',
            'label' => 'Total bancarisés (début)',
            'value' => $statistiquesBancarisation['hommes_bancarises_debut'] + $statistiquesBancarisation['femmes_bancarises_debut'],
            'target' => max(1, $statistiquesBancarisation['hommes_bancarises_debut'] + $statistiquesBancarisation['femmes_bancarises_debut']) * 1.2,
            'unite' => '',
            'definition' => 'Nombre total de personnes bancarisées au début du projet',
            'is_calculated' => true,
        ],
        [
            'id' => 'hommes_bancarises_fin',
            'label' => 'Hommes bancarisés (fin)',
            'value' => $statistiquesBancarisation['hommes_bancarises_fin'],
            'target' => max(1, $statistiquesBancarisation['hommes_bancarises_fin']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre d\'hommes bancarisés à la fin du projet',
            'is_calculated' => false,
        ],
        [
            'id' => 'femmes_bancarises_fin',
            'label' => 'Femmes bancarisées (fin)',
            'value' => $statistiquesBancarisation['femmes_bancarises_fin'],
            'target' => max(1, $statistiquesBancarisation['femmes_bancarises_fin']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre de femmes bancarisées à la fin du projet',
            'is_calculated' => false,
        ],
        [
            'id' => 'total_bancarises_fin',
            'label' => 'Total bancarisés (fin)',
            'value' => $statistiquesBancarisation['hommes_bancarises_fin'] + $statistiquesBancarisation['femmes_bancarises_fin'],
            'target' => max(1, $statistiquesBancarisation['hommes_bancarises_fin'] + $statistiquesBancarisation['femmes_bancarises_fin']) * 1.1,
            'unite' => '',
            'definition' => 'Nombre total de personnes bancarisées à la fin du projet',
            'is_calculated' => true,
        ],
        [
            'id' => 'evolution_bancarisation_hommes',
            'label' => 'Évolution bancarisation hommes',
            'value' => $statistiquesBancarisation['hommes_bancarises_fin'] - $statistiquesBancarisation['hommes_bancarises_debut'],
            'target' => 0,
            'unite' => '',
            'definition' => 'Évolution du nombre d\'hommes bancarisés',
            'is_calculated' => true,
        ],
        [
            'id' => 'evolution_bancarisation_femmes',
            'label' => 'Évolution bancarisation femmes',
            'value' => $statistiquesBancarisation['femmes_bancarises_fin'] - $statistiquesBancarisation['femmes_bancarises_debut'],
            'target' => 0,
            'unite' => '',
            'definition' => 'Évolution du nombre de femmes bancarisées',
            'is_calculated' => true,
        ],
        [
            'id' => 'evolution_bancarisation_total',
            'label' => 'Évolution bancarisation totale',
            'value' => ($statistiquesBancarisation['hommes_bancarises_fin'] + $statistiquesBancarisation['femmes_bancarises_fin']) -
                      ($statistiquesBancarisation['hommes_bancarises_debut'] + $statistiquesBancarisation['femmes_bancarises_debut']),
            'target' => 0,
            'unite' => '',
            'definition' => 'Évolution totale du nombre de personnes bancarisées',
            'is_calculated' => true,
        ],
        [
            'id' => 'nbr_bancarisation_individuelle',
            'label' => 'Bancarisations individuelles',
            'value' => $statistiquesBancarisation['hommes_bancarises_fin'] + $statistiquesBancarisation['femmes_bancarises_fin'],
            'target' => 0,
            'unite' => '',
            'definition' => 'Nombre de promoteurs individuels bancarisés',
            'is_calculated' => true,
        ],
    ];

    // Calculs pour les appréciations - toujours créer la catégorie
    $donneesAvecCalculs['Indicateurs d\'appréciation'] = [];

    foreach ($statistiquesAppreciation as $key => $valeurs) {
        if (!empty($valeurs)) {
            $moyenne = array_sum($valeurs) / count($valeurs);

            $donneesAvecCalculs['Indicateurs d\'appréciation'][] = [
                'id' => $key,
                'label' => ucfirst(str_replace('_', ' ', $key)),
                'value' => round($moyenne, 2),
                'target' => 3,
                'unite' => '/3',
                'definition' => 'Score moyen d\'appréciation pour ' . str_replace('_', ' ', $key),
                'is_calculated' => true,
            ];
        } else {
            // Même s'il n'y a pas de valeurs, créer l'indicateur avec une valeur par défaut
            $donneesAvecCalculs['Indicateurs d\'appréciation'][] = [
                'id' => $key,
                'label' => ucfirst(str_replace('_', ' ', $key)),
                'value' => 0,
                'target' => 3,
                'unite' => '/3',
                'definition' => 'Score moyen d\'appréciation pour ' . str_replace('_', ' ', $key) . ' (aucune donnée disponible)',
                'is_calculated' => true,
            ];
        }
    }

    // Ajout de l'indicateur d'insertion professionnelle
    $insertionRate = $statistiquesInsertionProfessionnelle['total_jeunes_selectionnes'] > 0
        ? ($statistiquesInsertionProfessionnelle['jeunes_insertions_realisees'] / $statistiquesInsertionProfessionnelle['total_jeunes_selectionnes']) * 100
        : 0;

    $donneesAvecCalculs['Indicateurs de performance'] = [
        [
            'id' => 'total_jeunes_selectionnes',
            'label' => 'Total jeunes sélectionnés',
            'value' => $statistiquesInsertionProfessionnelle['total_jeunes_selectionnes'],
            'target' => max(1, $statistiquesInsertionProfessionnelle['total_jeunes_selectionnes']),
            'unite' => '',
            'definition' => 'Nombre total de jeunes sélectionnés au démarrage du projet',
            'is_calculated' => false,
        ],
        [
            'id' => 'jeunes_insertions_realisees',
            'label' => 'Insertions réalisées',
            'value' => $statistiquesInsertionProfessionnelle['jeunes_insertions_realisees'],
            'target' => max(1, $statistiquesInsertionProfessionnelle['jeunes_insertions_realisees']),
            'unite' => '',
            'definition' => 'Nombre de jeunes ayant développé des initiatives pour leur insertion professionnelle',
            'is_calculated' => false,
        ],
        [
            'id' => 'insertion_professionnelle',
            'label' => 'Taux d\'insertion professionnelle',
            'value' => round($insertionRate, 2),
            'target' => 80,
            'unite' => '%',
            'definition' => 'Pourcentage de jeunes ayant développé des initiatives pour leur insertion professionnelle',
            'is_calculated' => true,
        ],
    ];

    return $donneesAvecCalculs;
}
    /**
     * Ajouter les indicateurs calculés globaux après traitement des collectes
     */
    protected function ajouterIndicateursCalculesGlobaux($donneesAvecCalculs, $periodeType)
    {
        // Indicateur "revenu_total" pour la période semestrielle
        if (
            $periodeType === 'Semestrielle' &&
            isset($donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"]) &&
            isset($donneesAvecCalculs['Indicateurs de performance Projet'])
        ) {

            $activites = $donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"];
            $performance = $donneesAvecCalculs['Indicateurs de performance Projet'];

            $caIndex = array_search('chiffre_affaire', array_column($activites, 'id'));
            $autresRevenusIndex = array_search('total_autres_revenus', array_column($performance, 'id'));

            if ($caIndex !== false && $autresRevenusIndex !== false) {
                $ca = $activites[$caIndex]['value'];
                $autresRevenus = $performance[$autresRevenusIndex]['value'];

                // Ajouter l'indicateur revenu_total
                $performance[] = [
                    'id' => 'revenu_total',
                    'label' => 'Revenu total',
                    'value' => $ca + $autresRevenus,
                    'target' => max(1, $ca + $autresRevenus),
                    'unite' => 'FCFA',
                    'definition' => 'Somme du chiffre d\'affaires et des revenus hors entreprise principale',
                    'is_calculated' => true,
                    'metadata' => [
                        'entreprise_ids' => array_merge(
                            $activites[$caIndex]['metadata']['entreprise_ids'] ?? [],
                            $performance[$autresRevenusIndex]['metadata']['entreprise_ids'] ?? []
                        ),
                        'collecte_ids' => array_merge(
                            $activites[$caIndex]['metadata']['collecte_ids'] ?? [],
                            $performance[$autresRevenusIndex]['metadata']['collecte_ids'] ?? []
                        ),
                        'nombre_points_donnees' => ($activites[$caIndex]['metadata']['nombre_points_donnees'] ?? 0) +
                            ($performance[$autresRevenusIndex]['metadata']['nombre_points_donnees'] ?? 0)
                    ]
                ];

                $donneesAvecCalculs['Indicateurs de performance Projet'] = $performance;
            }
        }

        return $donneesAvecCalculs;
    }




    /**
     * Valide la requête d'export
     */

    /**
     * Obtient l'année d'un exercice
     */
    private function getExerciceAnnee(?int $exerciceId): int
    {
        if (!$exerciceId) {
            return (int)date('Y');
        }

        $exercice = Exercice::find($exerciceId);
        return $exercice ? (int)$exercice->annee : (int)date('Y');
    }



    /**
     * Obtenir la stratégie appropriée pour le type de période
     */
    /**
     * Obtenir la stratégie appropriée pour le type de période
     */
    private function getPeriodeStrategy(string $periodeType): PeriodeStrategyInterface
    {
        return match ($periodeType) {
            'Mensuelle' => new MoisPrecedentStrategy(),
            'Trimestrielle' => new TrimestrePrecedentStrategy(),
            'Semestrielle' => new SemestrePrecedentStrategy(),
            'Annuelle' => new ExercicePrecedentStrategy(),
            default => new DefaultPeriodeStrategy(),
        };
    }
    // Interfaces et classes pour le pattern Strategy


    // Classe abstraite pour factoriser le code commun

    /**
     * Génère un nom de fichier personnalisé pour l'export
     */


    /**
     * Obtenir les variations de période
     */
    protected function getVariationsPeriode(string $periodeType): array
    {
        $variations = [];

        switch ($periodeType) {
            case 'Trimestrielle':
                $variations = ['Trimestrielle', 'trimestriel', 'trimestre', 'Trimestriel', 'Trimestre'];
                break;
            case 'Semestrielle':
                $variations = ['Semestrielle', 'semestriel', 'semestre', 'Semestriel', 'Semestre'];
                break;
            case 'Annuelle':
                $variations = ['Annuelle', 'annuel', 'Annuel', 'annee', 'Année'];
                break;
            case 'Occasionnelle':
                $variations = ['Occasionnelle', 'occasionnel', 'Occasionnel', 'exceptionnelle', 'Exceptionnelle', 'exceptionnel', 'Exceptionnel'];
                break;
        }

        return array_unique($variations);
    }

    /**
     * Formater le libellé d'un indicateur
     */
    protected function formatIndicateurLibelle($indicateurId): string
    {
        return ucfirst(str_replace('_', ' ', $indicateurId));
    }

    /**
     * Normalise les données de collecte
     */
    protected function normaliseDonnees($donnees): array
    {
        if (is_string($donnees)) {
            $decodedData = json_decode($donnees, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decodedData;
            }
            Log::error('Erreur de décodage JSON', ['error' => json_last_error_msg()]);
            return [];
        }

        if (!is_array($donnees)) {
            return [];
        }

        return $donnees;
    }

    /**
     * Déterminer l'entreprise optimale pour l'export
     */
    protected function determinerEntrepriseOptimale(?int $exerciceId = null): int
    {
        try {
            if ($exerciceId) {
                $entrepriseAvecPlusDeCollectes = Collecte::where('exercice_id', $exerciceId)
                    ->select('entreprise_id', DB::raw('count(*) as total'))
                    ->groupBy('entreprise_id')
                    ->orderBy('total', 'desc')
                    ->first();

                if ($entrepriseAvecPlusDeCollectes) {
                    return $entrepriseAvecPlusDeCollectes->entreprise_id;
                }
            }

            // Sinon, retourner la première entreprise disponible
            $entreprise = Entreprise::first();
            return $entreprise ? $entreprise->id : 1;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la détermination de l\'entreprise optimale: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Obtenir les définitions des indicateurs
     */
    protected function getIndicateursDefinitions(): array
    {
        return [
            "Indicateurs commerciaux de l'entreprise du promoteur" => [
                'propects_grossites' => [
                    'label' => 'Nombre de clients prospectés (grossistes)',
                    'unite' => '',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'prospects_detaillant' => [
                    'label' => 'Nombre de clients prospectés (détaillants)',
                    'unite' => '',
                    'definition' => 'Le nombre de clients potentiels prospectés par le promoteur grâce au coaching et l\'appui conseil',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'clients_grossistes' => [
                    'label' => 'Nombre de nouveaux clients (grossistes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux clients obtenus grâce au coaching et l\'appui conseil',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'clients_detaillant' => [
                    'label' => 'Nombre de nouveaux clients (détaillants)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux clients obtenus grâce au coaching et l\'appui conseil',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_contrat_conclu' => [
                    'label' => 'Nombre de commandes/contrats obtenus',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats obtenus avec des grossistes ou des particuliers',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_contrat_encours' => [
                    'label' => 'Nombre de commandes/contrats en cours',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats en cours de négociation avec des grossistes ou des particuliers',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_contrat_perdu' => [
                    'label' => 'Nombre de commandes/contrats perdus',
                    'unite' => '',
                    'definition' => 'Nombre de commandes ou de contrats perdus ou non retenus avec des grossistes ou des particuliers',
                    'target' => 0,
                    'is_calculated' => false
                ],
            ],
            "Indicateurs d'activités de l'entreprise du promoteur" => [
                'nbr_cycle_production' => [
                    'label' => 'Nombre de cycles de production réalisés',
                    'unite' => '',
                    'definition' => 'Définir le nombre de cycles de production réalisés par le promoteur au cours du semestre si applicable',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_clients' => [
                    'label' => 'Nombre de clients fidélisés',
                    'unite' => '',
                    'definition' => 'Compter le nombre de clients fidélisés',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'chiffre_affaire' => [
                    'label' => 'Chiffre d\'affaires',
                    'unite' => 'FCFA',
                    'definition' => 'Montant cumulé des ventes réalisées par l\'entreprise sur une période donnée',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'taux_croissance_ca' => [
                    'label' => 'Taux de croissance du Chiffre d\'affaires',
                    'unite' => '%',
                    'definition' => 'Taux de croissance du chiffre d\'affaires par rapport à la période précédente',
                    'target' => 10,
                    'is_calculated' => true
                ],
            ],
            'Indicateurs de Rentabilité et de solvabilité' => [
                'cout_matiere_premiere' => [
                    'label' => 'Coût des matières premières',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total des matières premières utilisées dans la production',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'cout_main_oeuvre' => [
                    'label' => 'Coût de la main d\'œuvre directe',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total de la main-d\'œuvre directement impliquée dans la production',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'cout_frais_generaux' => [
                    'label' => 'Coût des frais généraux',
                    'unite' => 'FCFA',
                    'definition' => 'Coût des frais généraux liés à l\'exploitation',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'produit_exploitation' => [
                    'label' => 'Produits d\'exploitation',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des produits d\'exploitation',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'cout_production' => [
                    'label' => 'Coût de production',
                    'unite' => 'FCFA',
                    'definition' => 'Coût total de la production',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'cout_total_production' => [
                    'label' => 'Coût total de production',
                    'unite' => 'FCFA',
                    'definition' => 'Somme des coûts de matières premières, main d\'œuvre et frais généraux',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'marge_brute' => [
                    'label' => 'Marge brute',
                    'unite' => 'FCFA',
                    'definition' => 'Chiffre d\'affaires moins le coût total de production',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'taux_marge_brute' => [
                    'label' => 'Taux de marge brute',
                    'unite' => '%',
                    'definition' => 'Pourcentage de la marge brute par rapport au chiffre d\'affaires',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'total_actif' => [
                    'label' => 'Total des actifs',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des actifs de l\'entreprise',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'capital_social' => [
                    'label' => 'Capital social',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital social de l\'entreprise',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'reserves_social' => [
                    'label' => 'Réserves sociales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des réserves sociales de l\'entreprise',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'report_a_nouveau' => [
                    'label' => 'Report à nouveau',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du report à nouveau',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'resultat_net_exercice' => [
                    'label' => 'Résultat net de l\'exercice',
                    'unite' => 'FCFA',
                    'definition' => 'Résultat net de l\'exercice comptable',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'engagement_projet' => [
                    'label' => 'Emprunts liés au projet',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des emprunts contractés dans le cadre du projet',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'engagement_autre' => [
                    'label' => 'Autres emprunts',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des autres emprunts contractés',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'resultat_net_exploitation' => [
                    'label' => 'Résultat net d\'exploitation',
                    'unite' => 'FCFA',
                    'definition' => 'Résultat net d\'exploitation',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'capitaux_propres' => [
                    'label' => 'Capitaux propres',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des capitaux propres',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'dettes_fournisseurs' => [
                    'label' => 'Dettes fournisseurs',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des dettes fournisseurs',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'dettes_sociales' => [
                    'label' => 'Dettes sociales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des dettes sociales',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'dettes_fiscales' => [
                    'label' => 'Dettes fiscales',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des dettes fiscales',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'montant_creance_clients_12m' => [
                    'label' => 'Montant des créances clients irrécouvrables',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des créances clients irrécouvrables',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_creance_clients_12m' => [
                    'label' => 'Nombre de créances clients irrécouvrables',
                    'unite' => '',
                    'definition' => 'Nombre de créances clients irrécouvrables',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_echeances_impayes' => [
                    'label' => 'Nombre d\'échéances impayées',
                    'unite' => '',
                    'definition' => 'Nombre d\'échéances de crédit impayées',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_echeances_aterme' => [
                    'label' => 'Nombre d\'échéances à terme',
                    'unite' => '',
                    'definition' => 'Nombre total d\'échéances de crédit à terme',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'capital_rembourse' => [
                    'label' => 'Capital remboursé',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital remboursé',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'capital_echu' => [
                    'label' => 'Capital échu',
                    'unite' => 'FCFA',
                    'definition' => 'Montant du capital échu',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_jours_fact_client_paie' => [
                    'label' => 'Délai moyen de paiement clients',
                    'unite' => 'jours',
                    'definition' => 'Délai moyen de paiement des clients en jours',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_jours_fact_fournisseur_paie' => [
                    'label' => 'Délai moyen de paiement fournisseurs',
                    'unite' => 'jours',
                    'definition' => 'Délai moyen de paiement des fournisseurs en jours',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_factures_impayees_12m' => [
                    'label' => 'Factures clients impayées (>12 mois)',
                    'unite' => '',
                    'definition' => 'Nombre de factures clients impayées datant de plus de 12 mois',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'emprunts_moyen_terme' => [
                    'label' => 'Emprunts à moyen terme',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des emprunts à moyen terme',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'emprunts_long_terme' => [
                    'label' => 'Emprunts à long terme',
                    'unite' => 'FCFA',
                    'definition' => 'Montant des emprunts à long terme',
                    'target' => 0,
                    'is_calculated' => false
                ],
                // Indicateurs calculés pour la trésorerie annuelle
                'fonds_roulement' => [
                    'label' => 'Fonds de roulement',
                    'unite' => 'FCFA',
                    'definition' => 'Différence entre actifs immobilisés et capitaux propres plus dettes financières à long terme',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'besoin_fonds_roulement' => [
                    'label' => 'Besoin en fonds de roulement',
                    'unite' => 'FCFA',
                    'definition' => 'Excédent des actifs circulants sur les dettes circulantes',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'tresorerie_nette' => [
                    'label' => 'Trésorerie nette',
                    'unite' => 'FCFA',
                    'definition' => 'Différence entre le fonds de roulement et le besoin en fonds de roulement',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'montant_credit' => [
                    'label' => 'Montant cumulé des crédits reçus',
                    'unite' => 'FCFA',
                    'definition' => 'Montant total des crédits reçus au cours de l\'année N-1',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nombres_credits' => [
                    'label' => 'Nombre de crédits reçus',
                    'unite' => '',
                    'definition' => 'Nombre de crédits reçus au cours de l\'année N-1',
                    'target' => 0,
                    'is_calculated' => false
                ],
            ],
            'Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur' => [
                'nbr_employes_remunerer_h' => [
                    'label' => 'Employés rémunérés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés hommes rémunérés au cours de l\'année',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_employes_remunerer_f' => [
                    'label' => 'Employés rémunérés (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employées femmes rémunérées au cours de l\'année',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_employes_non_remunerer_h' => [
                    'label' => 'Employés non rémunérés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés hommes non rémunérés au cours de l\'année',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_employes_non_remunerer_f' => [
                    'label' => 'Employés non rémunérés (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employées femmes non rémunérées au cours de l\'année',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_nouveau_recru_h' => [
                    'label' => 'Nouveaux recrutés (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouveaux employés hommes recrutés',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_nouveau_recru_f' => [
                    'label' => 'Nouveaux recrutés (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre de nouvelles employées femmes recrutées',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_depart_h' => [
                    'label' => 'Départs (hommes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employés hommes ayant quitté l\'entreprise',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_depart_f' => [
                    'label' => 'Départs (femmes)',
                    'unite' => '',
                    'definition' => 'Nombre d\'employées femmes ayant quitté l\'entreprise',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'effectif_moyen_h' => [
                    'label' => 'Effectif moyen (hommes)',
                    'unite' => '',
                    'definition' => 'Effectif moyen d\'employés hommes sur la période',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'effectif_moyen_f' => [
                    'label' => 'Effectif moyen (femmes)',
                    'unite' => '',
                    'definition' => 'Effectif moyen d\'employées femmes sur la période',
                    'target' => 0,
                    'is_calculated' => false
                ],
                // Indicateurs calculés RH
                'total_employes_remuneres' => [
                    'label' => 'Total employés rémunérés',
                    'unite' => '',
                    'definition' => 'Nombre total d\'employés rémunérés (hommes + femmes)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'total_employes_non_remuneres' => [
                    'label' => 'Total employés non rémunérés',
                    'unite' => '',
                    'definition' => 'Nombre total d\'employés non rémunérés (hommes + femmes)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'total_nouveaux_recrutes' => [
                    'label' => 'Total nouveaux recrutés',
                    'unite' => '',
                    'definition' => 'Nombre total de nouveaux employés recrutés (hommes + femmes)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'total_departs' => [
                    'label' => 'Total départs',
                    'unite' => '',
                    'definition' => 'Nombre total d\'employés partis (hommes + femmes)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'effectif_moyen_total' => [
                    'label' => 'Effectif moyen total',
                    'unite' => '',
                    'definition' => 'Effectif moyen total sur la période (hommes + femmes)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'taux_turnover' => [
                    'label' => 'Taux de turnover',
                    'unite' => '%',
                    'definition' => 'Pourcentage du taux de rotation du personnel',
                    'target' => 0,
                    'is_calculated' => true
                ],
            ],
            'Indicateurs de développement personnel du promoteur' => [
                'nbr_initiatives_realises' => [
                    'label' => 'Initiatives personnelles réalisées',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles réalisées par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_initiatives_encours' => [
                    'label' => 'Initiatives personnelles en cours',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles en cours par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_initiatives_abandonnees' => [
                    'label' => 'Initiatives personnelles abandonnées',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles abandonnées par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_initiatives_aboutis' => [
                    'label' => 'Initiatives personnelles abouties',
                    'unite' => '',
                    'definition' => 'Nombre d\'initiatives personnelles ayant abouti',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_objectifs_planifies' => [
                    'label' => 'Objectifs personnels planifiés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels planifiés par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_objectifs_realises' => [
                    'label' => 'Objectifs personnels réalisés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels réalisés par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_objectifs_abandonnees' => [
                    'label' => 'Objectifs personnels abandonnés',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels abandonnés par le promoteur',
                    'target' => 0,
                    'is_calculated' => false
                ],
                'nbr_objectifs_aboutis' => [
                    'label' => 'Objectifs personnels aboutis',
                    'unite' => '',
                    'definition' => 'Nombre d\'objectifs personnels ayant abouti',
                    'target' => 0,
                    'is_calculated' => false
                ],
                // Indicateurs calculés pour le développement personnel
                'total_initiatives' => [
                    'label' => 'Total initiatives',
                    'unite' => '',
                    'definition' => 'Nombre total d\'initiatives (réalisées + en cours + abandonnées + abouties)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'total_objectifs' => [
                    'label' => 'Total objectifs',
                    'unite' => '',
                    'definition' => 'Nombre total d\'objectifs (planifiés + réalisés + abandonnés + aboutis)',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'taux_reussite_initiatives' => [
                    'label' => 'Taux de réussite des initiatives',
                    'unite' => '%',
                    'definition' => 'Pourcentage d\'initiatives abouties par rapport au total',
                    'target' => 0,
                    'is_calculated' => true
                ],
                'taux_reussite_objectifs' => [
                    'label' => 'Taux de réussite des objectifs',
                    'unite' => '%',
                    'definition' => 'Pourcentage d\'objectifs aboutis par rapport au total',
                    'target' => 0,
                    'is_calculated' => true
                ],
            ],
        ];
    }

    /**
     * Simplifie le type de période pour correspondre aux valeurs en base
     */
    /**
     * Simplifie le type de période pour correspondre aux valeurs en base
     */
    private function simplifierPeriodeType(string $periodeType): string
    {
        // Mappez les formats standardisés avec ceux que vous utilisez réellement
        $mappings = [
            'Trimestrielle' => 'Trimestriel',
            'Semestrielle' => 'Semestriel',
            'Annuelle' => 'Annuel',
            'Occasionnelle' => 'Occasionnelle'
        ];

        return $mappings[$periodeType] ?? $periodeType;
    }
    /**
     * Obtenir la valeur d'un indicateur pour la période précédente (simplifié)
     * Méthode adaptée spécifiquement à votre structure de données
     */
    protected function getValeurPeriodePrecedente(string $indicateurId, string $periodeType): ?float
    {
        try {
            $exerciceId = request('exercice_id');
            $entrepriseId = request('entreprise_id');

            if (!$exerciceId) {
                $exercice = Exercice::where('actif', true)->first();
                $exerciceId = $exercice?->id;
            }

            if (!$exerciceId) {
                return null;
            }

            Log::info('Recherche valeur précédente améliorer', [
                'indicateur' => $indicateurId,
                'periode_type' => $periodeType,
                'exercice_id' => $exerciceId,
                'entreprise_id' => $entrepriseId
            ]);

            // 1. D'abord, obtenons la collecte actuelle
            $periodeTypeSimple = $this->simplifierPeriodeType($periodeType);

            $collecteActuelle = Collecte::query()
                ->where('exercice_id', $exerciceId)
                ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
                ->where('periode', 'like', '%' . $periodeTypeSimple . '%')
                ->latest('date_collecte')
                ->first();

            if (!$collecteActuelle) {
                Log::warning('Pas de collecte actuelle trouvée', [
                    'periode_type' => $periodeType,
                    'periode_type_simple' => $periodeTypeSimple
                ]);
                return null;
            }

            Log::info('Collecte actuelle trouvée', [
                'id' => $collecteActuelle->id,
                'periode' => $collecteActuelle->periode,
                'date_collecte' => $collecteActuelle->date_collecte
            ]);

            // 2. Stratégie 1: Chercher dans la même période mais exercice précédent
            $valeur = $this->chercherDansExercicePrecedent($indicateurId, $periodeTypeSimple, $exerciceId, $entrepriseId);
            if ($valeur !== null) {
                return $valeur;
            }

            // 3. Stratégie 2: Chercher dans n'importe quelle collecte de l'exercice précédent
            $valeur = $this->chercherDansToutesCollectesPrecedentes($indicateurId, $exerciceId, $entrepriseId);
            if ($valeur !== null) {
                return $valeur;
            }

            // 4. Stratégie 3: Chercher dans les collectes plus anciennes du même exercice
            $valeur = $this->chercherDansCollectesAnterieures($indicateurId, $collecteActuelle, $entrepriseId);
            if ($valeur !== null) {
                return $valeur;
            }

            Log::warning('Aucune valeur précédente trouvée après toutes les stratégies', [
                'indicateur' => $indicateurId
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de la valeur précédente', [
                'indicateur' => $indicateurId,
                'periode_type' => $periodeType,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Cherche l'indicateur dans l'exercice précédent avec même type de période
     */
    private function chercherDansExercicePrecedent(string $indicateurId, string $periodeTypeSimple, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Trouver l'exercice précédent
        $exerciceActuel = Exercice::find($exerciceId);
        if (!$exerciceActuel) {
            return null;
        }

        $exercicePrecedent = Exercice::where('annee', '<', $exerciceActuel->annee)
            ->latest('annee')
            ->first();

        if (!$exercicePrecedent) {
            return null;
        }

        // Chercher une collecte du même type dans l'exercice précédent
        $collectePrecedente = Collecte::query()
            ->where('exercice_id', $exercicePrecedent->id)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
            ->where('periode', 'like', '%' . $periodeTypeSimple . '%')
            ->latest('date_collecte')
            ->first();

        if (!$collectePrecedente) {
            Log::info('Pas de collecte du même type trouvée dans l\'exercice précédent');
            return null;
        }

        Log::info('Collecte précédente du même type trouvée', [
            'id' => $collectePrecedente->id,
            'periode' => $collectePrecedente->periode,
            'date_collecte' => $collectePrecedente->date_collecte
        ]);

        return $this->extraireValeurIndicateur($collectePrecedente, $indicateurId);
    }

    /**
     * Cherche l'indicateur dans toutes les collectes de l'exercice précédent
     */
    private function chercherDansToutesCollectesPrecedentes(string $indicateurId, int $exerciceId, ?int $entrepriseId): ?float
    {
        // Trouver l'exercice précédent
        $exerciceActuel = Exercice::find($exerciceId);
        if (!$exerciceActuel) {
            return null;
        }

        $exercicePrecedent = Exercice::where('annee', '<', $exerciceActuel->annee)
            ->latest('annee')
            ->first();

        if (!$exercicePrecedent) {
            return null;
        }

        // Récupérer toutes les collectes de l'exercice précédent
        $collectesPrecedentes = Collecte::query()
            ->where('exercice_id', $exercicePrecedent->id)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
            ->latest('date_collecte')
            ->get();

        Log::info('Recherche dans toutes les collectes de l\'exercice précédent', [
            'exercice_precedent_id' => $exercicePrecedent->id,
            'nombre_collectes' => $collectesPrecedentes->count()
        ]);

        // Parcourir toutes les collectes pour trouver l'indicateur
        foreach ($collectesPrecedentes as $collecte) {
            $valeur = $this->extraireValeurIndicateur($collecte, $indicateurId);
            if ($valeur !== null) {
                Log::info('Valeur trouvée dans une collecte précédente', [
                    'collecte_id' => $collecte->id,
                    'periode' => $collecte->periode,
                    'valeur' => $valeur
                ]);
                return $valeur;
            }
        }

        Log::info('Indicateur non trouvé dans aucune collecte de l\'exercice précédent');
        return null;
    }

    /**
     * Cherche l'indicateur dans les collectes plus anciennes du même exercice
     */
    private function chercherDansCollectesAnterieures(string $indicateurId, Collecte $collecteActuelle, ?int $entrepriseId): ?float
    {
        // Chercher des collectes plus anciennes dans le même exercice
        $collectesAnterieures = Collecte::query()
            ->where('exercice_id', $collecteActuelle->exercice_id)
            ->when($entrepriseId, fn($q) => $q->where('entreprise_id', $entrepriseId))
            ->where('date_collecte', '<', $collecteActuelle->date_collecte)
            ->latest('date_collecte')
            ->get();

        Log::info('Recherche dans les collectes antérieures du même exercice', [
            'exercice_id' => $collecteActuelle->exercice_id,
            'nombre_collectes' => $collectesAnterieures->count()
        ]);

        // Parcourir toutes les collectes pour trouver l'indicateur
        foreach ($collectesAnterieures as $collecte) {
            $valeur = $this->extraireValeurIndicateur($collecte, $indicateurId);
            if ($valeur !== null) {
                Log::info('Valeur trouvée dans une collecte antérieure', [
                    'collecte_id' => $collecte->id,
                    'periode' => $collecte->periode,
                    'valeur' => $valeur
                ]);
                return $valeur;
            }
        }

        Log::info('Indicateur non trouvé dans aucune collecte antérieure');
        return null;
    }

    /**
     * Extrait la valeur d'un indicateur d'une collecte
     */
    private function extraireValeurIndicateur(Collecte $collecte, string $indicateurId): ?float
    {
        $donnees = is_array($collecte->donnees)
            ? $collecte->donnees
            : json_decode($collecte->donnees, true);

        if (empty($donnees)) {
            return null;
        }

        // Chercher dans toutes les catégories
        foreach ($donnees as $categorie => $indicateurs) {
            if (is_array($indicateurs) && isset($indicateurs[$indicateurId]) && is_numeric($indicateurs[$indicateurId])) {
                $valeur = (float) $indicateurs[$indicateurId];

                Log::info('Valeur trouvée pour l\'indicateur', [
                    'indicateur' => $indicateurId,
                    'valeur' => $valeur,
                    'categorie' => $categorie,
                    'collecte_id' => $collecte->id
                ]);

                return $valeur;
            }
        }

        Log::info('Indicateur non trouvé dans cette collecte', [
            'indicateur' => $indicateurId,
            'collecte_id' => $collecte->id,
            'periode' => $collecte->periode
        ]);

        return null;
    }



    /**
     * Calculer le taux de croissance avec une estimation intelligente
     */
    private function calculerTauxCroissanceCA(array &$donneesAvecCalculs, string $periodeType): void
    {
        if (!isset($donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"])) {
            return;
        }

        $activites = &$donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"];

        // Vérifier si ce calcul a déjà été fait
        $existingIndex = array_search('taux_croissance_ca', array_column($activites, 'id'));
        if ($existingIndex !== false) {
            Log::info('Le taux de croissance a déjà été calculé, on évite le doublon');
            return;
        }

        $caActuelIndex = array_search('chiffre_affaire', array_column($activites, 'id'));
        if ($caActuelIndex === false) {
            return;
        }

        $caActuel = $activites[$caActuelIndex]['value'];

        // Essayer d'abord la méthode améliorée pour trouver une valeur précédente
        $caPrecedent = $this->getValeurPeriodePrecedente('chiffre_affaire', $periodeType);

        Log::info('Calcul taux de croissance amélioré', [
            'ca_actuel' => $caActuel,
            'ca_precedent' => $caPrecedent,
            'periode_type' => $periodeType,
            'methode' => $caPrecedent ? 'valeur trouvée' : 'valeur estimée'
        ]);

        // Si pas de valeur précédente, estimer à 90% de la valeur actuelle
        // pour avoir une croissance de 10% par défaut
        if ($caPrecedent === null && $caActuel > 0) {
            $caPrecedent = $caActuel * 0.9;
        }

        if ($caPrecedent !== null && $caPrecedent > 0) {
            $tauxCroissance = (($caActuel - $caPrecedent) / $caPrecedent) * 100;

            $activites[] = [
                'id' => 'taux_croissance_ca',
                'label' => 'Taux de croissance du Chiffre d\'affaires',
                'value' => round($tauxCroissance, 2),
                'target' => 10,
                'unite' => '%',
                'definition' => $caPrecedent === $caActuel * 0.9
                    ? 'Taux de croissance estimé (première période)'
                    : 'Taux de croissance du chiffre d\'affaires par rapport à la période précédente',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $activites[$caActuelIndex]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $activites[$caActuelIndex]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => $activites[$caActuelIndex]['metadata']['nombre_points_donnees'] ?? 1,
                    'previous_value' => $caPrecedent,
                    'estimation' => $caPrecedent === $caActuel * 0.9
                ]
            ];
        } else {
            // Si pas de valeur précédente ou égale à zéro, afficher taux de 0%
            $activites[] = [
                'id' => 'taux_croissance_ca',
                'label' => 'Taux de croissance du Chiffre d\'affaires',
                'value' => 0,
                'target' => 10,
                'unite' => '%',
                'definition' => 'Taux de croissance non disponible (première période)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $activites[$caActuelIndex]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $activites[$caActuelIndex]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => $activites[$caActuelIndex]['metadata']['nombre_points_donnees'] ?? 1,
                    'previous_value' => null,
                    'reason' => 'Première période, pas de données précédentes disponibles'
                ]
            ];
        }
    }

    /**
     * Appliquer les calculs pour les indicateurs standard
     */
    protected function appliquerCalculsStandard(&$donneesAvecCalculs, $periodeType)
    {
        // Calcul du taux de croissance du CA avec la méthode améliorée
        // Cette méthode remplace complètement l'ancien code de calcul
        $this->calculerTauxCroissanceCA($donneesAvecCalculs, $periodeType);

        // Calcul de la marge brute
        if (isset($donneesAvecCalculs['Indicateurs de Rentabilité et de solvabilité'])) {
            $rentabilite = &$donneesAvecCalculs['Indicateurs de Rentabilité et de solvabilité'];

            // Récupérer les données pour calculer la marge
            $ca = null;
            $coutProduction = 0;

            // Obtenir le CA depuis la catégorie "Indicateurs d'activités"
            if (isset($donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"])) {
                $activites = $donneesAvecCalculs["Indicateurs d'activités de l'entreprise du promoteur"];
                $caIndex = array_search('chiffre_affaire', array_column($activites, 'id'));
                if ($caIndex !== false) {
                    $ca = $activites[$caIndex]['value'];
                }
            }

            // Calculer le coût total de production
            $coutMatiere = null;
            $coutMainOeuvre = null;
            $coutGeneraux = null;

            foreach ($rentabilite as $ind) {
                if ($ind['id'] === 'cout_matiere_premiere') $coutMatiere = $ind['value'];
                if ($ind['id'] === 'cout_main_oeuvre') $coutMainOeuvre = $ind['value'];
                if ($ind['id'] === 'cout_frais_generaux') $coutGeneraux = $ind['value'];
            }

            if ($coutMatiere !== null || $coutMainOeuvre !== null || $coutGeneraux !== null) {
                $coutProduction = ($coutMatiere ?? 0) + ($coutMainOeuvre ?? 0) + ($coutGeneraux ?? 0);

                $rentabilite[] = [
                    'id' => 'cout_total_production',
                    'label' => 'Coût total de production',
                    'value' => $coutProduction,
                    'target' => 0,
                    'unite' => 'FCFA',
                    'definition' => 'Somme des coûts de matières premières, main d\'œuvre et frais généraux',
                    'is_calculated' => true,
                    'metadata' => [
                        'entreprise_ids' => $rentabilite[0]['metadata']['entreprise_ids'] ?? [],
                        'collecte_ids' => $rentabilite[0]['metadata']['collecte_ids'] ?? [],
                        'nombre_points_donnees' => 1
                    ]
                ];
            }

            // Calculer la marge brute
            if ($ca !== null && $coutProduction !== null) {
                $margeBrute = $ca - $coutProduction;
                $margePercentage = $ca > 0 ? ($margeBrute / $ca) * 100 : 0;

                $rentabilite[] = [
                    'id' => 'marge_brute',
                    'label' => 'Marge brute',
                    'value' => $margeBrute,
                    'target' => 0,
                    'unite' => 'FCFA',
                    'definition' => 'Chiffre d\'affaires moins le coût total de production',
                    'is_calculated' => true,
                    'metadata' => [
                        'entreprise_ids' => $rentabilite[0]['metadata']['entreprise_ids'] ?? [],
                        'collecte_ids' => $rentabilite[0]['metadata']['collecte_ids'] ?? [],
                        'nombre_points_donnees' => 1
                    ]
                ];

                $rentabilite[] = [
                    'id' => 'taux_marge_brute',
                    'label' => 'Taux de marge brute',
                    'value' => round($margePercentage, 2),
                    'target' => 0,
                    'unite' => '%',
                    'definition' => 'Pourcentage de la marge brute par rapport au chiffre d\'affaires',
                    'is_calculated' => true,
                    'metadata' => [
                        'entreprise_ids' => $rentabilite[0]['metadata']['entreprise_ids'] ?? [],
                        'collecte_ids' => $rentabilite[0]['metadata']['collecte_ids'] ?? [],
                        'nombre_points_donnees' => 1
                    ]
                ];
            }
        }

        // Calculer les ratios pour les données annuelles
        if ($periodeType === 'Annuelle' && isset($donneesAvecCalculs["Ratios de Rentabilité et de solvabilité de l'entreprise"])) {
            $ratios = &$donneesAvecCalculs["Ratios de Rentabilité et de solvabilité de l'entreprise"];

            // Calculer le ratio de couverture des charges d'intérêt
            $changesFinIndex = array_search('charges_financières', array_column($ratios, 'id'));
            $resultatIndex = array_search('r_n_exploitation_aimp', array_column($ratios, 'id'));

            if ($changesFinIndex !== false && $resultatIndex !== false) {
                $chargesFinancieres = $ratios[$changesFinIndex]['value'];
                $resultatExploitation = $ratios[$resultatIndex]['value'];

                if ($chargesFinancieres > 0) {
                    $ratioCouverture = $resultatExploitation / $chargesFinancieres;

                    $ratios[] = [
                        'id' => 'ratio_couverture_interets',
                        'label' => 'Ratio de couverture des intérêts',
                        'value' => round($ratioCouverture, 2),
                        'target' => 0,
                        'unite' => 'fois',
                        'definition' => 'Capacité de l\'entreprise à payer ses charges d\'intérêt',
                        'is_calculated' => true,
                        'metadata' => [
                            'entreprise_ids' => $ratios[$changesFinIndex]['metadata']['entreprise_ids'],
                            'collecte_ids' => $ratios[$changesFinIndex]['metadata']['collecte_ids'],
                            'nombre_points_donnees' => 1
                        ]
                    ];
                }
            }

            // Calculer le ratio d'endettement
            $dettesIndex = array_search('dette_financement', array_column($ratios, 'id'));
            $capitauxIndex = array_search('moyenne_capitaux_propre', array_column($ratios, 'id'));

            if ($dettesIndex !== false && $capitauxIndex !== false) {
                $dettes = $ratios[$dettesIndex]['value'];
                $capitaux = $ratios[$capitauxIndex]['value'];

                if ($capitaux > 0) {
                    $ratioEndettement = $dettes / $capitaux;

                    $ratios[] = [
                        'id' => 'ratio_endettement',
                        'label' => 'Ratio d\'endettement',
                        'value' => round($ratioEndettement, 2),
                        'target' => 0,
                        'unite' => 'fois',
                        'definition' => 'Ratio des dettes sur les capitaux propres',
                        'is_calculated' => true,
                        'metadata' => [
                            'entreprise_ids' => $ratios[$dettesIndex]['metadata']['entreprise_ids'],
                            'collecte_ids' => $ratios[$dettesIndex]['metadata']['collecte_ids'],
                            'nombre_points_donnees' => 1
                        ]
                    ];
                }
            }
        }

        // Calculer les indicateurs de trésorerie pour les données semestrielles et annuelles
        if (in_array($periodeType, ['Semestrielle', 'Annuelle']) && isset($donneesAvecCalculs['Indicateurs de trésorerie'])) {
            $tresorerie = &$donneesAvecCalculs['Indicateurs de trésorerie'];

            // Récupérer les données pour les calculs
            $actifsImmobilises = 0;
            $capitauxPropres = 0;
            $dettesLongTerme = 0;
            $stocks = 0;
            $creancesClients = 0;
            $dettesFournisseurs = 0;
            $dettesInfraPaire = 0;

            foreach ($tresorerie as $ind) {
                switch ($ind['id']) {
                    case 'actifs_immobilises':
                        $actifsImmobilises = $ind['value'];
                        break;
                    case 'stocks':
                        $stocks = $ind['value'];
                        break;
                    case 'creances_clients':
                        $creancesClients = $ind['value'];
                        break;
                    case 'dettes_fournisseurs':
                        $dettesFournisseurs = $ind['value'];
                        break;
                    case 'emprunts_long_terme':
                        $dettesLongTerme = $ind['value'];
                        break;
                }
            }

            // Obtenir les capitaux propres depuis la catégorie de rentabilité
            if (isset($donneesAvecCalculs['Indicateurs de Rentabilité et de solvabilité'])) {
                $rentabilite = $donneesAvecCalculs['Indicateurs de Rentabilité et de solvabilité'];
                $capitauxIndex = array_search('capitaux_propres', array_column($rentabilite, 'id'));
                if ($capitauxIndex !== false) {
                    $capitauxPropres = $rentabilite[$capitauxIndex]['value'];
                }
            }

            // Calculer le fonds de roulement
            $fondsRoulement = ($capitauxPropres + $dettesLongTerme) - $actifsImmobilises;
            $tresorerie[] = [
                'id' => 'fonds_roulement',
                'label' => 'Fonds de roulement',
                'value' => $fondsRoulement,
                'target' => 0,
                'unite' => 'FCFA',
                'definition' => 'Différence entre actifs immobilisés et capitaux propres plus dettes financières à long terme',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $tresorerie[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $tresorerie[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            // Calculer le besoin en fonds de roulement
            $besoinFondsRoulement = ($stocks + $creancesClients) - $dettesFournisseurs;
            $tresorerie[] = [
                'id' => 'besoin_fonds_roulement',
                'label' => 'Besoin en fonds de roulement',
                'value' => $besoinFondsRoulement,
                'target' => 0,
                'unite' => 'FCFA',
                'definition' => 'Excédent des actifs circulants sur les dettes circulantes',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $tresorerie[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $tresorerie[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            // Calculer la trésorerie nette
            $tresorerieNette = $fondsRoulement - $besoinFondsRoulement;
            $tresorerie[] = [
                'id' => 'tresorerie_nette',
                'label' => 'Trésorerie nette',
                'value' => $tresorerieNette,
                'target' => 0,
                'unite' => 'FCFA',
                'definition' => 'Différence entre le fonds de roulement et le besoin en fonds de roulement',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $tresorerie[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $tresorerie[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];
        }

        // Calculer les indicateurs RH pour les données semestrielles et annuelles
        if (in_array($periodeType, ['Semestrielle', 'Annuelle']) && isset($donneesAvecCalculs['Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur'])) {
            $rh = &$donneesAvecCalculs['Indicateurs Sociaux et ressources humaines de l\'entreprise du promoteur'];

            // Calculer les totaux
            $totalEmployesRemuneresH = 0;
            $totalEmployesRemuneresF = 0;
            $totalEmployesNonRemuneresH = 0;
            $totalEmployesNonRemuneresF = 0;
            $totalNouveauxRecrusH = 0;
            $totalNouveauxRecrusF = 0;
            $totalDepartsH = 0;
            $totalDepartsF = 0;
            $effectifMoyenH = 0;
            $effectifMoyenF = 0;

            foreach ($rh as $ind) {
                switch ($ind['id']) {
                    case 'nbr_employes_remunerer_h':
                        $totalEmployesRemuneresH = $ind['value'];
                        break;
                    case 'nbr_employes_remunerer_f':
                        $totalEmployesRemuneresF = $ind['value'];
                        break;
                    case 'nbr_employes_non_remunerer_h':
                        $totalEmployesNonRemuneresH = $ind['value'];
                        break;
                    case 'nbr_employes_non_remunerer_f':
                        $totalEmployesNonRemuneresF = $ind['value'];
                        break;
                    case 'nbr_nouveau_recru_h':
                        $totalNouveauxRecrusH = $ind['value'];
                        break;
                    case 'nbr_nouveau_recru_f':
                        $totalNouveauxRecrusF = $ind['value'];
                        break;
                    case 'nbr_depart_h':
                        $totalDepartsH = $ind['value'];
                        break;
                    case 'nbr_depart_f':
                        $totalDepartsF = $ind['value'];
                        break;
                    case 'effectif_moyen_h':
                        $effectifMoyenH = $ind['value'];
                        break;
                    case 'effectif_moyen_f':
                        $effectifMoyenF = $ind['value'];
                        break;
                }
            }

            // Ajouter les indicateurs calculés
            $rh[] = [
                'id' => 'total_employes_remuneres',
                'label' => 'Total employés rémunérés',
                'value' => $totalEmployesRemuneresH + $totalEmployesRemuneresF,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total d\'employés rémunérés (hommes + femmes)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $rh[] = [
                'id' => 'total_employes_non_remuneres',
                'label' => 'Total employés non rémunérés',
                'value' => $totalEmployesNonRemuneresH + $totalEmployesNonRemuneresF,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total d\'employés non rémunérés (hommes + femmes)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $rh[] = [
                'id' => 'total_nouveaux_recrutes',
                'label' => 'Total nouveaux recrutés',
                'value' => $totalNouveauxRecrusH + $totalNouveauxRecrusF,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total de nouveaux employés recrutés (hommes + femmes)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $rh[] = [
                'id' => 'total_departs',
                'label' => 'Total départs',
                'value' => $totalDepartsH + $totalDepartsF,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total d\'employés partis (hommes + femmes)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $rh[] = [
                'id' => 'effectif_moyen_total',
                'label' => 'Effectif moyen total',
                'value' => $effectifMoyenH + $effectifMoyenF,
                'target' => 0,
                'unite' => '',
                'definition' => 'Effectif moyen total sur la période (hommes + femmes)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            // Calculer le taux de turnover
            $effectifMoyenTotal = $effectifMoyenH + $effectifMoyenF;
            $totalDeparts = $totalDepartsH + $totalDepartsF;
            $tauxTurnover = $effectifMoyenTotal > 0 ? ($totalDeparts / $effectifMoyenTotal) * 100 : 0;

            $rh[] = [
                'id' => 'taux_turnover',
                'label' => 'Taux de turnover',
                'value' => round($tauxTurnover, 2),
                'target' => 0,
                'unite' => '%',
                'definition' => 'Pourcentage du taux de rotation du personnel',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $rh[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $rh[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];
        }

        // Calculer les indicateurs de développement personnel pour les données semestrielles et annuelles
        if (in_array($periodeType, ['Semestrielle', 'Annuelle']) && isset($donneesAvecCalculs['Indicateurs de développement personnel du promoteur'])) {
            $dev = &$donneesAvecCalculs['Indicateurs de développement personnel du promoteur'];

            // Calculer les totaux
            $initiativesRealisees = 0;
            $initiativesEnCours = 0;
            $initiativesAbandonnees = 0;
            $initiativesAbouties = 0;
            $objectifsPlanifies = 0;
            $objectifsRealises = 0;
            $objectifsAbandonnees = 0;
            $objectifsAboutis = 0;

            foreach ($dev as $ind) {
                switch ($ind['id']) {
                    case 'nbr_initiatives_realises':
                        $initiativesRealisees = $ind['value'];
                        break;
                    case 'nbr_initiatives_encours':
                        $initiativesEnCours = $ind['value'];
                        break;
                    case 'nbr_initiatives_abandonnees':
                        $initiativesAbandonnees = $ind['value'];
                        break;
                    case 'nbr_initiatives_aboutis':
                        $initiativesAbouties = $ind['value'];
                        break;
                    case 'nbr_objectifs_planifies':
                        $objectifsPlanifies = $ind['value'];
                        break;
                    case 'nbr_objectifs_realises':
                        $objectifsRealises = $ind['value'];
                        break;
                    case 'nbr_objectifs_abandonnees':
                        $objectifsAbandonnees = $ind['value'];
                        break;
                    case 'nbr_objectifs_aboutis':
                        $objectifsAboutis = $ind['value'];
                        break;
                }
            }

            // Ajouter les indicateurs calculés pour le développement personnel
            $totalInitiatives = $initiativesRealisees + $initiativesEnCours + $initiativesAbandonnees + $initiativesAbouties;
            $totalObjectifs = $objectifsPlanifies + $objectifsRealises + $objectifsAbandonnees + $objectifsAboutis;

            $dev[] = [
                'id' => 'total_initiatives',
                'label' => 'Total initiatives',
                'value' => $totalInitiatives,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total d\'initiatives (réalisées + en cours + abandonnées + abouties)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $dev[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $dev[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $dev[] = [
                'id' => 'total_objectifs',
                'label' => 'Total objectifs',
                'value' => $totalObjectifs,
                'target' => 0,
                'unite' => '',
                'definition' => 'Nombre total d\'objectifs (planifiés + réalisés + abandonnés + aboutis)',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $dev[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $dev[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            // Calculer les taux de réussite
            $tauxReussiteInitiatives = $totalInitiatives > 0 ? ($initiativesAbouties / $totalInitiatives) * 100 : 0;
            $tauxReussiteObjectifs = $totalObjectifs > 0 ? ($objectifsAboutis / $totalObjectifs) * 100 : 0;

            $dev[] = [
                'id' => 'taux_reussite_initiatives',
                'label' => 'Taux de réussite des initiatives',
                'value' => round($tauxReussiteInitiatives, 2),
                'target' => 0,
                'unite' => '%',
                'definition' => 'Pourcentage d\'initiatives abouties par rapport au total',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $dev[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $dev[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];

            $dev[] = [
                'id' => 'taux_reussite_objectifs',
                'label' => 'Taux de réussite des objectifs',
                'value' => round($tauxReussiteObjectifs, 2),
                'target' => 0,
                'unite' => '%',
                'definition' => 'Pourcentage d\'objectifs aboutis par rapport au total',
                'is_calculated' => true,
                'metadata' => [
                    'entreprise_ids' => $dev[0]['metadata']['entreprise_ids'] ?? [],
                    'collecte_ids' => $dev[0]['metadata']['collecte_ids'] ?? [],
                    'nombre_points_donnees' => 1
                ]
            ];
        }
    }

    /**
     * Afficher les détails d'un indicateur
     */
    public function showIndicateur(Request $request, string $indicateurId)
    {
        try {
            $categorie = $request->query('categorie');
            $periodeType = $request->query('periode_type', 'Trimestrielle');
            $exerciceId = $request->query('exercice_id');
            $entrepriseId = $request->query('entreprise_id');
            $beneficiaireId = $request->query('beneficiaire_id');

            if (!$categorie) {
                return redirect()->route('indicateurs.analyse')
                    ->with('error', 'La catégorie est requise pour afficher les détails d\'un indicateur');
            }

            // Construire la requête de base pour les collectes
            $query = Collecte::with(['entreprise.beneficiaire', 'exercice'])
                ->where('periode', 'like', '%' . $periodeType . '%');

            // Appliquer les filtres
            if ($exerciceId) {
                $query->where('exercice_id', $exerciceId);
            }

            if ($periodeType === 'Occasionnelle' && $beneficiaireId) {
                $entreprisesIds = Entreprise::where('beneficiaires_id', $beneficiaireId)->pluck('id')->toArray();
                if (!empty($entreprisesIds)) {
                    $query->whereIn('entreprise_id', $entreprisesIds);
                }
            } elseif ($entrepriseId) {
                $query->where('entreprise_id', $entrepriseId);
            }

            // Exécuter la requête
            $collectes = $query->orderBy('date_collecte', 'asc')->get();

            // Traiter les données pour cet indicateur
            $evolutionData = [];

            foreach ($collectes as $collecte) {
                $donnees = is_array($collecte->donnees)
                    ? $collecte->donnees
                    : json_decode($collecte->donnees, true);

                if (empty($donnees)) continue;

                // Chercher l'indicateur dans la collecte
                if (isset($donnees[$categorie]) && isset($donnees[$categorie][$indicateurId])) {
                    $valeur = $donnees[$categorie][$indicateurId];

                    if (is_numeric($valeur)) {
                        $date = \Carbon\Carbon::parse($collecte->date_collecte)->format('Y-m-d');
                        $nomEntreprise = $collecte->entreprise ? $collecte->entreprise->nom_entreprise : 'Entreprise inconnue';

                        $evolutionData[] = [
                            'date' => $date,
                            'value' => (float)$valeur,
                            'entreprise' => $nomEntreprise,
                            'exercice' => $collecte->exercice ? $collecte->exercice->annee : 'N/A',
                            'periode' => $collecte->periode
                        ];
                    }
                }
            }

            // Obtenir les métadonnées de l'indicateur
            $definitions = $this->getIndicateursDefinitions();
            $metadata = $definitions[$categorie][$indicateurId] ?? [];

            $indicateurDetail = [
                'id' => $indicateurId,
                'label' => $metadata['label'] ?? $this->formatIndicateurLibelle($indicateurId),
                'unite' => $metadata['unite'] ?? '',
                'definition' => $metadata['definition'] ?? '',
                'evolution_data' => $evolutionData
            ];

            $exercices = Exercice::orderBy('annee', 'desc')->get();

            return Inertia::render('Indicateurs/Detail', [
                'indicateur' => $indicateurDetail,
                'exercices' => $exercices,
                'periodeType' => $periodeType,
                'categorie' => $categorie,
                'exerciceId' => $exerciceId,
                'entrepriseId' => $entrepriseId,
                'beneficiaireId' => $beneficiaireId
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'affichage des détails de l\'indicateur: ' . $e->getMessage());
            return redirect()->route('indicateurs.analyse')
                ->with('error', 'Une erreur est survenue lors de l\'affichage des détails de l\'indicateur');
        }
    }

    /**
     * Afficher l'analyse intégrée
     */
    public function showAnalyseIntegree(Request $request)
    {
        $exercices = Exercice::orderBy('annee', 'desc')->get();
        $entreprises = Entreprise::select('id', 'nom_entreprise')->orderBy('nom_entreprise')->get();
        $beneficiaires = Beneficiaire::select('id', 'nom', 'prenom')
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get();

        $exerciceActif = Exercice::where('actif', true)->orderBy('annee', 'desc')->first();
        $exerciceId = $request->input('exercice_id', $exerciceActif ? $exerciceActif->id : null);
        $periodeType = $request->input('periode_type', 'Trimestrielle');
        $periodes = ['Trimestrielle', 'Semestrielle', 'Annuelle', 'Occasionnelle'];

        return Inertia::render('Indicateurs/AnalyseIntegree', [
            'exercices' => $exercices,
            'entreprises' => $entreprises,
            'beneficiaires' => $beneficiaires,
            'defaultExerciceId' => $exerciceId,
            'defaultPeriodeType' => $periodeType,
            'periodes' => $periodes,
        ]);
    }
    //---------------------------------------------------------------------------------------------------------------
    /**
 * Valide la requête d'export
 */
private function validateExportRequest(Request $request): array
{
    return $request->validate([
        'periode_type' => 'required|string|in:Trimestrielle,Semestrielle,Annuelle,Occasionnelle',
        'categorie' => 'nullable|string|max:255',
        'exercice_id' => 'nullable|integer|exists:exercices,id',
        'entreprise_id' => 'nullable|integer|exists:entreprises,id',
        'beneficiaire_id' => 'nullable|integer|exists:beneficiaires,id',
        'region' => 'nullable|string|max:255',
        'commune' => 'nullable|string|max:255',
        'secteur' => 'nullable|string|max:255',
        'beneficiaire_type' => 'nullable|string|max:255',
        'export_all' => 'nullable|boolean',
        'include_basic_info' => 'nullable|boolean',
        'include_metadata' => 'nullable|boolean',
        'format_nice' => 'nullable|boolean',
    ]);
}

/**
 * Génère un nom de fichier personnalisé pour l'export
 */
protected function generateExportFileName(array $validated, array $filters, bool $exportAll = false): string
{
    $parts = ['indicateurs', $validated['periode_type']];

    if ($exportAll) {
        $parts[] = 'export_complet';
    } else if (isset($validated['categorie'])) {
        $parts[] = \Illuminate\Support\Str::slug($validated['categorie']);
    }

    if (isset($filters['region'])) {
        $parts[] = 'region-' . \Illuminate\Support\Str::slug($filters['region']);
    }

    if (isset($filters['secteur'])) {
        $parts[] = 'secteur-' . \Illuminate\Support\Str::slug($filters['secteur']);
    }

    if (isset($filters['beneficiaire_type'])) {
        $parts[] = 'type-' . \Illuminate\Support\Str::slug($filters['beneficiaire_type']);
    }

    $parts[] = date('Y-m-d');

    return implode('_', $parts) . '.xlsx';
}

/**
 * Export Excel des indicateurs
 */
public function exportExcel(Request $request)
{
    try {
        // Convertir explicitement export_all en booléen si présent
        if ($request->has('export_all')) {
            $request->merge(['export_all' => filter_var($request->input('export_all'), FILTER_VALIDATE_BOOLEAN)]);
        }

        $validated = $this->validateExportRequest($request);
        $filters = array_filter($validated);
        $exportAll = $request->has('export_all') ? (bool)$request->input('export_all') : false;
        $includeBasicInfo = $request->has('include_basic_info') ? (bool)$request->input('include_basic_info') : true;
        $includeMetadata = $request->has('include_metadata') ? (bool)$request->input('include_metadata') : true;
        $formatNice = $request->has('format_nice') ? (bool)$request->input('format_nice') : true;

        // Déterminer l'entreprise pour l'export
        $entrepriseId = $this->determinerEntrepriseOptimale($filters['exercice_id'] ?? null);
        if (isset($filters['entreprise_id'])) {
            $entrepriseId = $filters['entreprise_id'];
        }

        // Obtenir l'année
        $annee = $this->getExerciceAnnee($filters['exercice_id'] ?? null);

        // Log des paramètres pour le débogage
        Log::info('Paramètres d\'export', [
            'entrepriseId' => $entrepriseId,
            'annee' => $annee,
            'periodeType' => $validated['periode_type'],
            'filters' => $filters,
            'exportAll' => $exportAll,
            'includeBasicInfo' => $includeBasicInfo,
            'includeMetadata' => $includeMetadata,
            'formatNice' => $formatNice
        ]);

        // Préparation des données pour l'export multi-feuilles
        $sheetsData = [];

        // 1. FEUILLE D'INFORMATIONS GÉNÉRALES
        if ($includeBasicInfo) {
            // Récupérer l'entreprise avec ses relations
            $entreprise = \App\Models\Entreprise::with([
                'beneficiaire',
                'beneficiaire.ong',
                'beneficiaire.institutionFinanciere',
                'beneficiaire.coaches',
                'ong',
                'institutionFinanciere'
            ])->find($entrepriseId);

            if (!$entreprise) {
                Log::warning("Entreprise avec ID $entrepriseId non trouvée");
            }

            // Récupérer les collectes associées pour la période spécifiée
            $collectesQuery = \App\Models\Collecte::with(['exercice', 'user', 'periode'])
                ->where('entreprise_id', $entrepriseId);

            // Appliquer les filtres de période
            if ($validated['periode_type'] !== 'Occasionnelle') {
                $collectesQuery->where(function($query) use ($validated) {
                    $query->where('periode', 'like', '%' . $validated['periode_type'] . '%')
                          ->orWhereHas('periode', function($q) use ($validated) {
                              $q->where('type_periode', 'like', '%' . strtolower(substr($validated['periode_type'], 0, -2)) . '%');
                          });
                });
            } else {
                $collectesQuery->where('type_collecte', 'Exceptionnelle');
            }

            // Filtre par exercice si spécifié
            if (isset($filters['exercice_id'])) {
                $collectesQuery->where('exercice_id', $filters['exercice_id']);
            }

            $collectes = $collectesQuery->orderBy('date_collecte', 'desc')->get();

            $infoGeneralesData = [];

            // Informations de base de l'entreprise
            $infoGeneralesData[] = ['id_entreprise', $entreprise ? $entreprise->id : 'N/A'];
            $infoGeneralesData[] = ['nom_entreprise', $entreprise ? $entreprise->nom_entreprise : 'N/A'];

            // Informations de collecte
            if ($collectes->isNotEmpty()) {
                $collecte = $collectes->first();

                $infoGeneralesData[] = ['exercice', $collecte->exercice ? $collecte->exercice->annee : $annee];
                $infoGeneralesData[] = ['frequence', $validated['periode_type']];
                $infoGeneralesData[] = ['periode', $collecte->periode ? ($collecte->periode->nom ?? $collecte->periode) : $validated['periode_type']];
                $infoGeneralesData[] = ['statut', $collecte->status ?? 'Collecté'];
                $infoGeneralesData[] = ['date_collecte', $collecte->date_collecte ? $collecte->date_collecte->format('Y-m-d') : 'N/A'];
                $infoGeneralesData[] = ['type_collecte', $collecte->type_collecte ?? 'Standard'];
                $infoGeneralesData[] = ['collecte_par', $collecte->user ? $collecte->user->name : 'N/A'];
                $infoGeneralesData[] = ['date_creation', $collecte->created_at ? $collecte->created_at->format('Y-m-d H:i:s') : 'N/A'];
                $infoGeneralesData[] = ['date_modification', $collecte->updated_at ? $collecte->updated_at->format('Y-m-d H:i:s') : 'N/A'];
            } else {
                // Valeurs par défaut si pas de collecte
                $infoGeneralesData[] = ['exercice', $annee];
                $infoGeneralesData[] = ['frequence', $validated['periode_type']];
                $infoGeneralesData[] = ['periode', 'N/A'];
                $infoGeneralesData[] = ['statut', 'Non collecté'];
                $infoGeneralesData[] = ['date_collecte', 'N/A'];
                $infoGeneralesData[] = ['type_collecte', 'N/A'];
                $infoGeneralesData[] = ['collecte_par', 'N/A'];
                $infoGeneralesData[] = ['date_creation', 'N/A'];
                $infoGeneralesData[] = ['date_modification', 'N/A'];
            }

            // Informations sur l'ONG et l'institution financière
            $ong = null;
            $institutionFinanciere = null;

            // Vérifier d'abord les relations directes de l'entreprise
            if ($entreprise) {
                if ($entreprise->ong) {
                    $ong = $entreprise->ong;
                }
                if ($entreprise->institutionFinanciere) {
                    $institutionFinanciere = $entreprise->institutionFinanciere;
                }

                // Ensuite vérifier via le bénéficiaire si nécessaire
                if (!$ong && $entreprise->beneficiaire && $entreprise->beneficiaire->ong) {
                    $ong = $entreprise->beneficiaire->ong;
                }
                if (!$institutionFinanciere && $entreprise->beneficiaire && $entreprise->beneficiaire->institutionFinanciere) {
                    $institutionFinanciere = $entreprise->beneficiaire->institutionFinanciere;
                }
            }

            $infoGeneralesData[] = ['ong', $ong ? $ong->nom : 'N/A'];

            // Gestion des coaches
            $coaches = 'N/A';
            if ($entreprise && $entreprise->beneficiaire) {
                $beneficiaire = $entreprise->beneficiaire;

                try {
                    if ($beneficiaire->coaches instanceof \Illuminate\Database\Eloquent\Collection && $beneficiaire->coaches->isNotEmpty()) {
                        $coaches = $beneficiaire->coaches->map(function($coach) {
                            return $coach->nom . ' ' . $coach->prenom;
                        })->implode(', ');
                    }
                } catch (\Exception $e) {
                    Log::error("Erreur lors de la récupération des coaches: " . $e->getMessage());
                    $coaches = 'Erreur: ' . $e->getMessage();
                }
            }

            $infoGeneralesData[] = ['coaches', $coaches];

            // Informations géographiques
            $province = 'N/A';
            if ($entreprise && $entreprise->beneficiaire && !empty($entreprise->beneficiaire->provinces)) {
                $province = $entreprise->beneficiaire->provinces;
            }

            $infoGeneralesData[] = ['province', $province];
            $infoGeneralesData[] = ['region', $entreprise ? $entreprise->ville : 'N/A'];
            $infoGeneralesData[] = ['secteur_activite', $entreprise ? $entreprise->secteur_activite : 'N/A'];

            // Institution financière
            $infoGeneralesData[] = ['institutionFinanciere', $institutionFinanciere ? $institutionFinanciere->nom : 'N/A'];

            $sheetsData['Informations Générales'] = [
                'headers' => ['Attribut', 'Valeur'],
                'data' => $infoGeneralesData
            ];
        }

        // 2. FEUILLES DES INDICATEURS
        // Récupérer les données selon la catégorie ou toutes les catégories
        $params = ['periode_type' => $validated['periode_type']];
        if (isset($filters['exercice_id'])) $params['exercice_id'] = $filters['exercice_id'];
        if (isset($filters['entreprise_id'])) $params['entreprise_id'] = $filters['entreprise_id'];
        if (isset($filters['beneficiaire_id'])) $params['beneficiaire_id'] = $filters['beneficiaire_id'];
        if (isset($filters['region'])) $params['region'] = $filters['region'];
        if (isset($filters['commune'])) $params['commune'] = $filters['commune'];
        if (isset($filters['secteur'])) $params['secteur'] = $filters['secteur'];
        if (isset($filters['beneficiaire_type'])) $params['beneficiaire_type'] = $filters['beneficiaire_type'];

        $response = $this->getAnalyseData(new \Illuminate\Http\Request($params));

        if ($response->getStatusCode() === 200) {
            $responseData = json_decode($response->getContent(), true);

            if ($responseData['success']) {
                $indicateursData = $responseData['data'];

                if ($exportAll) {
                    // Une feuille par catégorie d'indicateurs
                    foreach ($indicateursData as $categorie => $indicateurs) {
                        if (empty($indicateurs)) continue;

                        $categorieData = [];
                        foreach ($indicateurs as $indicateur) {
                            $categorieData[] = [
                                $indicateur['id'],
                                $indicateur['label'],
                                $indicateur['value'],
                                $indicateur['target'],
                                $indicateur['unite'],
                                $indicateur['definition'],
                                $indicateur['is_calculated'] ? 'Oui' : 'Non'
                            ];
                        }

                        $sheetsData[$categorie] = [
                            'headers' => ['ID', 'Indicateur', 'Valeur', 'Cible', 'Unité', 'Définition', 'Calculé'],
                            'data' => $categorieData
                        ];
                    }
                } else if (isset($filters['categorie']) && isset($indicateursData[$filters['categorie']])) {
                    // Exporter uniquement la catégorie spécifiée
                    $categorieData = [];
                    foreach ($indicateursData[$filters['categorie']] as $indicateur) {
                        $categorieData[] = [
                            $indicateur['id'],
                            $indicateur['label'],
                            $indicateur['value'],
                            $indicateur['target'],
                            $indicateur['unite'],
                            $indicateur['definition'],
                            $indicateur['is_calculated'] ? 'Oui' : 'Non'
                        ];
                    }

                    $sheetsData[$filters['categorie']] = [
                        'headers' => ['ID', 'Indicateur', 'Valeur', 'Cible', 'Unité', 'Définition', 'Calculé'],
                        'data' => $categorieData
                    ];
                }
            }
        }

        // 3. FEUILLE DE MÉTADONNÉES
        if ($includeMetadata) {
            $metadataData = [
                ['Date d\'exportation', now()->format('Y-m-d H:i:s')],
                ['Période exportée', $validated['periode_type']],
                ['Année', $annee],
                ['', ''],
                ['Filtres appliqués', ''],
            ];

            foreach ($filters as $key => $value) {
                if ($value && $key !== 'exercice_id' && $key !== 'entreprise_id' && $key !== 'beneficiaires_id') {
                    $metadataData[] = [ucfirst(str_replace('_', ' ', $key)), $value];
                }
            }

            $metadataData[] = ['', ''];
            $metadataData[] = ['Statistiques', ''];
            $metadataData[] = ['Date et heure d\'exportation', now()->format('d/m/Y H:i:s')];
            $metadataData[] = ['Type d\'exportation', isset($filters['categorie']) ? 'Par catégorie' : 'Complet'];
            $metadataData[] = ['Format libellés', $formatNice ? 'Optimisé' : 'Brut'];

            $metadataData[] = ['', ''];
            $metadataData[] = ['Informations système', ''];
            $metadataData[] = ['Version de l\'application', '3.1.0'];
            $metadataData[] = ['Générée par', 'Module d\'export d\'indicateurs'];
            $metadataData[] = ['Utilisateur', auth()->user()->name ?? 'N/A'];

            $sheetsData['Métadonnées'] = [
                'headers' => ['Attribut', 'Valeur'],
                'data' => $metadataData
            ];
        }

        // S'assurer qu'il y a au moins une feuille
        if (empty($sheetsData)) {
            $sheetsData['Données vides'] = [
                'headers' => ['Message'],
                'data' => [['Aucune donnée disponible pour les critères sélectionnés']]
            ];
        }

        // Créer l'export multi-feuilles
        $export = new MultiSheetIndicateursExport($sheetsData);

        // Générer un nom de fichier personnalisé
        $fileName = $this->generateExportFileName($validated, $filters, $exportAll);

        // Lancer le téléchargement
        return \Maatwebsite\Excel\Facades\Excel::download($export, $fileName);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('Erreur détaillée lors de l\'exportation Excel', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'params' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'exportation',
            'error' => config('app.debug') ? $e->getMessage() : 'Erreur serveur interne',
        ], 500);
    }
}

    /**
     * Obtenir la liste des bénéficiaires (API)
     */
    public function getBeneficiaires()
    {
        try {
            $beneficiaires = Beneficiaire::select('id', 'nom', 'prenom')
                ->orderBy('nom')
                ->orderBy('prenom')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $beneficiaires,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des bénéficiaires: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des bénéficiaires',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

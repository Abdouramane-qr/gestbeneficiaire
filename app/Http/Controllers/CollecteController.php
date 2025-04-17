<?php

namespace App\Http\Controllers;

use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Exercice;
use App\Models\Periode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class CollecteController extends Controller
{
    public function index(Request $request)
    {
        $query = Collecte::with(['entreprise', 'exercice', 'periode', 'user']);

        if ($request->has('periode_id')) {
            $query->where('periode_id', $request->input('periode_id'));
        }

        if ($request->has('exercice_id')) {
            $query->where('exercice_id', $request->input('exercice_id'));
        }

        if ($request->has('entreprise_id')) {
            $query->where('entreprise_id', $request->input('entreprise_id'));
        }

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->whereHas('entreprise', function($subQuery) use ($searchTerm) {
                    $subQuery->where('nom_entreprise', 'like', "%{$searchTerm}%");
                })
                ->orWhereHas('exercice', function($subQuery) use ($searchTerm) {
                    $subQuery->where('annee', 'like', "%{$searchTerm}%");
                })
                ->orWhereHas('periode', function($subQuery) use ($searchTerm) {
                    $subQuery->where('type_periode', 'like', "%{$searchTerm}%");
                });
            });
        }

        $collectes = $query->orderBy('date_collecte', 'asc')
            ->paginate(10)
            ->appends($request->query());

        return Inertia::render('collectes/index', [
            'collectes' => $collectes,
            'filters' => $request->only(['search', 'periode_id', 'exercice_id', 'entreprise_id']),
            'periodes' => Periode::all(),
            'exercices' => Exercice::orderBy('annee', 'asc')->get(),
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get()
        ]);
    }
    public function show(Collecte $collecte)
    {
        $collecte->load(['entreprise', 'exercice', 'periode', 'user']);

        $categoriesDisponibles = [];
        if ($collecte->donnees && is_array($collecte->donnees)) {
            $categoriesDisponibles = array_keys($collecte->donnees);
        }

        return Inertia::render('collectes/Show', [
            'collecte' => $collecte,
            'categoriesDisponibles' => array_values($categoriesDisponibles)
        ]);
    }


    /**
     * Affiche le formulaire de création d'une collecte
     */
    public function create()
    {
        // Récupérer les données de base
        $entreprises = Entreprise::select('id', 'nom_entreprise')->get();
        $exercices = Exercice::orderBy('annee', 'desc')->get();
        $periodes = Periode::with('exercice')->get();

        // Récupérer l'entreprise présélectionnée si disponible
        $entrepriseId = request('entreprise_id');
        $dependenciesData = [];

        // Si une entreprise est présélectionnée, récupérer les données des collectes existantes
        if ($entrepriseId) {
            $dependenciesData = $this->getExistingCollectesData((int)$entrepriseId);
        }

        return Inertia::render('collectes/create', [
            'entreprises' => $entreprises,
            'exercices' => $exercices,
            'periodes' => $periodes,
            'dependenciesData' => $dependenciesData,
            'preselectedPeriode' => request('periode_id')
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'une collecte
     */
    public function edit(Collecte $collecte)
    {
        // Récupérer les données des collectes existantes pour cette entreprise
        $dependenciesData = $this->getExistingCollectesData($collecte->entreprise_id, $collecte->id);

        return Inertia::render('collectes/edit', [
            'collecte' => $collecte->load(['entreprise', 'exercice', 'periode']),
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get(),
            'exercices' => Exercice::orderBy('annee', 'asc')->get(),
            'periodes' => Periode::all(),
            'dependenciesData' => $dependenciesData
        ]);
    }

    /**
     * Stocke une nouvelle collecte
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'entreprise_id' => 'required|exists:entreprises,id',
                'exercice_id' => 'required|exists:exercices,id',
                'periode_id' => 'required|exists:periodes,id',
                'date_collecte' => 'required|date',
                'donnees' => 'required|array',
                'type_collecte' => 'required|in:standard,brouillon'
            ]);

            $periode = Periode::findOrFail($validated['periode_id']);
            if ($periode->exercice_id != $validated['exercice_id']) {
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'La période ne correspond pas à l\'exercice sélectionné'
                    ], 422);
                }
                return back()->withErrors([
                    'periode_id' => 'La période ne correspond pas à l\'exercice sélectionné.'
                ]);
            }

            $existing = Collecte::where('entreprise_id', $validated['entreprise_id'])
                ->where('periode_id', $validated['periode_id'])
                ->where('type_collecte', 'standard')
                ->exists();

            if ($existing && $validated['type_collecte'] === 'standard') {
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Une collecte standard existe déjà pour cette entreprise et période.'
                    ], 422);
                }
                return back()->withErrors([
                    'general' => 'Une collecte existe déjà pour cette entreprise et période.'
                ]);
            }

            // Avant de sauvegarder, recalculer les indicateurs calculés automatiquement
            $validatedDonnees = $this->recalculateIndicateurs(
                $validated['donnees'],
                $validated['entreprise_id'],
                $periode->type_periode
            );

            $collecte = Collecte::create([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'user_id' => Auth::id(),
                'date_collecte' => $validated['date_collecte'],
                'type_collecte' => $validated['type_collecte'],
                'donnees' => $validatedDonnees,
                'periode' => $periode->type_periode ?? 'Non spécifié',
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Collecte enregistrée avec succès',
                    'collecte_id' => $collecte->id
                ]);
            }

            return redirect()->route('collectes.index')
                ->with('success', 'Collecte enregistrée avec succès');

        } catch (\Exception $e) {
            Log::error('Erreur création collecte: '.$e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Une erreur est survenue: ' . $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'general' => 'Une erreur est survenue: '.$e->getMessage()
            ]);
        }
    }

    /**
     * Met à jour une collecte existante
     */
    public function update(Request $request, Collecte $collecte)
    {
        Log::info('Données reçues pour mise à jour:', $request->all());

        try {
            // S'assurer que type_collecte a une valeur par défaut si non fourni
            $data = $request->all();
            if (!isset($data['type_collecte'])) {
                // Si on convertit de brouillon à standard
                if ($collecte->type_collecte === 'brouillon' && isset($data['convertToStandard']) && $data['convertToStandard']) {
                    $data['type_collecte'] = 'standard';
                } else {
                    // Sinon garder le type existant
                    $data['type_collecte'] = $collecte->type_collecte;
                }
            }

            $validated = Validator::make($data, [
                'entreprise_id' => 'required|exists:entreprises,id',
                'exercice_id' => 'required|exists:exercices,id',
                'periode_id' => 'required|exists:periodes,id',
                'date_collecte' => 'required|date',
                'donnees' => 'required|array',
                'type_collecte' => 'required|in:standard,brouillon'
            ])->validate();

            Log::info('Données validées:', $validated);
            Log::info('État actuel de la collecte: ' . $collecte->type_collecte . ' -> demandé: ' . $validated['type_collecte']);

            // Vérification de la période par rapport à l'exercice
            $periode = Periode::findOrFail($validated['periode_id']);
            if ($periode->exercice_id != $validated['exercice_id']) {
                return $this->sendErrorResponse($request, 'periode_id', 'La période ne correspond pas à l\'exercice sélectionné.');
            }

            // Cas spécial: conversion de brouillon à standard
            $isConverting = $collecte->type_collecte === 'brouillon' && $validated['type_collecte'] === 'standard';

            if ($isConverting) {
                Log::info('Tentative de conversion brouillon -> standard');

                // Vérifier s'il existe déjà une collecte standard pour cette entreprise/période
                $existing = Collecte::where('entreprise_id', $validated['entreprise_id'])
                    ->where('periode_id', $validated['periode_id'])
                    ->where('type_collecte', 'standard')
                    ->where('id', '!=', $collecte->id)
                    ->exists();

                if ($existing) {
                    return $this->sendErrorResponse(
                        $request,
                        'general',
                        'Une collecte standard existe déjà pour cette entreprise et période. Impossible de convertir ce brouillon.'
                    );
                }

                Log::info('La conversion est possible, aucune collecte standard existante.');
            }

            // Avant de sauvegarder, recalculer les indicateurs calculés automatiquement
            $validatedDonnees = $this->recalculateIndicateurs(
                $validated['donnees'],
                $validated['entreprise_id'],
                $periode->type_periode,
                $collecte->id
            );

            // Mise à jour des données
            $collecte->update([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'date_collecte' => $validated['date_collecte'],
                'donnees' => $validatedDonnees,
                'type_collecte' => $validated['type_collecte'],
                'periode' => $periode->type_periode ?? 'Non spécifié'
            ]);

            // Message de succès spécifique pour la conversion
            $message = $isConverting
                ? 'Brouillon converti avec succès en collecte standard'
                : 'Collecte mise à jour avec succès';

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'isConverted' => $isConverting,
                    'collecte' => $collecte
                ]);
            }

            return redirect()->route('collectes.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Erreur mise à jour collecte: '.$e->getMessage());
            Log::error($e->getTraceAsString());

            return $this->sendErrorResponse($request, 'general', 'Une erreur est survenue: '.$e->getMessage());
        }
    }

   /**
 * Récupère les données existantes des collectes pour une entreprise
 * Utilisé pour les calculs automatiques basés sur des dépendances
 *
 * @param int $entrepriseId ID de l'entreprise
 * @param int|null $excludeCollecteId ID de la collecte à exclure (pour l'édition)
 * @return array Données des collectes par catégorie
 */
private function getExistingCollectesData(int $entrepriseId, ?int $excludeCollecteId = null): array
{
    // Structure pour stocker les données
    $collectesData = [];

    // Récupérer toutes les collectes standard de cette entreprise
    $query = Collecte::where('entreprise_id', $entrepriseId)
        ->where('type_collecte', 'standard');

    // Exclure la collecte en cours d'édition si nécessaire
    if ($excludeCollecteId) {
        $query->where('id', '!=', $excludeCollecteId);
    }

    $collectes = $query->with('periode')->get();

    // Organiser les données par période et catégorie
    foreach ($collectes as $collecte) {
        // Déterminer le type de période
        $periodeType = '';
        if ($collecte->periode) {
            // Si periode est un objet Periode, prendre son type_periode
            if (is_object($collecte->periode) && property_exists($collecte->periode, 'type_periode')) {
                $periodeType = $collecte->periode->type_periode;
            }
            // Si periode est une chaîne, l'utiliser directement
            elseif (is_string($collecte->periode)) {
                $periodeType = $collecte->periode;
            }
        }

        // Valeur par défaut si aucune période n'est trouvée
        if (empty($periodeType)) {
            $periodeType = 'Non spécifié';
        }

        // Mapper le type de période à un format standard
        $periodeType = $this->mapTypePeriode($periodeType);

        // Si on a des données structurées dans cette collecte et que ce sont des tableaux
        $donnees = $collecte->donnees;

        // Si donnees est une chaîne JSON, la décoder
        if (is_string($donnees)) {
            $donnees = json_decode($donnees, true) ?: [];
        }

        // S'assurer que donnees est un tableau
        if (is_array($donnees)) {
            foreach ($donnees as $categorie => $categorieData) {
                // Vérifier que la catégorie et les données sont valides
                if (!is_string($categorie) || !is_array($categorieData)) {
                    continue;
                }

                // Créer la structure si elle n'existe pas
                if (!isset($collectesData[$periodeType])) {
                    $collectesData[$periodeType] = [];
                }
                if (!isset($collectesData[$periodeType][$categorie])) {
                    $collectesData[$periodeType][$categorie] = [];
                }

                // Fusionner les données existantes avec les nouvelles
                $collectesData[$periodeType][$categorie] = array_merge(
                    $collectesData[$periodeType][$categorie],
                    $categorieData
                );
            }
        }
    }

    return $collectesData;
}

    /**
     * Standardise le type de période pour la correspondance avec le frontend
     */
    private function mapTypePeriode(string $typePeriode): string
    {
        $typeMap = [
            'Mensuel' => 'Mensuelle',
            'mensuel' => 'Mensuelle',
            'Trimestriel' => 'Trimestrielle',
            'trimestriel' => 'Trimestrielle',
            'Semestriel' => 'Semestrielle',
            'semestriel' => 'Semestrielle',
            'Annuel' => 'Annuelle',
            'annuel' => 'Annuelle',
            'Occasionnel' => 'Occasionnelle',
            'occasionnel' => 'Occasionnelle',
            // Mappings directs
            'Mensuelle' => 'Mensuelle',
            'Trimestrielle' => 'Trimestrielle',
            'Semestrielle' => 'Semestrielle',
            'Annuelle' => 'Annuelle',
            'Occasionnelle' => 'Occasionnelle'
        ];

        return $typeMap[$typePeriode] ?? 'Autre';
    }

    /**
     * Recalcule les indicateurs automatiques en utilisant les dépendances disponibles
     *
     * @param array $donnees Données saisies par l'utilisateur
     * @param int $entrepriseId ID de l'entreprise
     * @param string $periodeType Type de période
     * @param int|null $excludeCollecteId ID de la collecte à exclure (pour l'édition)
     * @return array Données avec les valeurs calculées automatiquement
     */
    private function recalculateIndicateurs(array $donnees, int $entrepriseId, string $periodeType, ?int $excludeCollecteId = null): array
    {
        // Récupérer les données existantes pour les calculs
        $existingData = $this->getExistingCollectesData($entrepriseId, $excludeCollecteId);

        // Mapper le type de période
        $periodeType = $this->mapTypePeriode($periodeType);

        // Définir les indicateurs qui doivent être calculés automatiquement
        // Normalement ces configurations seraient dans un fichier de config ou en BDD
        $calculatedIndicators = $this->getCalculatedIndicatorsDependencies();

        // Parcourir les données par catégorie
        foreach ($donnees as $categorie => $categorieData) {
            // Vérifier si cette catégorie a des indicateurs calculés
            if (isset($calculatedIndicators[$periodeType][$categorie])) {
                foreach ($calculatedIndicators[$periodeType][$categorie] as $indicatorId => $indicator) {
                    // Vérifier si toutes les dépendances sont disponibles
                    $allDepsAvailable = true;
                    $valuesForCalculation = [];

                    foreach ($indicator['dependencies'] as $dep) {
                        $depCat = $dep['categorie'] ?? $categorie;
                        $depPeriode = $dep['periode'] ?? $periodeType;
                        $depField = $dep['field'];

                        // Chercher la valeur d'abord dans les données actuelles
                        if (isset($donnees[$depCat][$depField])) {
                            $valuesForCalculation[$depField] = $donnees[$depCat][$depField];
                        }
                        // Sinon, chercher dans les données existantes
                        elseif (isset($existingData[$depPeriode][$depCat][$depField])) {
                            $valuesForCalculation[$depField] = $existingData[$depPeriode][$depCat][$depField];
                        }
                        // Sinon, la dépendance n'est pas disponible
                        else {
                            $allDepsAvailable = false;
                            break;
                        }
                    }

                    // Si toutes les dépendances sont disponibles, calculer la valeur
                    if ($allDepsAvailable && isset($indicator['formula'])) {
                        try {
                            // Calculer en utilisant la formule
                            $result = $this->evaluateFormula($indicator['formula'], $valuesForCalculation);

                            // Arrondir pour les pourcentages ou valeurs monétaires
                            if (isset($indicator['unite']) && ($indicator['unite'] === '%' || $indicator['unite'] === 'FCFA')) {
                                $result = round($result, 2);
                            }

                            // Mettre à jour la valeur dans les données
                            $donnees[$categorie][$indicatorId] = (string)$result;
                        } catch (\Exception $e) {
                            Log::error("Erreur de calcul pour {$indicatorId}: " . $e->getMessage());
                        }
                    }
                }
            }
        }

        return $donnees;
    }

  /**
 * Évalue une formule mathématique de manière sécurisée
 * @param string $formula Formule à évaluer
 * @param array $values Valeurs des variables
 * @return float Résultat du calcul
 * @throws \Exception En cas d'erreur d'évaluation
 */
private function evaluateFormula(string $formula, array $values): float
{
    // Remplacer les variables par leurs valeurs
    foreach ($values as $key => $value) {
        // S'assurer que la valeur est un nombre
        $numericValue = is_numeric($value) ? (float)$value : 0;
        // Remplacer uniquement les occurrences de mots entiers
        $formula = preg_replace('/\b' . preg_quote($key, '/') . '\b/', (string)$numericValue, $formula);
    }

    // Nettoyer la formule : n'accepter que les chiffres, espaces, parenthèses et opérateurs mathématiques de base
    $formula = str_replace(['×', '÷'], ['*', '/'], $formula);

    // Vérifier que la formule ne contient que des caractères autorisés
    if (preg_match('/[^0-9\s\(\)\+\-\*\/\.\,]/', $formula)) {
        throw new \Exception("Formule non sécurisée: {$formula}");
    }

    try {
        // Utiliser une bibliothèque d'évaluation sécurisée
        return $this->mathEval($formula);
    } catch (\Exception $e) {
        Log::error("Erreur d'évaluation de formule: {$formula} - " . $e->getMessage());
        throw $e;
    }
}


/**
 * Évalue une expression mathématique simple de manière sécurisée
 * Cette implémentation ne supporte que les opérations de base (+, -, *, /, ())
 * Pour des cas plus complexes, utiliser une bibliothèque spécialisée comme:
 * - mossadal/math-parser
 * - symfony/expression-language
 *
 * @param string $expr Expression à évaluer
 * @return float Résultat de l'évaluation
 */
private function mathEval(string $expr): float
{
    // Supprimer les espaces
    $expr = trim(preg_replace('/\s+/', '', $expr));

    // Traiter d'abord les parenthèses (récursivement)
    while (preg_match('/\(([^()]+)\)/', $expr, $matches)) {
        $subResult = $this->mathEval($matches[1]);
        $expr = str_replace($matches[0], $subResult, $expr);
    }

    // Évaluer les multiplications et divisions
    while (preg_match('/(-?\d+\.?\d*)\s*([*\/])\s*(-?\d+\.?\d*)/', $expr, $matches)) {
        $left = (float)$matches[1];
        $operator = $matches[2];
        $right = (float)$matches[3];

        if ($operator === '*') {
            $result = $left * $right;
        } else {
            // Division
            if ($right == 0) {
                throw new \Exception("Division par zéro");
            }
            $result = $left / $right;
        }

        $expr = str_replace($matches[0], $result, $expr);
    }

    // Évaluer les additions et soustractions
    while (preg_match('/(-?\d+\.?\d*)\s*([+\-])\s*(-?\d+\.?\d*)/', $expr, $matches)) {
        $left = (float)$matches[1];
        $operator = $matches[2];
        $right = (float)$matches[3];

        if ($operator === '+') {
            $result = $left + $right;
        } else {
            $result = $left - $right;
        }

        $expr = str_replace($matches[0], $result, $expr);
    }

    // À ce stade, il ne devrait rester qu'un seul nombre dans l'expression
    if (!is_numeric($expr)) {
        throw new \Exception("Expression non valide après évaluation: {$expr}");
    }

    return (float)$expr;
}

    /**
     * Évalue une formule mathématique de manière sécurisée
     */
    private function secureEval(string $formula): float
    {
        // Utiliser une bibliothèque de calcul d'expressions mathématiques
        // Par exemple: symfony/expression-language ou mossadal/math-parser

        // Pour cet exemple, on utilise une implémentation simplifiée
        // ATTENTION: Dans un environnement de production, utilisez une bibliothèque adaptée

        try {
            // Évaluer la formule
            return eval('return ' . $formula . ';');
        } catch (\ParseError $e) {
            throw new \Exception("Erreur de syntaxe dans la formule: " . $e->getMessage());
        } catch (\Error $e) {
            throw new \Exception("Erreur lors de l'évaluation: " . $e->getMessage());
        }
    }

    /**
     * Définit les indicateurs calculés et leurs dépendances
     * Idéalement, cette configuration serait dans un fichier de config ou en BDD
     */
    private function getCalculatedIndicatorsDependencies(): array
    {
        return [
            'Semestrielle' => [
                'Indicateurs d\'activités de l\'entreprise du promoteur' => [
                    'taux_croissance' => [
                        'label' => 'Taux de croissance des clients',
                        'unite' => '%',
                        'formula' => '((nbr_clients - nbr_clients_n1) / nbr_clients_n1) * 100',
                        'dependencies' => [
                            ['field' => 'nbr_clients'],
                            ['field' => 'nbr_clients', 'periode' => 'Semestrielle', 'categorie' => 'Indicateurs d\'activités de l\'entreprise du promoteur']
                        ]
                    ],
                    'taux_croissance_ca' => [
                        'label' => 'Taux de croissance du Chiffre d\'affaires',
                        'unite' => '%',
                        'formula' => '((chiffre_affaire - chiffre_affaire_n1) / chiffre_affaire_n1) * 100',
                        'dependencies' => [
                            ['field' => 'chiffre_affaire'],
                            ['field' => 'chiffre_affaire', 'periode' => 'Semestrielle', 'categorie' => 'Indicateurs d\'activités de l\'entreprise du promoteur']
                        ]
                    ]
                ],
                'Indicateurs de Rentabilité et de solvabilité de l\'entreprise du promoteur' => [
                    'marge_commerciale' => [
                        'label' => 'Marge commerciale ou de production',
                        'unite' => 'FCFA',
                        'formula' => 'chiffre_affaire - cout_production',
                        'dependencies' => [
                            ['field' => 'cout_production'],
                            ['field' => 'chiffre_affaire', 'categorie' => 'Indicateurs d\'activités de l\'entreprise du promoteur']
                        ]
                    ]
                ],
                'Indicateurs de trésorerie de l\'entreprise du promoteur' => [
                    'fond_roulement' => [
                        'label' => 'Fonds de roulement',
                        'unite' => 'FCFA',
                        'formula' => '(capitaux_propres + capitaux_empruntes) - actif_immobilise',
                        'dependencies' => [
                            ['field' => 'capitaux_propres'],
                            ['field' => 'capitaux_empruntes'],
                            ['field' => 'actif_immobilise']
                        ]
                    ],
                    'bfr' => [
                        'label' => 'Besoin en fonds de roulement',
                        'unite' => 'FCFA',
                        'formula' => '(stocks + creances_clients + creances_fiscales) - (dettes_fournisseurs + dettes_sociales + dettes_fiscales)',
                        'dependencies' => [
                            ['field' => 'stocks'],
                            ['field' => 'creances_clients'],
                            ['field' => 'creances_fiscales'],
                            ['field' => 'dettes_fournisseurs'],
                            ['field' => 'dettes_sociales'],
                            ['field' => 'dettes_fiscales']
                        ]
                    ]
                ]
            ],
            'Annuelle' => [
                'Ratios de Rentabilité et de solvabilité de l\'entreprise' => [
                    'r_n_exploitation_aimp' => [
                        'label' => 'Rendement des fonds propres (ROE)',
                        'unite' => '%',
                        'formula' => '(resultat_net * 100) / capitaux_propres',
                        'dependencies' => [
                            ['field' => 'resultat_net'],
                            ['field' => 'capitaux_propres']
                        ]
                    ],
                    'autosuffisance' => [
                        'label' => 'Autosuffisance opérationnelle',
                        'formula' => 'produits_exploitation / (charges_financieres + charges_exploitation)',
                        'dependencies' => [
                            ['field' => 'produits_exploitation'],
                            ['field' => 'charges_financieres'],
                            ['field' => 'charges_exploitation']
                        ]
                    ],
                    'marge_beneficiaire' => [
                        'label' => 'Marge bénéficiaire',
                        'unite' => '%',
                        'formula' => '(resultat_net * 100) / produits_exploitation',
                        'dependencies' => [
                            ['field' => 'resultat_net'],
                            ['field' => 'produits_exploitation']
                        ]
                    ],
                    'ratio_charges_financieres' => [
                        'label' => 'Ratio de charges financières',
                        'unite' => '%',
                        'formula' => '(frais_financiers * 100) / dettes_financement',
                        'dependencies' => [
                            ['field' => 'frais_financiers'],
                            ['field' => 'dettes_financement']
                        ]
                    ]
                ],
                'Indicateurs de performance Projet' => [
                    'prop_revenu_accru_h' => [
                        'label' => 'Proportion d\'hommes avec revenus accrus',
                        'unite' => '%',
                        'formula' => '(hommes_revenus_accrus * 100) / total_hommes_beneficiaires',
                        'dependencies' => [
                            ['field' => 'hommes_revenus_accrus'],
                            ['field' => 'total_hommes_beneficiaires', 'periode' => 'Occasionnelle', 'categorie' => 'Indicateurs de performance Projet']
                        ]
                    ],
                    'prop_revenu_accru_f' => [
                        'label' => 'Proportion de femmes avec revenus accrus',
                        'unite' => '%',
                        'formula' => '(femmes_revenus_accrus * 100) / total_femmes_beneficiaires',
                        'dependencies' => [
                            ['field' => 'femmes_revenus_accrus'],
                            ['field' => 'total_femmes_beneficiaires', 'periode' => 'Occasionnelle', 'categorie' => 'Indicateurs de performance Projet']
                        ]
                    ]
                ]
            ]
        ];
    }

/**
     * Méthode spécifique pour convertir un brouillon en collecte standard
     */
    public function convertToStandard(Request $request, Collecte $collecte)
    {
        Log::info('Tentative de conversion directe brouillon->standard', [
            'collecte_id' => $collecte->id,
            'entreprise_id' => $collecte->entreprise_id,
            'periode_id' => $collecte->periode_id
        ]);

        // Vérifier que la collecte est bien un brouillon
        if ($collecte->type_collecte !== 'brouillon') {
            return $this->sendErrorResponse($request, 'general', 'Cette collecte n\'est pas un brouillon.');
        }

        try {
            // Vérifier s'il existe déjà une collecte standard pour cette entreprise/période
            $existing = Collecte::where('entreprise_id', $collecte->entreprise_id)
                ->where('periode_id', $collecte->periode_id)
                ->where('type_collecte', 'standard')
                ->where('id', '!=', $collecte->id)
                ->exists();

            if ($existing) {
                return $this->sendErrorResponse(
                    $request,
                    'general',
                    'Une collecte standard existe déjà pour cette entreprise et période.'
                );
            }

            // Conversion
            $collecte->update([
                'type_collecte' => 'standard'
            ]);

            Log::info('Collecte convertie avec succès', [
                'collecte_id' => $collecte->id,
                'type_collecte' => $collecte->type_collecte
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Brouillon converti avec succès en collecte standard',
                    'collecte' => $collecte
                ]);
            }

            return redirect()->route('collectes.index')
                ->with('success', 'Brouillon converti avec succès en collecte standard');

        } catch (\Exception $e) {
            Log::error('Erreur conversion brouillon: '.$e->getMessage());
            return $this->sendErrorResponse($request, 'general', 'Une erreur est survenue: '.$e->getMessage());
        }
    }
    public function draft(Request $request)
    {
        try {
            $validated = $request->validate([
                'entreprise_id' => 'required|exists:entreprises,id',
                'exercice_id' => 'required|exists:exercices,id',
                'periode_id' => 'required|exists:periodes,id',
                'date_collecte' => 'required|date',
                'donnees' => 'required|array'
            ]);

            $validated['type_collecte'] = 'brouillon';
            $validated['user_id'] = Auth::id();

            // Récupérer la période pour stocker son type
            $periode = Periode::findOrFail($validated['periode_id']);
            $validated['periode'] = $periode->type_periode ?? 'Non spécifié';

            $existingCollecte = Collecte::where('entreprise_id', $validated['entreprise_id'])
                ->where('periode_id', $validated['periode_id'])
                ->where('type_collecte', 'brouillon')
                ->first();

            if ($existingCollecte) {
                $existingCollecte->update($validated);
                $collecte = $existingCollecte;
            } else {
                $collecte = Collecte::create($validated);
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Brouillon enregistré avec succès',
                    'collecte_id' => $collecte->id
                ]);
            }

            return redirect()->back()->with('success', 'Brouillon enregistré avec succès');

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement du brouillon: ' . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Une erreur est survenue: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->withErrors([
                'error' => 'Une erreur est survenue: ' . $e->getMessage()
            ]);
        }
    }
    public function destroy(Collecte $collecte)
    {
        try {
            $collecte->delete();
            return redirect()->route('collectes.index')
                ->with('success', 'Collecte supprimée avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur suppression collecte: '.$e->getMessage());
            return back()->withErrors([
                'general' => 'Une erreur est survenue: '.$e->getMessage()
            ]);
        }
    }

 /**
     * Valider plusieurs collectes d'un coup (conversion de brouillon en standard)
     */
    public function validateMultiple(Request $request)
    {
        try {
            $validated = $request->validate([
                'collecte_ids' => 'required|array',
                'collecte_ids.*' => 'required|integer|exists:collectes,id',
            ]);

            $collecteIds = $validated['collecte_ids'];

            // Récupérer toutes les collectes concernées
            $collectes = Collecte::whereIn('id', $collecteIds)
                ->where('type_collecte', 'brouillon')
                ->with(['entreprise', 'periode'])
                ->get();

            if ($collectes->isEmpty()) {
                return $this->sendErrorResponse($request, 'general', 'Aucun brouillon trouvé pour validation');
            }

            // Vérifier la présence de doublons potentiels
            $conflictsFound = false;
            $conflicts = [];

            // Vérification des conflits (entreprise/période déjà utilisée dans une collecte standard)
            foreach ($collectes as $collecte) {
                $existingStandard = Collecte::where('entreprise_id', $collecte->entreprise_id)
                    ->where('periode_id', $collecte->periode_id)
                    ->where('type_collecte', 'standard')
                    ->where('id', '!=', $collecte->id)
                    ->first();

                    if ($existingStandard) {
                        $conflictsFound = true;

                        // Récupérer le nom de la période, qu'elle soit un objet ou une chaîne
                        $periodeNom = '';
                        if (is_object($collecte->periode)) {
                            $periodeNom = $collecte->periode->type_periode;
                        } elseif (is_string($collecte->periode)) {
                            $periodeNom = $collecte->periode;
                        } else {
                            $periodeNom = 'Non spécifié';
                        }

                        $conflicts[] = [
                            'collecte_id' => $collecte->id,
                            'entreprise' => $collecte->entreprise->nom_entreprise,
                            'periode' => $periodeNom,
                            'message' => 'Une collecte standard existe déjà pour cette entreprise et période'
                        ];
                    }
            }

            if ($conflictsFound) {
                return $this->sendErrorResponse(
                    $request,
                    'conflicts',
                    'Des conflits ont été détectés',
                    422,
                    ['conflicts' => $conflicts]
                );
            }

            // Transaction DB pour s'assurer que toutes les mises à jour sont faites ensemble
            DB::beginTransaction();

            $updateCount = 0;

            foreach ($collectes as $collecte) {
                $collecte->type_collecte = 'standard';
                $collecte->save();
                $updateCount++;
            }

            DB::commit();

            Log::info("Validation multiple réussie: $updateCount collectes converties");

            // Réponse de succès
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => "$updateCount collecte(s) validée(s) avec succès",
                    'count' => $updateCount
                ]);
            }

            return redirect()->route('collectes.index')
                ->with('success', "$updateCount collecte(s) validée(s) avec succès");

        } catch (QueryException $e) {
            DB::rollBack();
            Log::error('Erreur SQL lors de la validation multiple: ' . $e->getMessage());
            return $this->sendErrorResponse($request, 'database', 'Erreur de base de données: ' . $e->getMessage());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la validation multiple: ' . $e->getMessage());
            return $this->sendErrorResponse($request, 'general', 'Une erreur est survenue: ' . $e->getMessage());
        }
    }

    /**
     * Supprimer plusieurs collectes d'un coup
     */
    public function deleteMultiple(Request $request)
    {
        try {
            $validated = $request->validate([
                'collecte_ids' => 'required|array',
                'collecte_ids.*' => 'required|integer|exists:collectes,id',
            ]);

            $collecteIds = $validated['collecte_ids'];

            // Transaction DB pour s'assurer que toutes les suppressions sont faites ensemble
            DB::beginTransaction();

            $deleteCount = Collecte::whereIn('id', $collecteIds)->delete();

            DB::commit();

            Log::info("Suppression multiple réussie: $deleteCount collectes supprimées");

            // Réponse de succès
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => "$deleteCount collecte(s) supprimée(s) avec succès",
                    'count' => $deleteCount
                ]);
            }

            return redirect()->route('collectes.index')
                ->with('success', "$deleteCount collecte(s) supprimée(s) avec succès");

        } catch (QueryException $e) {
            DB::rollBack();
            Log::error('Erreur SQL lors de la suppression multiple: ' . $e->getMessage());
            return $this->sendErrorResponse($request, 'database', 'Erreur de base de données: ' . $e->getMessage());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression multiple: ' . $e->getMessage());
            return $this->sendErrorResponse($request, 'general', 'Une erreur est survenue: ' . $e->getMessage());
        }
    }


    public function export(Request $request)
    {
        try {
            // Valider les paramètres de requête
            $validated = $request->validate([
                'format' => 'required|in:pdf,excel',
                'collecte_ids' => 'sometimes|array',
                'collecte_ids.*' => 'integer|exists:collectes,id',
                'entreprise_id' => 'sometimes|integer|exists:entreprises,id',
                'exercice_id' => 'sometimes|integer|exists:exercices,id',
                'periode_id' => 'sometimes|integer|exists:periodes,id',
                'type_collecte' => 'sometimes|in:standard,brouillon',
                'search' => 'sometimes|string|max:100',
                'mode' => 'sometimes|string|in:detail,list',
            ]);

            // Si c'est un export détaillé d'une seule collecte
            if ($request->has('mode') && $request->input('mode') === 'detail'
                && $request->has('collecte_ids') && count($request->input('collecte_ids')) === 1) {

                $collecteId = $request->input('collecte_ids')[0];
                $collecte = Collecte::with(['entreprise', 'exercice', 'periode', 'user'])->findOrFail($collecteId);

                // Vérifier et corriger la relation periode si nécessaire
                if (!is_object($collecte->periode) || is_string($collecte->periode)) {
                    $periodeObj = Periode::find($collecte->periode_id);
                    if ($periodeObj) {
                        $collecte->setRelation('periode', $periodeObj);
                    } else {
                        $fakePeriode = new \stdClass();
                        $fakePeriode->id = $collecte->periode_id;
                        $fakePeriode->type_periode = is_string($collecte->periode) ? $collecte->periode : 'Non spécifié';
                        $collecte->setRelation('periode', $fakePeriode);
                    }
                }

                // Obtenir les catégories disponibles
                $categoriesDisponibles = [];
                if ($collecte->donnees && is_array($collecte->donnees)) {
                    $categoriesDisponibles = array_keys($collecte->donnees);
                }

                $filename = 'collecte_detail_' . $collecteId . '_' . date('Y-m-d_His');

                // Exporter selon le format demandé
                if ($validated['format'] === 'excel') {
                    return $this->exportDetailToExcel($collecte, $categoriesDisponibles, $filename);
                } else { // pdf
                    return $this->exportDetailToPdf($collecte, $categoriesDisponibles, $filename);
                }
            }

            // Export de liste (comportement existant)
            // Construire la requête de base
            $query = Collecte::with(['entreprise', 'exercice', 'periode', 'user']);

            // Appliquer les filtres
            if ($request->has('entreprise_id')) {
                $query->where('entreprise_id', $request->input('entreprise_id'));
            }

            if ($request->has('exercice_id')) {
                $query->where('exercice_id', $request->input('exercice_id'));
            }

            if ($request->has('periode_id')) {
                $query->where('periode_id', $request->input('periode_id'));
            }

            if ($request->has('type_collecte')) {
                $query->where('type_collecte', $request->input('type_collecte'));
            }

            // Filtre de recherche
            if ($request->has('search')) {
                $searchTerm = $request->input('search');
                $query->where(function($q) use ($searchTerm) {
                    $q->whereHas('entreprise', function($subQuery) use ($searchTerm) {
                        $subQuery->where('nom_entreprise', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('exercice', function($subQuery) use ($searchTerm) {
                        $subQuery->where('annee', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('periode', function($subQuery) use ($searchTerm) {
                        $subQuery->where('type_periode', 'like', "%{$searchTerm}%");
                    });
                });
            }

            // Si des IDs spécifiques sont fournis, filtrer par ces IDs
            if ($request->has('collecte_ids') && is_array($request->input('collecte_ids'))) {
                $query->whereIn('id', $request->input('collecte_ids'));
            }

            // Récupérer les collectes
            $collectes = $query->orderBy('date_collecte', 'desc')->get();

            // Vérifier et corriger les relations période avant l'export
            foreach ($collectes as $collecte) {
                if (!is_object($collecte->periode) || is_string($collecte->periode)) {
                    // Si la relation periode n'est pas chargée correctement ou si c'est une chaîne
                    $periodeObj = Periode::find($collecte->periode_id);
                    if ($periodeObj) {
                        // Définir manuellement la relation
                        $collecte->setRelation('periode', $periodeObj);
                    } else {
                        // Créer un objet temporaire pour éviter les erreurs
                        $fakePeriode = new \stdClass();
                        $fakePeriode->id = $collecte->periode_id;
                        $fakePeriode->type_periode = is_string($collecte->periode) ? $collecte->periode : 'Non spécifié';
                        $collecte->setRelation('periode', $fakePeriode);
                    }
                }
            }

            // Nombre total de collectes à exporter
            $totalCollectes = $collectes->count();

            // Si aucune collecte trouvée, rediriger avec un message
            if ($totalCollectes === 0) {
                return back()->with('error', 'Aucune donnée à exporter.');
            }

            // Choix du format d'export
            $format = $validated['format'];
            $filename = 'collectes_' . date('Y-m-d_His');

            if ($format === 'excel') {
                return $this->exportToExcel($collectes, $filename);
            } else { // pdf
                return $this->exportToPdf($collectes, $filename);
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'export: ' . $e->getMessage());
            Log::error($e->getTraceAsString()); // Ajouter la stack trace pour plus de détails
            return back()->with('error', 'Une erreur est survenue lors de l\'export: ' . $e->getMessage());
        }
    }

    /**
     * Exporter une collecte détaillée vers Excel
     */
    private function exportDetailToExcel($collecte, $categoriesDisponibles, $filename)
    {
        // Vous pouvez créer une classe spécifique pour l'export Excel détaillé
        // Pour l'instant, on réutilise la classe existante
        return Excel::download(new \App\Exports\CollecteDetailExport($collecte, $categoriesDisponibles), "{$filename}.xlsx");
    }

 /**
     * Exporter une collecte détaillée vers PDF
     */
    private function exportDetailToPdf($collecte, $categoriesDisponibles, $filename)
    {
        $data = [
            'collecte' => $collecte,
            'categoriesDisponibles' => $categoriesDisponibles,
            'date_export' => now()->format('d/m/Y H:i'),
            'user' => Auth::user()->name,
        ];

        $pdf = PDF::loadView('exports.collecte_detail_pdf', $data);

        // Personnalisation optionnelle du PDF
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("{$filename}.pdf");
    }
/**
 * Exporter une seule collecte vers Excel
 */
private function exportSingleToExcel($collecte, $categoriesDisponibles, $filename)
{
    return Excel::download(new \App\Exports\CollecteSingleExport($collecte, $categoriesDisponibles), "{$filename}.xlsx");
}
/**
 * Exporter une seule collecte vers PDF
 */
private function exportSingleToPdf($collecte, $categoriesDisponibles, $filename)
{
    $data = [
        'collecte' => $collecte,
        'categoriesDisponibles' => $categoriesDisponibles,
        'date_export' => now()->format('d/m/Y H:i'),
        'user' => Auth::user()->name,
    ];

    $pdf = PDF::loadView('exports.collecte_detail_pdf', $data);

    // Personnalisation optionnelle du PDF
    $pdf->setPaper('a4', 'portrait');

    return $pdf->download("{$filename}.pdf");
}
    /**
     * Exporter vers Excel
     */
    private function exportToExcel($collectes, $filename)
    {
        return Excel::download(new \App\Exports\CollectesExport($collectes), "{$filename}.xlsx");
    }

    private function exportToPdf($collectes, $filename)
    {
        $data = [
            'collectes' => $collectes,
            'date_export' => now()->format('d/m/Y H:i'),
            'user' => Auth::user()->name,
        ];

        $pdf = PDF::loadView('exports.collectes_pdf', $data);

        // Personnalisation optionnelle du PDF
        $pdf->setPaper('a4', 'landscape');

        return $pdf->download("{$filename}.pdf");
    }

    /**
     * Helper pour envoyer une réponse d'erreur cohérente
     */

    private function sendErrorResponse(Request $request, string $field, string $message, int $status = 422, array $extraData = [])
    {
        if ($request->wantsJson()) {
            return response()->json(array_merge([
                'success' => false,
                'message' => $message,
                'field' => $field
            ], $extraData), $status);
        }

        return back()->withErrors([
            $field => $message
        ]);
    }
}

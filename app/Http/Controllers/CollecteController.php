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

        $collectes = $query->orderBy('date_collecte', 'desc')
            ->paginate(10)
            ->appends($request->query());

        return Inertia::render('collectes/index', [
            'collectes' => $collectes,
            'filters' => $request->only(['search', 'periode_id', 'exercice_id', 'entreprise_id']),
            'periodes' => Periode::all(),
            'exercices' => Exercice::orderBy('annee', 'desc')->get(),
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('collectes/create', [
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get(),
            'exercices' => Exercice::orderBy('annee', 'desc')->get(),
            'periodes' => Periode::with('exercice')->get()
        ]);
    }

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

            $collecte = Collecte::create([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'user_id' => Auth::id(),
                'date_collecte' => $validated['date_collecte'],
                'type_collecte' => $validated['type_collecte'],
                'donnees' => $validated['donnees'],
                'periode' => $periode->type_periode ?? 'Non spécifié', // Ajout du champ periode
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

    public function edit(Collecte $collecte)
    {
        return Inertia::render('collectes/edit', [
            'collecte' => $collecte->load(['entreprise', 'exercice', 'periode']),
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get(),
            'exercices' => Exercice::orderBy('annee', 'desc')->get(),
            'periodes' => Periode::all()
        ]);
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

            // Mise à jour des données
            $collecte->update([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'date_collecte' => $validated['date_collecte'],
                'donnees' => $validated['donnees'],
                'type_collecte' => $validated['type_collecte'],
                'periode' => $periode->type_periode ?? 'Non spécifié' // Assurer que periode est mis à jour
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
     * Helper pour envoyer une réponse d'erreur cohérente
     */


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

    /**
     * Exporter les collectes en PDF ou Excel
     */
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

    /**
     * Exporter vers PDF
     */
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




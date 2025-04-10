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
    private function sendErrorResponse(Request $request, string $field, string $message)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => $message,
                'field' => $field
            ], 422);
        }

        return back()->withErrors([
            $field => $message
        ]);
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
}

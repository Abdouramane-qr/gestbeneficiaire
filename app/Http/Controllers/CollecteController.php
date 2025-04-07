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

class CollecteController extends Controller
{
    public function index(Request $request)
{
    $query = Collecte::with([
        'entreprise',
        'exercice',
        'periode',
        'user'
    ]);

    // Recherche si un terme est fourni
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
        'filters' => $request->only('search')
    ]);
}

    public function create()
    {
        return Inertia::render('collectes/create', [
            'entreprises' => Entreprise::select('id', 'nom_entreprise')->get(),
            'exercices' => Exercice::orderBy('annee', 'desc')->get(),
            'periodes' => Periode::all()
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
                'donnees' => 'required|array'
            ]);

            // Vérification période/exercice
            $periode = Periode::findOrFail($validated['periode_id']);
            if ($periode->exercice_id != $validated['exercice_id']) {
                return back()->withErrors([
                    'periode_id' => 'La période ne correspond pas à l\'exercice sélectionné.'
                ]);
            }

            // Vérification doublon
            $existing = Collecte::where('entreprise_id', $validated['entreprise_id'])
                ->where('periode_id', $validated['periode_id'])
                ->exists();

            if ($existing) {
                return back()->withErrors([
                    'general' => 'Une collecte existe déjà pour cette entreprise et période.'
                ]);
            }

            // Création
            Collecte::create([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'user_id' => Auth::id(),
                'date_collecte' => $validated['date_collecte'],
                'type_collecte' => 'standard',
                'periode' => $periode->type_periode,
                'donnees' => $validated['donnees']
            ]);

            return redirect()->route('collectes.index')
                ->with('success', 'Collecte enregistrée avec succès');

        } catch (\Exception $e) {
            Log::error('Erreur création collecte: '.$e->getMessage());
            return back()->withErrors([
                'general' => 'Une erreur est survenue: '.$e->getMessage()
            ]);
        }
    }

    public function show(Collecte $collecte)
    {
        $collecte->load(['entreprise', 'exercice', 'periode', 'user']);
        return Inertia::render('collectes/Show', ['collecte' => $collecte]);
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

    public function update(Request $request, Collecte $collecte)
    {
        try {
            $validated = $request->validate([
                'entreprise_id' => 'required|exists:entreprises,id',
                'exercice_id' => 'required|exists:exercices,id',
                'periode_id' => 'required|exists:periodes,id',
                'date_collecte' => 'required|date',
                'donnees' => 'required|array'
            ]);

            // Vérification période/exercice
            $periode = Periode::findOrFail($validated['periode_id']);
            if ($periode->exercice_id != $validated['exercice_id']) {
                return back()->withErrors([
                    'periode_id' => 'La période ne correspond pas à l\'exercice sélectionné.'
                ]);
            }

            // Mise à jour
            $collecte->update([
                'entreprise_id' => $validated['entreprise_id'],
                'exercice_id' => $validated['exercice_id'],
                'periode_id' => $validated['periode_id'],
                'date_collecte' => $validated['date_collecte'],
                'donnees' => $validated['donnees']
            ]);

            return redirect()->route('collectes.index')
                ->with('success', 'Collecte mise à jour avec succès');

        } catch (\Exception $e) {
            Log::error('Erreur mise à jour collecte: '.$e->getMessage());
            return back()->withErrors([
                'general' => 'Une erreur est survenue: '.$e->getMessage()
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

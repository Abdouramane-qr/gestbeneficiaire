<?php

namespace App\Http\Controllers;

use App\Models\Exercice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExerciceController extends Controller
{
    /**
     * Affiche la liste des exercices.
     */
    public function index()
    {
        $exercices = Exercice::orderBy('annee', 'desc')->paginate(10);

        return Inertia::render('Exercices/Index', [
            'exercices' => $exercices
        ]);
    }

    /**
     * Affiche le formulaire de création d'un exercice.
     */
    public function create()
    {
        return Inertia::render('Exercices/Form');
    }

    /**
     * Enregistre un nouvel exercice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee' => 'required|integer|min:2000|max:2100|unique:exercices,annee',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string',
        ]);

        $exercice = Exercice::create($validated);

        // Si c'est le premier exercice, l'activer automatiquement
        if (Exercice::count() === 1) {
            $exercice->actif = true;
            $exercice->save();
        }

        return redirect()->route('exercices.index')->with('success', 'Exercice créé avec succès');
    }

    /**
     * Affiche le formulaire d'édition d'un exercice.
     */
    public function edit(Exercice $exercice)
    {
        return Inertia::render('Exercices/Form', [
            'exercice' => $exercice
        ]);
    }

    /**
     * Met à jour un exercice existant.
     */
    public function update(Request $request, Exercice $exercice)
    {
        $validated = $request->validate([
            'annee' => 'required|integer|min:2000|max:2100|unique:exercices,annee,'.$exercice->id,
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'description' => 'nullable|string',
        ]);

        // Vérifier s'il y a des périodes qui débordent des nouvelles dates
        $periodesConflits = $exercice->periodes()
            ->where(function ($query) use ($validated) {
                $query->where('date_debut', '<', $validated['date_debut'])
                    ->orWhere('date_fin', '>', $validated['date_fin']);
            })
            ->count();

        if ($periodesConflits > 0) {
            return back()->withErrors([
                'date_debut' => 'Il existe des périodes qui ne sont pas incluses dans les nouvelles dates de l\'exercice.'
            ]);
        }

        $exercice->update($validated);

        return redirect()->route('exercices.index')->with('success', 'Exercice mis à jour avec succès');
    }

    /**
     * Active un exercice et désactive les autres.
     */
    public function activate(Exercice $exercice)
    {
        // Désactiver tous les exercices
        Exercice::query()->update(['actif' => false]);

        // Activer l'exercice sélectionné
        $exercice->actif = true;
        $exercice->save();

        return redirect()->route('exercices.index')->with('success', 'Exercice activé avec succès');
    }

    /**
     * Supprime un exercice.
     */
    public function destroy(Exercice $exercice)
    {
        // Vérifier s'il y a des périodes liées à cet exercice
        if ($exercice->periodes()->count() > 0) {
            return back()->withErrors([
                'general' => 'Impossible de supprimer cet exercice car il contient des périodes.'
            ]);
        }

        // Vérifier si c'est le seul exercice actif
        if ($exercice->actif && Exercice::where('actif', true)->count() === 1) {
            return back()->withErrors([
                'general' => 'Impossible de supprimer le seul exercice actif. Veuillez activer un autre exercice d\'abord.'
            ]);
        }

        $exercice->delete();

        return redirect()->route('exercices.index')->with('success', 'Exercice supprimé avec succès');
    }
}

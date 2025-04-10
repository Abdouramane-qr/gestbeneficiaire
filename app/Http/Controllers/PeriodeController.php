<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use App\Models\Exercice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Collecte;
use App\Models\Entreprise;



class PeriodeController extends Controller
{
    /**
     * Affiche la liste des périodes.
     */
    public function index()
    {
        $periodes = Periode::with('exercice')
            ->orderBy('date_debut', 'desc')
            ->paginate(10);

        return Inertia::render('Periodes/Index', [
            'periodes' => $periodes,
            'exercices' => Exercice::where('actif', true)->get()
        ]);
    }

    /**
     * Affiche le formulaire de création d'une période.
     */
    public function create()
    {
        return Inertia::render('Periodes/Form', [
            'exercices' => Exercice::where('actif', true)->get(),
            'typesPeriodes' => [
                'mensuel' => 'Mensuel',
                'trimestriel' => 'Trimestriel',
                'semestriel' => 'Semestriel',
                'annuel' => 'Annuel'
            ]
        ]);
    }

    /**
     * Enregistre une nouvelle période.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exercice_id' => 'required|exists:exercices,id',
            'code' => 'required|string|max:10',
            'nom' => 'required|string|max:255',
            'type_periode' => 'required|string|in:mensuel,trimestriel,semestriel,annuel',
            'numero' => 'required|integer|min:1',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        // Vérifier que la période est dans les limites de l'exercice
        $exercice = Exercice::findOrFail($validated['exercice_id']);

        if ($validated['date_debut'] < $exercice->date_debut || $validated['date_fin'] > $exercice->date_fin) {
            return back()->withErrors([
                'date_debut' => 'Les dates de la période doivent être incluses dans l\'exercice.'
            ]);
        }

        // Vérifier que la période n'est pas en conflit avec une autre pour le même exercice
        $conflictingPeriode = Periode::where('exercice_id', $validated['exercice_id'])
            ->where(function($query) use ($validated) {
                $query->whereBetween('date_debut', [$validated['date_debut'], $validated['date_fin']])
                    ->orWhereBetween('date_fin', [$validated['date_debut'], $validated['date_fin']])
                    ->orWhere(function($q) use ($validated) {
                        $q->where('date_debut', '<=', $validated['date_debut'])
                          ->where('date_fin', '>=', $validated['date_fin']);
                    });
            })
            ->first();

        if ($conflictingPeriode) {
            return back()->withErrors([
                'date_debut' => 'Cette période est en conflit avec une période existante.'
            ]);
        }

        Periode::create($validated);

        return redirect()->route('periodes.index')->with('success', 'Période créée avec succès');
    }

    /**
     * Affiche le formulaire d'édition d'une période.
     */
    public function edit(Periode $periode)
    {
        return Inertia::render('Periodes/Form', [
            'periode' => $periode,
            'exercices' => Exercice::all(),
            'typesPeriodes' => [
                'mensuel' => 'Mensuel',
                'trimestriel' => 'Trimestriel',
                'semestriel' => 'Semestriel',
                'annuel' => 'Annuel'
            ]
        ]);
    }

    /**
     * Met à jour une période existante.
     */
    public function update(Request $request, Periode $periode)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10',
            'nom' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
        ]);

        // Vérifier que la période est dans les limites de l'exercice
        $exercice = $periode->exercice;

        if ($validated['date_debut'] < $exercice->date_debut || $validated['date_fin'] > $exercice->date_fin) {
            return back()->withErrors([
                'date_debut' => 'Les dates de la période doivent être incluses dans l\'exercice.'
            ]);
        }

        // Vérifier que la période n'est pas en conflit avec une autre pour le même exercice
        $conflictingPeriode = Periode::where('exercice_id', $periode->exercice_id)
            ->where('id', '!=', $periode->id)
            ->where(function($query) use ($validated) {
                $query->whereBetween('date_debut', [$validated['date_debut'], $validated['date_fin']])
                    ->orWhereBetween('date_fin', [$validated['date_debut'], $validated['date_fin']])
                    ->orWhere(function($q) use ($validated) {
                        $q->where('date_debut', '<=', $validated['date_debut'])
                          ->where('date_fin', '>=', $validated['date_fin']);
                    });
            })
            ->first();

        if ($conflictingPeriode) {
            return back()->withErrors([
                'date_debut' => 'Cette période est en conflit avec une période existante.'
            ]);
        }

        $periode->update($validated);

        return redirect()->route('periodes.index')->with('success', 'Période mise à jour avec succès');
    }

    // /**
    //  * Clôture une période.
    //  */
    // public function cloture(Periode $periode)
    // {
    //     $periode->cloturee = true;
    //     $periode->save();

    //     return redirect()->route('periodes.index')->with('success', 'Période clôturée avec succès');
    // }

    /**
 * Clôture une période.
 */
public function cloture(Periode $periode)
{
    if (!$periode->canBeClosed()) {
        return back()->withErrors([
            'error' => 'Cette période ne peut pas être clôturée.'
        ]);
    }

    $periode->cloturee = true;
    $periode->save();

    return redirect()->route('periodes.index')->with('success', 'Période clôturée avec succès');
}

  /**
 * Réouvre une période clôturée.
 */
public function reouverture(Periode $periode)
{
    if (!$periode->canBeReopened()) {
        return back()->withErrors([
            'error' => 'Cette période ne peut pas être rouverte.'
        ]);
    }

    $periode->cloturee = false;
    $periode->save();

    return redirect()->route('periodes.index')->with('success', 'Période réouverte avec succès');
}
    /**
     * Supprime une période.
     */
    public function destroy(Periode $periode)
    {
        // Vérifier s'il y a des collectes liées à cette période
        if ($periode->collectes()->count() > 0) {
            return back()->withErrors([
                'general' => 'Impossible de supprimer cette période car elle contient des collectes.'
            ]);
        }

        $periode->delete();

        return redirect()->route('periodes.index')->with('success', 'Période supprimée avec succès');
    }

    /**
 * Affiche les collectes pour une période spécifique.
 */
public function collectes(Periode $periode)
{
    $collectes = Collecte::with(['entreprise', 'exercice', 'user'])
        ->where('periode_id', $periode->id)
        ->orderBy('date_collecte', 'desc')
        ->paginate(10);

    return Inertia::render('collectes/index', [
        'collectes' => $collectes,
        'filters' => ['periode_id' => $periode->id],
        'periodeFiltre' => $periode,
        'periodes' => Periode::all(),
        'exercices' => Exercice::orderBy('annee', 'desc')->get(),
        'entreprises' => Entreprise::select('id', 'nom_entreprise')->get()
    ]);
}
}

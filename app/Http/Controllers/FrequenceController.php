<?php

namespace App\Http\Controllers;

use App\Models\Frequence;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrequenceController extends Controller
{
    /**
     * Liste toutes les fréquences.
     */
    public function index(): Response
    {
        $frequences = Frequence::orderBy('nom', 'asc')->get();

        return Inertia::render('Frequencies/Frequencies', [
            'frequences' => $frequences,
        ]);
    }

    /**
     * Enregistre une nouvelle fréquence.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:frequences,nom',
            'code' => 'required|string|max:255',
            'days_interval' => 'required|integer',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
        ]);

        Frequence::create($validated);

        return redirect()->route('Frequencies.index')->with('success', 'Fréquence ajoutée avec succès.');
    }

    /**
     * Affiche une fréquence spécifique.
     */
    public function show(Frequence $frequence): Response
    {
        return Inertia::render('Frequencies/show', [
            'frequence' => $frequence,
        ]);
    }

    /**
     * Met à jour une fréquence existante.
     */
    public function update(Request $request, Frequence $frequence)
{
    // Vérifiez que l'ID est bien un nombre
    if (!is_numeric($frequence->id) || empty($frequence->id)) {
        return redirect()->back()->with('error', 'ID de fréquence invalide.');
    }

    $validated = $request->validate([
        'nom' => "required|string|max:255|unique:frequences,nom,".(int)$frequence->id,
        'code' => 'required|string|max:255', // Ajout du champ code manquant
        'days_interval' => 'required|integer',
        'date_debut' => 'nullable|date',
        'date_fin' => 'nullable|date',
    ]);

    $frequence->update($validated);

    return redirect()->route('Frequencies.index')->with('success', 'Fréquence mise à jour avec succès.');
}

    /**
     * Supprime une fréquence.
     */
    public function destroy(Frequence $frequence)
    {
        $frequence->delete();

        return redirect()->route('Frequencies.index')->with('success', 'Fréquence supprimée avec succès.');
    }
}

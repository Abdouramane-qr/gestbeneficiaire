<?php

namespace App\Http\Controllers;

use App\Models\Indicateur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndicateurController extends Controller
{
    /**
     * Display a listing of the indicators.
     */
    public function index(): Response
    {
        $indicateurs = Indicateur::paginate(10);

        return Inertia::render('Indicateurs/Indicateurs', [
            'indicateurs' => $indicateurs
        ]);
    }

    /**
     * Show the form for creating a new indicator.
     */
    public function create(): Response
    {
        return Inertia::render('Indicateurs/Create');
    }

    /**
     * Store a newly created indicator in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:indicateurs,nom',
            'categorie' => 'required|string|max:255',
            'description' => 'nullable|string',
            //'entreprise_id' => 'required|exists:entreprises,id'
        ]);

        Indicateur::create($validated);

        return redirect()->route('Indicateurs.index')->with('success', 'Indicateur créé avec succès.');
    }

    /**
     * Display the specified indicator.
     */
    public function show(Indicateur $indicateur): Response
    {
        return Inertia::render('Indicateurs/Show', [
            'indicateur' => $indicateur
        ]);
    }

    /**
     * Show the form for editing the specified indicator.
     */
    public function edit(Indicateur $indicateur): Response
    {
        return Inertia::render('Indicateurs/Edit', [
            'indicateur' => $indicateur
        ]);
    }

    /**
     * Update the specified indicator in storage.
     */
    public function update(Request $request, Indicateur $indicateur)
    {
        $validated = $request->validate([
            'nom' => "required|string|max:255|unique:indicateurs,nom,{$indicateur->id}",
            'categorie' => 'required|string|max:255',
            'description' => 'nullable|string',
            //'entreprise_id' => 'required|exists:entreprises,id'
        ]);

        $indicateur->update($validated);

        return redirect()->route('Indicateurs.index')->with('success', 'Indicateur mis à jour avec succès.');
    }

    /**
     * Remove the specified indicator from storage.
     */
    public function destroy(Indicateur $indicateur)
    {
        $indicateur->delete();
        return redirect()->route('Indicateurs.index')->with('success', 'Indicateur supprimé avec succès.');
    }
}

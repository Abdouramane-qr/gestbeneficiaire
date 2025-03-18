<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Beneficiaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EntrepriseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('entreprises', [
            'entreprises' => Entreprise::with('beneficiaire')->get() // Inclut les bénéficiaires associés
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Récupère la liste des bénéficiaires pour lier une entreprise à un bénéficiaire
        $beneficiaires = Beneficiaire::all();

        return Inertia::render('entreprises', [
            'beneficiaires' => $beneficiaires
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'beneficiaire_id' => 'required|exists:beneficiaires,id', // Assurer qu'un bénéficiaire existe
            'nom_entreprise' => 'required|string|max:255',
            'secteur_activite' => 'required|string|max:255',
            'date_creation' => 'required|date',
            'statut_juridique' => 'required|string|max:255',
            'adresse' => 'required|string|max:500',
            'ville' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        Entreprise::create($validated);

        return redirect()->back()->with('success', 'Entreprise ajoutée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $entreprise = Entreprise::with('beneficiaire')->findOrFail($id);

        return Inertia::render('entreprises', [
            'entreprise' => $entreprise
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Récupère l'entreprise à éditer et les bénéficiaires
        $entreprise = Entreprise::findOrFail($id);
        $beneficiaires = Beneficiaire::all();

        return Inertia::render('entreprises', [
            'entreprise' => $entreprise,
            'beneficiaires' => $beneficiaires
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $entreprise = Entreprise::findOrFail($id);

        $validated = $request->validate([
            'beneficiaire_id' => 'required|exists:beneficiaires,id', // Assurer qu'un bénéficiaire existe
            'nom_entreprise' => 'required|string|max:255',
            'secteur_activite' => 'required|string|max:255',
            'date_creation' => 'required|date',
            'statut_juridique' => 'required|string|max:255',
            'adresse' => 'required|string|max:500',
            'ville' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $entreprise->update($validated);

        return redirect()->back()->with('success', 'Entreprise mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->delete();

        return redirect()->back()->with('success', 'Entreprise supprimée avec succès.');
    }
}

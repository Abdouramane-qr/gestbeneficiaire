<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class BeneficiaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('beneficiaires', [
            'beneficiaires' => Beneficiaire::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Non utilisé car nous utilisons un modal dans le frontend
        // mais peut être utilisé pour afficher un formulaire dédié si nécessaire
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'sexe' => 'required|string|in:M,F',
            'contact' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'niveau_education' => 'required|string|max:255',
            'date_inscription' => 'required|date',
            'statut_actuel' => 'required|string|in:Actif,Inactif,En attente',
        ]);

        $beneficiaire = Beneficiaire::create($validated);

        return redirect()->back()->with('success', 'Bénéficiaire ajouté avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $beneficiaire = Beneficiaire::findOrFail($id);

        return Inertia::render('beneficiaires', [
            'beneficiaire' => $beneficiaire
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Non utilisé car nous utilisons un modal dans le frontend
        // mais peut être utilisé pour afficher un formulaire dédié si nécessaire
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $beneficiaire = Beneficiaire::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'sexe' => 'required|string|in:M,F',
            'contact' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'niveau_education' => 'required|string|max:255',
            'date_inscription' => 'required|date',
            'statut_actuel' => 'required|string|in:Actif,Inactif,En attente',
        ]);

        $beneficiaire->update($validated);

        return redirect()->back()->with('success', 'Bénéficiaire mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $beneficiaire = Beneficiaire::findOrFail($id);
        $beneficiaire->delete();

        return redirect()->back()->with('success', 'Bénéficiaire supprimé avec succès.');
    }
}

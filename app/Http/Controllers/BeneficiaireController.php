<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeneficiaireController extends Controller
{
    // 📌 Liste des bénéficiaires avec leurs ONG et institutions financières
    public function index()
    {
        $beneficiaires = Beneficiaire::with(['ong', 'institutionFinanciere'])
            ->orderBy('nom')
            ->get();

        //dd($beneficiaires); // 🔥 Vérifie si Laravel envoie bien les données


        return Inertia::render('Beneficiaires/beneficiaires', [
            //'beneficiaires' => $beneficiaires
            'beneficiaires' => Beneficiaire::with(['ong', 'institutionFinanciere'])->get(),
            'ongs'=>ONG::all(),
            'institutions'=>InstitutionFinanciere::all(),

        ]);
    }

    // 📌 Voir les détails d'un bénéficiaire avec toutes ses relations
    public function show(Beneficiaire $beneficiaire)
    {
        $beneficiaire->load(['ong', 'institutionFinanciere', 'entreprises', 'participationsFormations', 'financements']);

        return Inertia::render('Beneficiaires/Show', [
            'beneficiaire' => $beneficiaire
        ]);
    }

    // 📌 Stocker un bénéficiaire (Création)
    public function store(Request $request)
    {
        //dd($request->all()); // 🔹 Vérifie les données envoyées avant insertion


        $validated = $request->validate([
            'region' => 'required|string',
            'village' => 'nullable|string',
            'type_beneficiaire' => 'required|string',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'genre' => 'required|in:Homme,Femme',
            'handicap' => 'required|boolean',
            'contact' => 'required|string|max:20',
            'email' => 'nullable|email|unique:beneficiaires,email',
            'niveau_instruction' => 'required|string',
            'activite' => 'required|string',
            'domaine_activite' => 'required|string',
            'niveau_mise_en_oeuvre' => 'required|string',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institutions_financieres,id',
            'date_inscription' => 'nullable|date',
            'statut_actuel' => 'nullable|string',
        ]);

        Beneficiaire::create($validated);

        return redirect()->route('beneficiaires.index')->with('success', 'Bénéficiaire ajouté avec succès.');
    }

    // 📌 Mettre à jour un bénéficiaire
    public function update(Request $request, Beneficiaire $beneficiaire)
    {
        $validated = $request->validate([
            'region' => 'required|string',
            'village' => 'nullable|string',
            'type_beneficiaire' => 'required|string',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'genre' => 'required|in:Homme,Femme',
            'handicap' => 'required|boolean',
            'contact' => 'required|string|max:20',
            'email' => "nullable|email|unique:beneficiaires,email,{$beneficiaire->id}",
            'niveau_instruction' => 'required|string',
            'activite' => 'required|string',
            'domaine_activite' => 'required|string',
            'niveau_mise_en_oeuvre' => 'required|string',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institutions_financieres,id',
            'date_inscription' => 'nullable|date',
            'statut_actuel' => 'nullable|string',
        ]);

        $beneficiaire->update($validated);

        return redirect()->route('beneficiaires.index')->with('success', 'Bénéficiaire mis à jour.');
    }

    // 📌 Supprimer un bénéficiaire
    public function destroy(Beneficiaire $beneficiaire)
    {
        $beneficiaire->delete();
        return redirect()->route('beneficiaires.index')->with('success', 'Bénéficiaire supprimé.');
    }
}

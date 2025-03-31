<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Entreprise;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeneficiaireController extends Controller
{
    // 📌 Liste des bénéficiaires avec leurs ONG et institutions financières
    public function index()
    {

    $beneficiaires = Beneficiaire::with(['ong', 'institutionFinanciere', 'entreprise'])
            ->orderBy('nom')
            ->get();

        return Inertia::render('Beneficiaires/beneficiaires', [
            'beneficiaires' => $beneficiaires,
            'ongs' => ONG::select('id', 'nom')->get(),
            'institutions' => InstitutionFinanciere::select('id', 'nom')->get(),
            'entreprises' => Entreprise::select('id', 'nom_entreprise', 'secteur_activite')->get(),
        ]);
    }

    // 📌 Voir les détails d'un bénéficiaire avec toutes ses relations
    public function show(Beneficiaire $beneficiaire)
    {
        $beneficiaire->load(['ong', 'institutionFinanciere', 'entreprise']);

        dd($beneficiaire); // 🔎 Vérifie le contenu de l'objet

        return Inertia::render('Beneficiaires/Show', [
            
            'beneficiaire' => $beneficiaire
        ]);
    }

    // 📌 Stocker un bénéficiaire (Création)
    public function store(Request $request)
    {
        //dd($request->all()); // 🔹 Vérifie les données envoyées avant insertion



        $validated = $request->validate([
            'regions' => 'required|string',
            'provinces' => 'required|string',
            'communes' => 'required|string',
            'village' => 'nullable|string',
            'type_beneficiaire' => 'required|string',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'genre' => 'required|in:Homme,Femme',
            'handicap' => 'required|boolean',
            'entreprise_id' => 'nullable|exists:entreprises,id',
            'contact' => 'required|string|max:20',
            'email' => 'nullable|email|unique:beneficiaires,email',
            'niveau_instruction' => 'required|string',
            'activite' => 'required|string',
            'domaine_activite' => 'required|string',
            'niveau_mise_en_oeuvre' => 'required|string',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institution_financieres,id',
            'date_inscription' => 'required|date',
            'statut_actuel' => 'nullable|string',
        ]);


        // dd($validated);

        Beneficiaire::create($validated);


        return redirect()->route('beneficiaires.index')->with('success', 'Bénéficiaire ajouté avec succès.');
    }

    // 📌 Mettre à jour un bénéficiaire
    public function update(Request $request, Beneficiaire $beneficiaire)
    {


        $validated = $request->validate([
            'regions' => 'required|string',
            'provinces' => 'required|string',
            'communes' => 'required|string',
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
            'entreprise_id' => 'nullable|exists:entreprises,id',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institution_financieres,id',
            'date_inscription' => 'required|date',
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

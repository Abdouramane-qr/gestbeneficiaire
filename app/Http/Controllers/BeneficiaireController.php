<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Entreprise;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class BeneficiaireController extends Controller
{
    // 📌 Liste des bénéficiaires avec leurs ONG et institutions financières
    public function index()
    {

    $beneficiaires = Beneficiaire::with([ 'entreprises'])
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

    /**
 * Export a PDF document for beneficiaires
 */
public function export(Request $request)
{
    try {
        // Valider les paramètres de requête
        $validated = $request->validate([
            'format' => 'required|in:pdf',
            'beneficiaire_ids' => 'sometimes|array',
            'beneficiaire_ids.*' => 'integer|exists:beneficiaires,id',
            'search' => 'sometimes|string|max:100',
            'mode' => 'sometimes|string|in:detail,list',
        ]);

        // Si c'est un export détaillé d'un seul bénéficiaire
        if ($request->has('mode') && $request->input('mode') === 'detail'
            && $request->has('beneficiaire_ids') && count($request->input('beneficiaire_ids')) === 1) {

            $beneficiaireId = $request->input('beneficiaire_ids')[0];
            $beneficiaire = Beneficiaire::findOrFail($beneficiaireId);

            $filename = 'promoteur_detail_' . $beneficiaireId . '_' . date('Y-m-d_His');

            // Export en PDF pour un bénéficiaire détaillé
            return $this->exportDetailToPdf($beneficiaire, $filename);
        }

        // Export de liste (comportement par défaut)
        // Construire la requête de base
        $query = Beneficiaire::query();

        // Filtre de recherche
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('nom', 'like', "%{$searchTerm}%")
                    ->orWhere('prenom', 'like', "%{$searchTerm}%")
                    ->orWhere('contact', 'like', "%{$searchTerm}%")
                    ->orWhere('regions', 'like', "%{$searchTerm}%")
                    ->orWhere('type_beneficiaire', 'like', "%{$searchTerm}%");
            });
        }

        // Si des IDs spécifiques sont fournis, filtrer par ces IDs
        if ($request->has('beneficiaire_ids') && is_array($request->input('beneficiaire_ids'))) {
            $query->whereIn('id', $request->input('beneficiaire_ids'));
        }

        // Récupérer les bénéficiaires
        $beneficiaires = $query->orderBy('nom', 'asc')->get();

        // Nombre total de bénéficiaires à exporter
        $totalBeneficiaires = $beneficiaires->count();

        // Si aucun bénéficiaire trouvé, rediriger avec un message
        if ($totalBeneficiaires === 0) {
            return back()->with('error', 'Aucune donnée à exporter.');
        }

        $filename = 'promoteurs_' . date('Y-m-d_His');

        // Export en PDF pour une liste de bénéficiaires
        return $this->exportToPdf($beneficiaires, $filename);

    } catch (\Exception $e) {
        
        return back()->with('error', 'Une erreur est survenue lors de l\'export: ' . $e->getMessage());
    }
}

/**
 * Export les détails d'un bénéficiaire en PDF
 */
private function exportDetailToPdf($beneficiaire, $filename)
{
    $pdf = PDF::loadView('pdf.beneficiaire-details', [
        'beneficiaire' => $beneficiaire
    ]);

    return $pdf->download($filename . '.pdf');
}

/**
 * Export une liste de bénéficiaires en PDF
 */
private function exportToPdf($beneficiaires, $filename)
{
    $pdf = PDF::loadView('pdf.beneficiaires-list', [
        'beneficiaires' => $beneficiaires
    ]);

    return $pdf->download($filename . '.pdf');
}
}

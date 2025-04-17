<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use App\Models\Beneficiaire;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;


class EntrepriseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Entreprises/entreprises', [
            'entreprises' => Entreprise::with(['beneficiaire', 'ong', 'institutionFinanciere'])->get(),
            'beneficiaires' => Beneficiaire::all(),
            'ongs' => ONG::all(),
            'institutionsFinancieres' => InstitutionFinanciere::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'beneficiaires_id' => 'required|exists:beneficiaires,id',
            'nom_entreprise' => 'required|string|max:255',
            'secteur_activite' => 'required|string|in:Agriculture,Artisanat,Commerce,Élevage,Environnement',
            'date_creation' => 'required|date',
            'statut_juridique' => 'required|string|in:SARL,SA,SAS,SCS,SNC,GIE,SCP,SCI,Auto-entrepreneur',
            'adresse' => 'nullable|string|max:500',
            'ville' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'domaine_activite' => 'nullable|string|max:255',
            'niveau_mise_en_oeuvre' => 'nullable|string|in:Création,Renforcement',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institution_financieres,id',
        ]);

        Entreprise::create($validated);

        return redirect()->back()->with('success', 'Entreprise ajoutée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $entreprise = Entreprise::with(['beneficiaire', 'ong', 'institutionFinanciere'])->findOrFail($id);

        return Inertia::render('Entreprises/show', [
            'entreprise' => $entreprise,
            'beneficiaires' => Beneficiaire::all(),
            'ongs' => ONG::all(),
            'institutionsFinancieres' => InstitutionFinanciere::all()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $entreprise = Entreprise::with(['beneficiaire', 'ong', 'institutionFinanciere'])->findOrFail($id);

        // Ajouter ces relations pour le front-end
        $entrepriseData = [
           'id' => $entreprise->id,
            'beneficiaires_id' => $entreprise->beneficiaires_id,
            'nom_entreprise' => $entreprise->nom_entreprise,
            'secteur_activite' => $entreprise->secteur_activite,
            'date_creation' => $entreprise->date_creation,
            'statut_juridique' => $entreprise->statut_juridique,
            'adresse' => $entreprise->adresse,
            'ville' => $entreprise->ville,
            'pays' => $entreprise->pays,
            'description' => $entreprise->description,
            'domaine_activite' => $entreprise->domaine_activite,
            'niveau_mise_en_oeuvre' => $entreprise->niveau_mise_en_oeuvre,
            'ong_id' => $entreprise->ong_id,
            'institution_financiere_id' => $entreprise->institution_financiere_id
        ];

        return Inertia::render('Entreprises/entreprises', [
            'entreprise' => $entrepriseData,
            'beneficiaires' => Beneficiaire::all(),
            'ongs' => ONG::all(),
            'institutionsFinancieres' => InstitutionFinanciere::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $entreprise = Entreprise::findOrFail($id);

        $validated = $request->validate([
            'beneficiaires_id' => 'required|exists:beneficiaires,id',
            'nom_entreprise' => 'required|string|max:255',
            'secteur_activite' => 'required|string|in:Agriculture,Artisanat,Commerce,Élevage,Environnement',
            'date_creation' => 'required|date',
            'statut_juridique' => 'required|string|in:SARL,SA,SAS,SCS,SNC,GIE,SCP,SCI,Auto-entrepreneur',
            'adresse' => 'nullable|string|max:500',
            'ville' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'domaine_activite' => 'nullable|string|max:255',
            'niveau_mise_en_oeuvre' => 'nullable|string|in:Création,Renforcement',
            'ong_id' => 'nullable|exists:ongs,id',
            'institution_financiere_id' => 'nullable|exists:institution_financieres,id',
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


    /**
 * Export a PDF document for enterprises
 */
public function export(Request $request)
{
    try {
        // Valider les paramètres de requête
        $validated = $request->validate([
            'format' => 'required|in:pdf',
            'entreprise_ids' => 'sometimes|array',
            'entreprise_ids.*' => 'integer|exists:entreprises,id',
            'beneficiaire_id' => 'sometimes|integer|exists:beneficiaires,id',
            'search' => 'sometimes|string|max:100',
            'mode' => 'sometimes|string|in:detail,list',
        ]);

        // Si c'est un export détaillé d'une seule entreprise
        if ($request->has('mode') && $request->input('mode') === 'detail'
            && $request->has('entreprise_ids') && count($request->input('entreprise_ids')) === 1) {

            $entrepriseId = $request->input('entreprise_ids')[0];
            $entreprise = Entreprise::with(['beneficiaire', 'ong', 'institutionFinanciere'])->findOrFail($entrepriseId);

            $filename = 'entreprise_detail_' . $entrepriseId . '_' . date('Y-m-d_His');

            // Export en PDF pour une entreprise détaillée
            return $this->exportDetailToPdf($entreprise, $filename);
        }

        // Export de liste (comportement par défaut)
        // Construire la requête de base
        $query = Entreprise::with(['beneficiaire', 'ong', 'institutionFinanciere']);

        // Appliquer les filtres
        if ($request->has('beneficiaire_id')) {
            $query->where('beneficiaires_id', $request->input('beneficiaire_id'));
        }

        // Filtre de recherche
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('nom_entreprise', 'like', "%{$searchTerm}%")
                    ->orWhere('secteur_activite', 'like', "%{$searchTerm}%")
                    ->orWhere('ville', 'like', "%{$searchTerm}%")
                    ->orWhere('pays', 'like', "%{$searchTerm}%")
                    ->orWhereHas('beneficiaire', function($subQuery) use ($searchTerm) {
                        $subQuery->where('nom', 'like', "%{$searchTerm}%")
                                ->orWhere('prenom', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Si des IDs spécifiques sont fournis, filtrer par ces IDs
        if ($request->has('entreprise_ids') && is_array($request->input('entreprise_ids'))) {
            $query->whereIn('id', $request->input('entreprise_ids'));
        }

        // Récupérer les entreprises
        $entreprises = $query->orderBy('date_creation', 'desc')->get();

        // Nombre total d'entreprises à exporter
        $totalEntreprises = $entreprises->count();

        // Si aucune entreprise trouvée, rediriger avec un message
        if ($totalEntreprises === 0) {
            return back()->with('error', 'Aucune donnée à exporter.');
        }

        $filename = 'entreprises_' . date('Y-m-d_His');

        // Export en PDF pour une liste d'entreprises
        return $this->exportToPdf($entreprises, $filename);

    } catch (\Exception $e) {
       
        return back()->with('error', 'Une erreur est survenue lors de l\'export: ' . $e->getMessage());
    }
}

/**
 * Export les détails d'une entreprise en PDF
 */
private function exportDetailToPdf($entreprise, $filename)
{
    $pdf = PDF::loadView('pdf.entreprise-details', [
        'entreprise' => $entreprise
    ]);

    return $pdf->download($filename . '.pdf');
}

/**
 * Export une liste d'entreprises en PDF
 */
private function exportToPdf($entreprises, $filename)
{
    $pdf = PDF::loadView('pdf.entreprises-list', [
        'entreprises' => $entreprises
    ]);

    return $pdf->download($filename . '.pdf');
}
}

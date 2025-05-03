<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Entreprise;
use App\Models\ONG;
use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class BeneficiaireController extends Controller
{
    // 📌 Liste des bénéficiaires avec leurs ONG et institutions financières
    public function index()
{
    $user = auth()->user();

    // Base query
    $query = Beneficiaire::with(['entreprises']);

    // Filtrer selon le type d'utilisateur
    if ($user->type === 'coach' && $user->coach_id) {
        $query->whereHas('coaches', function($q) use ($user) {
            $q->where('coach_id', $user->coach_id)
              ->where('est_actif', true);
        });
    } elseif ($user->type === 'ong' && $user->ong_id) {
        $query->where('ong_id', $user->ong_id);
    } elseif ($user->type === 'institution' && $user->institution_id) {
        $query->where('institution_id', $user->institution_id);
    } elseif ($user->type === 'promoteur' && $user->beneficiaire_id) {
        $query->where('id', $user->beneficiaire_id);
    }

    $beneficiaires = $query->orderBy('nom')->get();

    return Inertia::render('Beneficiaires/beneficiaires', [
        'beneficiaires' => $beneficiaires,
        'ongs' => ONG::select('id', 'nom')->get(),
        'institutions' => InstitutionFinanciere::select('id', 'nom')->get(),
        'entreprises' => Entreprise::select('id', 'nom_entreprise', 'secteur_activite')->get(),
        'canCreate' => $user->hasPermission('promoteurs', 'create'),
        'canEdit' => $user->hasPermission('promoteurs', 'edit'),
        'canDelete' => $user->hasPermission('promoteurs', 'delete'),
    ]);
}

    // 📌 Voir les détails d'un bénéficiaire avec toutes ses relations
    public function show(Beneficiaire $beneficiaire)
    {
        $beneficiaire->load(['ong', 'institutionFinanciere', 'entreprises']);

        // dd($beneficiaire); // 🔎 Vérifie le contenu de l'objet

        return Inertia::render('Beneficiaires/Show', [
            'beneficiaire' => $beneficiaire
        ]);
    }

    // 📌 Stocker un bénéficiaire (Création)
    public function store(Request $request)
{
    //dd($request->all()); // 🔹 Vérifie les données envoyées avant insertion

    // Validation de base pour tous les types de bénéficiaires
    $baseRules = [
        'regions' => 'required|string',
        'provinces' => 'required|string',
        'communes' => 'required|string',
        'village' => 'nullable|string',
        'type_beneficiaire' => ['required', Rule::in(['Individuel', 'Coopérative', 'Autre'])],
        'contact' => 'required|string|max:20',
        'email' => 'nullable|email|unique:beneficiaires,email',
    ];

    // Règles conditionnelles selon le type de bénéficiaire
    if ($request->input('type_beneficiaire') === 'Individuel') {
        // Règles pour type Individuel
        $typeRules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'genre' => ['required', Rule::in(['Homme', 'Femme'])],
            'niveau_instruction' => 'required|string',
            'nom_cooperative' => 'nullable',
            'numero_enregistrement' => 'nullable',
        ];
    } elseif ($request->input('type_beneficiaire') === 'Coopérative') {
        // Règles pour type Coopérative
        $typeRules = [
            'nom_cooperative' => 'required|string|max:255',
            'numero_enregistrement' => 'required|string|max:255',
            'nom' => 'nullable|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'date_de_naissance' => 'nullable|date',
            'genre' => 'nullable',
            'niveau_instruction' => 'nullable|string',
        ];
    } else {
        // Règles pour type Autre
        $typeRules = [
            'nom' => 'required|string|max:255',
            'numero_enregistrement' => 'nullable|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'date_de_naissance' => 'nullable|date',
            'genre' => 'nullable',
            'niveau_instruction' => 'nullable|string',
            'nom_cooperative' => 'nullable',
        ];
    }

    // Fusion des règles de base et conditionnelles
    $rules = array_merge($baseRules, $typeRules);

    // Validation avec les règles combinées
    $validated = $request->validate($rules);

    // Solution pour l'erreur de contrainte "not null" sur la colonne "nom"
    if ($request->input('type_beneficiaire') === 'Coopérative' && empty($validated['nom']) && !empty($validated['nom_cooperative'])) {
        $validated['nom'] = $validated['nom_cooperative'];
    }

    Beneficiaire::create($validated);

    return redirect()->route('beneficiaires.index')->with('success', 'Promoteur ajouté avec succès.');
}

    // 📌 Mettre à jour un bénéficiaire
    public function update(Request $request, Beneficiaire $beneficiaire)
{
    // Validation de base pour tous les types de bénéficiaires
    $baseRules = [
        'regions' => 'required|string',
        'provinces' => 'required|string',
        'communes' => 'required|string',
        'village' => 'nullable|string',
        'type_beneficiaire' => ['required', Rule::in(['Individuel', 'Coopérative', 'Autre'])],
        'contact' => 'required|string|max:20',
        'email' => "nullable|email|unique:beneficiaires,email,{$beneficiaire->id}",
    ];

    // Règles conditionnelles selon le type de bénéficiaire
    if ($request->input('type_beneficiaire') === 'Individuel') {
        // Règles pour type Individuel
        $typeRules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_de_naissance' => 'required|date',
            'genre' => ['required', Rule::in(['Homme', 'Femme'])],
            'niveau_instruction' => 'required|string',
            'nom_cooperative' => 'nullable',
            'numero_enregistrement' => 'nullable',
        ];
    } elseif ($request->input('type_beneficiaire') === 'Coopérative') {
        // Règles pour type Coopérative
        $typeRules = [
            'nom_cooperative' => 'required|string|max:255',
            'numero_enregistrement' => 'required|string|max:255',
            'nom' => 'nullable|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'date_de_naissance' => 'nullable|date',
            'genre' => 'nullable',
            'niveau_instruction' => 'nullable|string',
        ];
    } else {
        // Règles pour type Autre
        $typeRules = [
            'nom' => 'required|string|max:255',
            'numero_enregistrement' => 'nullable|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'date_de_naissance' => 'nullable|date',
            'genre' => 'nullable',
            'niveau_instruction' => 'nullable|string',
            'nom_cooperative' => 'nullable',
        ];
    }

    // Fusion des règles de base et conditionnelles
    $rules = array_merge($baseRules, $typeRules);

    // Validation avec les règles combinées
    $validated = $request->validate($rules);

    // Solution pour l'erreur de contrainte "not null" sur la colonne "nom"
    if ($request->input('type_beneficiaire') === 'Coopérative' && empty($validated['nom']) && !empty($validated['nom_cooperative'])) {
        $validated['nom'] = $validated['nom_cooperative'];
    }

    $beneficiaire->update($validated);

    return redirect()->route('beneficiaires.index')->with('success', 'Promoteur mis à jour avec succès.');
}

    // 📌 Supprimer un bénéficiaire
    public function destroy(Beneficiaire $beneficiaire)
    {
        $beneficiaire->delete();
        return redirect()->route('beneficiaires.index')->with('success', 'Promoteur supprimé.');
    }

/**
     * Exporte les bénéficiaires au format PDF ou Excel
     *
     * @param Request $request
     * @return mixed
     */
    public function export(Request $request)
    {
        // Récupération des paramètres
        $format = $request->input('format', 'pdf');
        $mode = $request->input('mode', 'list');
        $beneficiaireIds = $request->input('beneficiaire_ids', []);
        $search = $request->input('search', '');
        $filterType = $request->input('filter_type', 'tous');

        // Récupération des bénéficiaires selon les critères
        $query = Beneficiaire::query();

        // Filtrer par ids si spécifiés
        if (!empty($beneficiaireIds)) {
            $query->whereIn('id', $beneficiaireIds);
        }

        // Appliquer le filtre de recherche si spécifié
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('regions', 'like', "%{$search}%")
                  ->orWhere('village', 'like', "%{$search}%");
            });
        }

        // Appliquer le filtre par type si ce n'est pas 'tous'
        if ($filterType !== 'tous') {
            $query->where('type_beneficiaire', $filterType);
        }

        // Récupérer les bénéficiaires
        $beneficiaires = $query->get();

        // Formatage de la date pour le nom du fichier
        $dateStr = now()->format('Y-m-d_H-i');

        // Export PDF
        if ($format === 'pdf') {
            // En mode détail avec un seul bénéficiaire
            if ($mode === 'detail' && count($beneficiaires) === 1) {
                // Utiliser la vue détail avec le premier bénéficiaire
                $beneficiaire = $beneficiaires->first();
                $title = "Détails du promoteur - {$beneficiaire->nom} {$beneficiaire->prenom}";
                $filename = "promoteur_" . Str::slug($beneficiaire->nom . "_" . $beneficiaire->prenom) . "_{$dateStr}.pdf";

                // Génération du PDF avec le bon nom de variable au singulier
                $pdf = PDF::loadView('pdf.beneficiaire_detail', [
                    'beneficiaire' => $beneficiaire,
                    'title' => $title,
                    'date' => now()->format('d/m/Y')
                ]);
            } else {
                // Mode liste pour plusieurs bénéficiaires
                $title = "Liste des promoteurs" . ($filterType !== 'tous' ? " - " . $filterType : "");
                $filename = "liste_promoteurs" . ($filterType !== 'tous' ? "_" . Str::slug($filterType) : "") . "_{$dateStr}.pdf";

                // Génération du PDF avec la variable au pluriel
                $pdf = PDF::loadView('pdf.beneficiaires_list', [
                    'beneficiaires' => $beneficiaires,
                    'title' => $title,
                    'date' => now()->format('d/m/Y'),
                    'filtres' => [
                        'type' => $filterType !== 'tous' ? $filterType : null,
                        'search' => $search ?: null
                    ]
                ]);
            }

            // Configuration du PDF
            $pdf->setPaper('a4');

            // Téléchargement du PDF
            return $pdf->download($filename);
        }

        // Pour d'autres formats (comme Excel), on peut ajouter d'autres méthodes d'export ici
        // mais elles seront gérées côté client avec SheetJS

        return redirect()->back()->with('error', 'Format d\'exportation non pris en charge.');
    }

    /**
     * Méthode pour générer les vues PDF
     * Cette méthode est accessible aux routes dédiées pour la génération de PDF
     */
    public function generatePdfView(Request $request, $id = null)
    {
        // Si un ID est fourni, c'est un détail sinon c'est une liste
        if ($id) {
            $beneficiaire = Beneficiaire::findOrFail($id);
            return view('pdf.beneficiaire_detail', [
                'beneficiaire' => $beneficiaire,
                'title' => "Détails du promoteur - {$beneficiaire->nom} {$beneficiaire->prenom}",
                'date' => now()->format('d/m/Y')
            ]);
        } else {
            // Pour la prévisualisation de la liste, on limite à 20 entrées
            $beneficiaires = Beneficiaire::take(20)->get();
            return view('pdf.beneficiaires_list', [
                'beneficiaires' => $beneficiaires,
                'title' => "Liste des promoteurs (aperçu)",
                'date' => now()->format('d/m/Y'),
                'filtres' => null
            ]);
        }
    }


}

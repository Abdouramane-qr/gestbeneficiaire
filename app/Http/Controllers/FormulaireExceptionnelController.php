<?php

namespace App\Http\Controllers;

use App\Models\Collecte;
use App\Models\Beneficiaire;
use App\Models\Entreprise;
use App\Models\Exercice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class FormulaireExceptionnelController extends Controller
{
    /**
     * Affiche le formulaire pour créer un nouveau formulaire exceptionnel
     */
    public function create()
    {
        // Récupérer la liste des bénéficiaires
        $beneficiaires = Beneficiaire::all();
        $exercices = Exercice::orderBy('annee', direction: 'desc')->get();

        return Inertia::render('collectes/Exception/create', [
            'beneficiaires' => $beneficiaires,
            'exercices' => $exercices
        ]);
    }

    /**
     * Stocke un nouveau formulaire exceptionnel
     */
    public function store(Request $request)
    {
        try {
            // Valider les données du formulaire
            $validated = $request->validate([
                'beneficiaires_id' => 'required|exists:beneficiaires,id',
                'type_collecte' => 'required|in:standard,brouillon',

                // Onglet 1: Occasionnel
                'formation_technique_recu' => 'boolean',
                'formations_techniques' => 'array|nullable',
                'formation_entrepreneuriat_recu' => 'boolean',
                'formations_entrepreneuriat' => 'array|nullable',

                // Onglet 2: Démarrage JEMII
                'appreciation_organisation_interne_demarrage' => 'nullable|min:0|max:3',
                'appreciation_services_adherents_demarrage' => 'nullable|min:0|max:3',
                'appreciation_relations_externes_demarrage' => 'nullable|min:0|max:3',
                'est_bancarise_demarrage' => 'boolean',

                // Onglet 3: Fin JEMII
                'appreciation_organisation_interne_fin' => 'nullable|min:0|max:3',
                'appreciation_services_adherents_fin' => 'nullable|min:0|max:3',
                'appreciation_relations_externes_fin' => 'nullable|min:0|max:3',
                'est_bancarise_fin' => 'boolean',
            ]);

            // Récupérer l'entreprise associée au bénéficiaire
            $beneficiaire = Beneficiaire::findOrFail($validated['beneficiaires_id']);
            $entreprise = Entreprise::where('beneficiaires_id', $beneficiaire->id)->first();

            if (!$entreprise) {
                return redirect()->back()->with('error', 'Aucune entreprise associée à ce bénéficiaire. Veuillez d\'abord créer une entreprise.');
            }

            // Créer la structure de données pour stocker dans le champ JSON
            $donnees = [
                'formulaire_exceptionnel' => [
                    // Informations du bénéficiaire pour référence
                    'beneficiaires_id' => $validated['beneficiaires_id'],
                    'beneficiaire_nom' => $beneficiaire->nom,
                    'beneficiaire_prenom' => $beneficiaire->prenom,

                    // Onglet 1: Occasionnel
                    'formation_technique_recu' => $validated['formation_technique_recu'] ?? false,
                    'formations_techniques' => $validated['formations_techniques'] ?? [],
                    'formation_entrepreneuriat_recu' => $validated['formation_entrepreneuriat_recu'] ?? false,
                    'formations_entrepreneuriat' => $validated['formations_entrepreneuriat'] ?? [],

                    // Onglet 2: Démarrage JEMII
                    'appreciation_organisation_interne_demarrage' => $validated['appreciation_organisation_interne_demarrage'] ?? 0,
                    'appreciation_services_adherents_demarrage' => $validated['appreciation_services_adherents_demarrage'] ?? 0,
                    'appreciation_relations_externes_demarrage' => $validated['appreciation_relations_externes_demarrage'] ?? 0,
                    'est_bancarise_demarrage' => $validated['est_bancarise_demarrage'] ?? false,

                    // Onglet 3: Fin JEMII
                    'appreciation_organisation_interne_fin' => $validated['appreciation_organisation_interne_fin'] ?? 0,
                    'appreciation_services_adherents_fin' => $validated['appreciation_services_adherents_fin'] ?? 0,
                    'appreciation_relations_externes_fin' => $validated['appreciation_relations_externes_fin'] ?? 0,
                    'est_bancarise_fin' => $validated['est_bancarise_fin'] ?? false,
                ]
            ];

            // Créer une nouvelle collecte de type "formulaire_exceptionnel"
            $collecte = new Collecte();
            $collecte->entreprise_id = $entreprise->id;
            $collecte->periode_id = null; // Pas de période pour les formulaires exceptionnels
            $collecte->periode = 'Occasionnelle'; // Marquer comme occasionnelle
            $collecte->type_collecte = $validated['type_collecte'];
            $collecte->date_collecte = Carbon::now();
            $collecte->user_id = Auth::id();
            $collecte->donnees = $donnees;
            $collecte->save();

            return redirect()->route('collectes.index', ['occasionnel' => 'true'])
                ->with('success', 'Formulaire exceptionnel enregistré avec succès.');

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'enregistrement du formulaire exceptionnel: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Une erreur est survenue: ' . $e->getMessage()]);
        }
    }

    /**
     * Affiche le formulaire exceptionnel spécifié
     */
    public function show(Collecte $collecte)
    {
        // Vérifier que c'est bien un formulaire exceptionnel
        if (!isset($collecte->donnees['formulaire_exceptionnel'])) {
            abort(404, 'Ce n\'est pas un formulaire exceptionnel');
        }

        return Inertia::render('collectes/Exception/Show', [
            'collecte' => $collecte,
            'beneficiaire' => Beneficiaire::find($collecte->donnees['formulaire_exceptionnel']['beneficiaires_id'])
        ]);
    }

    /**
     * Affiche le formulaire pour modifier un formulaire exceptionnel
     */
    public function edit(Collecte $collecte)
    {
        // Vérifier que c'est bien un formulaire exceptionnel
        if (!isset($collecte->donnees['formulaire_exceptionnel'])) {
            abort(404, 'Ce n\'est pas un formulaire exceptionnel');
        }

        $beneficiaires = Beneficiaire::all();
        $exercices = Exercice::orderBy('annee', 'desc')->get();

        return Inertia::render('collectes/Exception/', [
            'collecte' => $collecte,
            'beneficiaires' => $beneficiaires,
            'formulaireData' => $collecte->donnees['formulaire_exceptionnel']
        ]);
    }

    /**
     * Met à jour le formulaire exceptionnel spécifié
     */
    public function update(Request $request, Collecte $collecte)
    {
        try {
            // Vérifier que c'est bien un formulaire exceptionnel
            if (!isset($collecte->donnees['formulaire_exceptionnel'])) {
                abort(404, 'Ce n\'est pas un formulaire exceptionnel');
            }

            // Valider les données du formulaire
            $validated = $request->validate([
                'beneficiaires_id' => 'required|exists:beneficiaires,id',
                'type_collecte' => 'required|in:standard,brouillon',

                // Onglet 1: Occasionnel
                'formation_technique_recu' => 'boolean',
                'formations_techniques' => 'array|nullable',
                'formation_entrepreneuriat_recu' => 'boolean',
                'formations_entrepreneuriat' => 'array|nullable',

                // Onglet 2: Démarrage JEMII
                'appreciation_organisation_interne_demarrage' => 'integer|min:0|max:3',
                'appreciation_services_adherents_demarrage' => 'integer|min:0|max:3',
                'appreciation_relations_externes_demarrage' => 'integer|min:0|max:3',
                'est_bancarise_demarrage' => 'boolean',

                // Onglet 3: Fin JEMII
                'appreciation_organisation_interne_fin' => 'integer|min:0|max:3',
                'appreciation_services_adherents_fin' => 'integer|min:0|max:3',
                'appreciation_relations_externes_fin' => 'integer|min:0|max:3',
                'est_bancarise_fin' => 'boolean',
            ]);

            // Récupérer le bénéficiaire
            $beneficiaire = Beneficiaire::findOrFail($validated['beneficiaires_id']);

            // Mettre à jour les données du formulaire exceptionnel
            $formulaireData = $collecte->donnees;
            $formulaireData['formulaire_exceptionnel'] = [
                // Informations du bénéficiaire pour référence
                'beneficiaires_id' => $validated['beneficiaires_id'],
                'beneficiaire_nom' => $beneficiaire->nom,
                'beneficiaire_prenom' => $beneficiaire->prenom,

                // Onglet 1: Occasionnel
                'formation_technique_recu' => $validated['formation_technique_recu'] ?? false,
                'formations_techniques' => $validated['formations_techniques'] ?? [],
                'formation_entrepreneuriat_recu' => $validated['formation_entrepreneuriat_recu'] ?? false,
                'formations_entrepreneuriat' => $validated['formations_entrepreneuriat'] ?? [],

                // Onglet 2: Démarrage JEMII
                'appreciation_organisation_interne_demarrage' => $validated['appreciation_organisation_interne_demarrage'] ?? 0,
                'appreciation_services_adherents_demarrage' => $validated['appreciation_services_adherents_demarrage'] ?? 0,
                'appreciation_relations_externes_demarrage' => $validated['appreciation_relations_externes_demarrage'] ?? 0,
                'est_bancarise_demarrage' => $validated['est_bancarise_demarrage'] ?? false,

                // Onglet 3: Fin JEMII
                'appreciation_organisation_interne_fin' => $validated['appreciation_organisation_interne_fin'] ?? 0,
                'appreciation_services_adherents_fin' => $validated['appreciation_services_adherents_fin'] ?? 0,
                'appreciation_relations_externes_fin' => $validated['appreciation_relations_externes_fin'] ?? 0,
                'est_bancarise_fin' => $validated['est_bancarise_fin'] ?? false,
            ];

            // Mettre à jour l'exercice et le type de collecte
            $collecte->type_collecte = $validated['type_collecte'];
            $collecte->donnees = $formulaireData;
            $collecte->save();

            return redirect()->route('collectes.index', ['occasionnel' => 'true'])
                ->with('success', 'Formulaire exceptionnel mis à jour avec succès.');

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du formulaire exceptionnel: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Une erreur est survenue: ' . $e->getMessage()]);
        }
    }

    /**
     * Liste tous les formulaires exceptionnels
     */
    public function index()
    {
        // Récupérer les collectes de type formulaire exceptionnel
        $collectes = Collecte::whereNull('periode_id')
            ->where('periode', 'Occasionnelle')
            ->whereJsonContains('donnees->formulaire_exceptionnel', [])
            ->with(['entreprise',  'user'])
            ->orderBy('date_collecte', 'desc')
            ->paginate(10);

        return Inertia::render('collectes/Exception/FormulaireExceptionnelIndex', [
            'collectes' => $collectes,
            'beneficiaires' => Beneficiaire::all()
        ]);
    }
}

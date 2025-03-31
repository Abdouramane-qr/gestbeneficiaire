<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Collecte;
use App\Models\Entreprise;
use App\Models\Indicateur;
use App\Models\Frequence;

class CollecteController extends Controller
{
    
    public function index(): Response
    {
        $collectes = Collecte::with(['entreprise', 'indicateur', 'frequence'])
            ->orderBy('date_collecte', 'desc')
            ->paginate(10);
    
        // Récupération des listes pour les menus déroulants
        $entreprises = Entreprise::select('id', 'nom_entreprise')->get();
    
        // Chargement des indicateurs avec les relations nécessaires
        $indicateurs = Indicateur::with([
            'financier', 
            'social', 
            'activite', 
            'commercial', 
            'tresorerie'
        ])->get();
        
        // Pas besoin d'ajouter explicitement fields car on a ajouté $appends = ['fields']
        
        $frequences = Frequence::select('id', 'nom', 'code')->get();
    
        return Inertia::render('DataCollections/DataCollections', [
            'collectes' => $collectes,
            'entreprises' => $entreprises,
            'indicateurs' => $indicateurs,
            'frequences' => $frequences,
        ]);
    }
    /**
     * Liste toutes les collectes.
     */
    // public function index(): Response
    // {
    //     $collectes = Collecte::with(['entreprise', 'indicateur', 'frequence'])
    //         ->orderBy('date_collecte', 'desc')
    //         ->paginate(10);

    //     // Récupération des listes pour les menus déroulants
    //     $entreprises = Entreprise::select('id', 'nom_entreprise')->get();

    //     // Pour les indicateurs, nous utilisons l'accesseur fields
    //     //$indicateurs = Indicateur::all();
    //     $indicateurs = Indicateur::all()->map(function ($indicateur) {
    //         // Force l'accesseur fields à être inclus dans la sérialisation
    //         $indicateur->makeVisible(['fields']);
    //         $indicateur->append('fields');
    //         return $indicateur;
    //     });
    //     // Les champs sont automatiquement ajoutés grâce à l'accesseur getFieldsAttribute

    //     $frequences = Frequence::select('id', 'nom', 'code')->get();

    //     return Inertia::render('DataCollections/DataCollections', [
    //         'collectes' => $collectes,
    //         'entreprises' => $entreprises,
    //         'indicateurs' => $indicateurs,
    //         'frequences' => $frequences,
    //     ]);
    // }


/**
     * Affiche les détails d'une collecte spécifique
     */
    public function show(Collecte $collecte)
    {
        // Charger les relations nécessaires
        $collecte->load(['indicateur', 'frequence', 'entreprise']);
        
        return Inertia::render('DataCollections/Show', [
            'collecte' => $collecte,
        ]);
    }



    /**
     * Enregistre une nouvelle collecte.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'entreprise_id' => 'required|exists:entreprises,id',
            'indicateur_id' => 'required|exists:indicateurs,id',
            'date_collecte' => 'required|date',
            'frequence_id' => 'nullable|exists:frequences,id',
            'dynamicFields' => 'sometimes|array',
        ]);

        // Extraire les données des champs dynamiques
        $data = $request->input('dynamicFields', []);

        // Vérification des champs obligatoires
        $indicateur = Indicateur::findOrFail($validated['indicateur_id']);
        $fields = $indicateur->fields;
        
        foreach ($fields as $field) {
            if ($field['required'] && (!isset($data[$field['id']]) || $data[$field['id']] === '')) {
                return redirect()->back()
                    ->withErrors(['dynamicFields' => "Le champ {$field['label']} est obligatoire."])
                    ->withInput();
            }
        }

        // Créer la collecte avec les données
        $collecte = new Collecte();
        $collecte->entreprise_id = $validated['entreprise_id'];
        $collecte->indicateur_id = $validated['indicateur_id'];
       // $collecte->valeur = $validated['valeur'];
        $collecte->date_collecte = $validated['date_collecte'];
        $collecte->frequence_id = $validated['frequence_id'];
        $collecte->data = $data;
        $collecte->save();

        return redirect()->route('DataCollections.index')
            ->with('success', 'Collecte ajoutée avec succès.');
    }

    

     /**
     * Met à jour une collecte existante.
     */
    public function update(Request $request, Collecte $collecte)
    {
        $validated = $request->validate([
            'entreprise_id' => 'required|exists:entreprises,id',
            'indicateur_id' => 'required|exists:indicateurs,id',
            'date_collecte' => 'required|date',
            'frequence_id' => 'nullable|exists:frequences,id',
            'dynamicFields' => 'sometimes|array',
        ]);

        // Extraire les données des champs dynamiques
        $data = $request->input('dynamicFields', []);

        // Vérification des champs obligatoires
        $indicateur = Indicateur::findOrFail($validated['indicateur_id']);
        $fields = $indicateur->fields;
        
        foreach ($fields as $field) {
            if ($field['required'] && (!isset($data[$field['id']]) || $data[$field['id']] === '')) {
                return redirect()->back()
                    ->withErrors(['dynamicFields' => "Le champ {$field['label']} est obligatoire."])
                    ->withInput();
            }
        }

        // Mettre à jour le modèle
        $collecte->entreprise_id = $validated['entreprise_id'];
        $collecte->indicateur_id = $validated['indicateur_id'];
      //  $collecte->valeur = $validated['valeur'];
        $collecte->date_collecte = $validated['date_collecte'];
        $collecte->frequence_id = $validated['frequence_id'];
        $collecte->data = $data;
        $collecte->save();

        return redirect()->route('DataCollections.index')
            ->with('success', 'Collecte mise à jour avec succès.');
    }


       /**
     * Supprime une collecte
     */
    public function destroy(Collecte $collecte)
    {
        $collecte->delete();
        
        return redirect()->route('DataCollections.index')
            ->with('success', 'Collecte supprimée avec succès.');
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Indicateur;
use App\Models\Collecte;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class IndicateurController extends Controller
{
    /**
     * Affiche la liste des indicateurs.
     */
    public function index()
    {
        $indicateurs = Indicateur::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Indicateurs/index', [
            'indicateurs' => $indicateurs,
            'toast' => session('success') ? [
                'type' => 'success',
                'message' => session('success')
            ] : (session('error') ? [
                'type' => 'error',
                'message' => session('error')
            ] : null)
        ]);
    }

    /**
     * Affiche le formulaire de création d'un indicateur.
     * Note: Dans notre cas, nous utilisons un modal, donc cette méthode n'est pas utilisée.
     */
    public function create()
    {
        return Inertia::render('Indicateurs/create');
    }

    /**
     * Enregistre un nouvel indicateur.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'categorie' => 'required|string|max:50|unique:indicateurs,categorie',
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'fields' => 'required|array|min:1',
                'fields.*.id' => 'required|string',
                'fields.*.name' => 'required|string|max:255',
                'fields.*.type' => 'required|string|in:text,number,boolean,select,date,calculated',
                'fields.*.required' => 'required|boolean',
                'fields.*.options' => 'nullable|array',
                'fields.*.formula' => 'nullable|string',
            ]);

            // Debug log
            Log::info('Création d\'un nouvel indicateur', $validated);

            $indicateur = new Indicateur();
            $indicateur->categorie = $validated['categorie'];
            $indicateur->nom = $validated['nom'];
            $indicateur->description = $validated['description'] ?? null;

            // S'assurer que fields est en JSON
            $indicateur->fields = is_array($validated['fields'])
                ? json_encode($validated['fields'])
                : $validated['fields'];

            $indicateur->save();

            Log::info('Indicateur créé avec succès. ID: ' . $indicateur->id);

            return redirect()->route('indicateurs.index')->with('success', 'Indicateur créé avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de l\'indicateur: ' . $e->getMessage());

            return back()->withErrors(['general' => 'Une erreur est survenue lors de la création: ' . $e->getMessage()]);
        }
    }

    /**
     * Affiche les détails d'un indicateur.
     */
    public function show(Indicateur $indicateur)
    {
        // Compter le nombre de collectes associées à cet indicateur
        $collectesCount = Collecte::where('indicateur_id', $indicateur->id)->count();

        // Assurer que les fields sont en format tableau
        if (is_string($indicateur->fields)) {
            $indicateur->fields = json_decode($indicateur->fields, true);
        }

        return Inertia::render('Indicateurs/Show', [
            'indicateur' => $indicateur,
            'collectesCount' => $collectesCount,
            'toast' => session('success') ? [
                'type' => 'success',
                'message' => session('success')
            ] : null
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un indicateur.
     * Note: Dans notre cas, nous utilisons un modal, donc cette méthode n'est pas utilisée.
     */
    public function edit(Indicateur $indicateur)
    {
        // Assurer que les fields sont en format tableau
        if (is_string($indicateur->fields)) {
            $indicateur->fields = json_decode($indicateur->fields, true);
        }

        return Inertia::render('Indicateurs/Edit', [
            'indicateur' => $indicateur
        ]);
    }

    /**
     * Met à jour un indicateur existant.
     */
    public function update(Request $request, Indicateur $indicateur)
    {
        try {
            $validated = $request->validate([
                'categorie' => 'required|string|max:50|unique:indicateurs,categorie,' . $indicateur->id,
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'fields' => 'required|array|min:1',
                'fields.*.id' => 'required|string',
                'fields.*.name' => 'required|string|max:255',
                'fields.*.type' => 'required|string|in:text,number,boolean,select,date,calculated',
                'fields.*.required' => 'required|boolean',
                'fields.*.options' => 'nullable|array',
                'fields.*.formula' => 'nullable|string',
            ]);

            Log::info('Mise à jour de l\'indicateur ID: ' . $indicateur->id, $validated);

            $indicateur->categorie = $validated['categorie'];
            $indicateur->nom = $validated['nom'];
            $indicateur->description = $validated['description'] ?? null;

            // S'assurer que fields est en JSON
            $indicateur->fields = is_array($validated['fields'])
                ? json_encode($validated['fields'])
                : $validated['fields'];

            $indicateur->save();

            return redirect()->route('indicateurs.index')->with('success', 'Indicateur mis à jour avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'indicateur: ' . $e->getMessage());

            return back()->withErrors(['general' => 'Une erreur est survenue lors de la mise à jour: ' . $e->getMessage()]);
        }
    }

    /**
     * Supprime un indicateur.
     */
    public function destroy(Indicateur $indicateur)
    {
        try {
            // Vérifier s'il y a des collectes liées à cet indicateur
            $collectesCount = Collecte::where('indicateur_id', $indicateur->id)->count();

            if ($collectesCount > 0) {
                return back()->withErrors([
                    'general' => 'Impossible de supprimer cet indicateur car il est utilisé dans ' . $collectesCount . ' collecte(s).'
                ])->with('error', 'Impossible de supprimer cet indicateur car il est utilisé dans des collectes.');
            }

            $indicateur->delete();

            return redirect()->route('indicateurs.index')->with('success', 'Indicateur supprimé avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de l\'indicateur: ' . $e->getMessage());

            return back()->withErrors(['general' => 'Une erreur est survenue lors de la suppression: ' . $e->getMessage()]);
        }
    }
}

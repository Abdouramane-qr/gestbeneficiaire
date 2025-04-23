<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Coach;
use App\Models\ONG;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class CoachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coaches = Coach::with('ong')
        ->withCount(['beneficiaires as beneficiaires_actifs_count' => function ($query) {
            $query->where('coach_beneficiaires.est_actif', true);
        }])
        ->get();

        return Inertia::render('Coaches/Index', [
            'coaches' => $coaches,
            'ongs' => Ong::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:coaches,email',
            'telephone' => 'nullable|string|max:20',
            'ong_id' => 'required|exists:ongs,id',
            'specialite' => 'nullable|string|max:255',
            //'description' => 'nullable|string',
            'est_actif' => 'boolean',
            // 'date_debut' => 'nullable|date',
            // 'fin_contrat' => 'nullable|date',
        ]);

        Coach::create($validated);

        return redirect()->back()->with('success', 'Coach ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(Coach $coach)
    {
        $coach->load(['ong', 'beneficiaires' => function($query) {
            $query->withPivot('date_affectation', 'est_actif');
        }]);

        return Inertia::render('Coaches/Show', [
            'coach' => $coach,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coach $coach)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:coaches,email,' . $coach->id,
            'telephone' => 'nullable|string|max:20',
            'ong_id' => 'required|exists:ongs,id',
            'specialite' => 'nullable|string|max:255',
          // 'description' => 'nullable|string',
            'est_actif' => 'boolean',
            // 'date_debut' => 'nullable|date',
            // 'fin_contrat' => 'nullable|date',
        ]);

        $coach->update($validated);

        return redirect()->back()->with('success', 'Coach mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coach $coach)
    {
        $coach->delete();

        return redirect()->route('coaches.index')->with('success', 'Coach supprimé avec succès');
    }

    /**
     * Affecter des promoteurs à un coach
     */
    public function affecterPromoteurs(Request $request, Coach $coach)
    {
        $validated = $request->validate([
            'beneficiaires_id' => 'required|array',
            'beneficiaires_id.*' => 'exists:beneficiaires,id',
            'date_affectation' => 'required|date',
        ]);

        foreach ($validated['beneficiaires_id'] as $promoteurId) {
            // Vérifier si l'affectation existe déjà
            if ($coach->beneficiaires()->where('beneficiaires_id', $promoteurId)->exists()) {
                $coach->beneficiaires()->updateExistingPivot($promoteurId, [
                    'date_affectation' => $validated['date_affectation'],
                    'est_actif' => true,
                ]);
            } else {
                // Créer une nouvelle affectation
                $coach->beneficiaires()->attach($promoteurId, [
                    'date_affectation' => $validated['date_affectation'],
                    'est_actif' => true,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Promoteurs affectés avec succès');
    }

    /**
     * Désaffecter un promoteur d'un coach
     */
    public function desaffecterPromoteur(Coach $coach, $promoteurId)
    {
        $coach->beneficiaires()->updateExistingPivot($promoteurId, [
            'est_actif' => false,
        ]);

        return redirect()->back()->with('success', 'Promoteur désaffecté avec succès');
    }

    /**
     * Récupérer les promoteurs disponibles pour l'affectation
     */
   /*  public function getPromoteursDisponibles(Coach $coach)
    {
        // Récupérer tous les promoteurs qui ne sont pas activement affectés
        $promoteursDisponibles = Beneficiaire::whereDoesntHave('coaches', function ($query) {
            $query->wherePivot('est_actif', true);
        })
        ->orWhereHas('coaches', function ($query) use ($coach) {
            $query->where('coach_id', $coach->id);
        })
        ->get();

        return response()->json($promoteursDisponibles);
    } */


    public function getPromoteursDisponibles(Coach $coach)
{
    // Récupérer les IDs des bénéficiaires déjà affectés à des coachs (sauf au coach actuel)
    $beneficiairesAffectes = DB::table('coach_beneficiaires')
        ->where('coach_id', '!=', $coach->id)
        ->where('est_actif', true)
        ->pluck('beneficiaires_id');

    // Récupérer tous les bénéficiaires qui ne sont pas dans cette liste
    $beneficiairesDisponibles = Beneficiaire::whereNotIn('id', $beneficiairesAffectes)->get();
// Ajoutez ceci pour le débogage
\Log::info('Beneficiaires disponibles count: ' . $beneficiairesDisponibles->count());
\Log::info('Beneficiaires disponibles data: ' . $beneficiairesDisponibles);
    return response()->json($beneficiairesDisponibles);
}
}

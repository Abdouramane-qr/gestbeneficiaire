<?php

namespace App\Http\Controllers;

use App\Models\Beneficiaire;
use App\Models\Coach;
use App\Models\ONG;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class CoachController extends Controller
{
   /**
     * Afficher uniquement les coachs pertinents selon le rôle de l'utilisateur
     */
    public function index()
    {
        $user = Auth::user();
        $query = Coach::with('ong')
            ->withCount(['beneficiaires as beneficiaires_actifs_count' => function ($query) {
                $query->where('coach_beneficiaires.est_actif', true);
            }]);

        // Si c'est une ONG, ne montrer que les coachs de cette ONG
        if ($user->type === 'ong' && $user->ong_id) {
            $query->where('ong_id', $user->ong_id);
        }

        $coaches = $query->get();

        // Déterminer les ONGs à afficher selon les permissions
        $ongs = [];
        if ($user->hasPermission('ongs', 'view')) {
            $ongs = ONG::all();
        }

        return Inertia::render('Coaches/Index', [
            'coaches' => $coaches,
            'ongs' => $ongs,
            'canCreate' => $user->hasPermission('coaches', 'create'),
            'canEdit' => $user->hasPermission('coaches', 'edit'),
            'canDelete' => $user->hasPermission('coaches', 'delete'),
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
            'est_actif' => 'boolean',

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
            'est_actif' => 'boolean',

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
     * Récupérer les bénéficiaires selon le rôle de l'utilisateur
     */
     /**
 * Récupérer les promoteurs disponibles pour l'affectation
 */
public function getPromoteursDisponibles(Coach $coach)
{
    try {
        // Récupérer les IDs des bénéficiaires déjà affectés à des coachs (sauf au coach actuel)
        // mais uniquement ceux qui sont actifs
        $beneficiairesDejaAffectes = DB::table('coach_beneficiaires')
            ->where('coach_id', '<>', $coach->id) // utiliser '<>' au lieu de '!='
            ->where('est_actif', true)
            ->pluck('beneficiaires_id')
            ->toArray(); // Convertir en tableau pour garantir la compatibilité

        // Log des beneficiaires déjà affectés
        Log::info('Beneficiaires déjà affectés', [
            'coach_id' => $coach->id,
            'beneficiaires_affectes' => $beneficiairesDejaAffectes
        ]);

        // Récupérer tous les bénéficiaires qui ne sont pas dans cette liste
        // en sélectionnant seulement les champs nécessaires
        $query = Beneficiaire::query();

        if (!empty($beneficiairesDejaAffectes)) {
            $query->whereNotIn('id', $beneficiairesDejaAffectes);
        }

        $beneficiairesDisponibles = $query
            ->select('id', 'nom', 'prenom', 'contact')
            ->get();

        // Log des bénéficiaires disponibles
        Log::info('Bénéficiaires disponibles', [
            'count' => $beneficiairesDisponibles->count(),
            'ids' => $beneficiairesDisponibles->pluck('id')->toArray()
        ]);

        return response()->json($beneficiairesDisponibles);
    } catch (\Exception $e) {
        Log::error('Erreur dans getPromoteursDisponibles', [
            'coach_id' => $coach->id,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'Une erreur est survenue lors de la récupération des promoteurs disponibles',
            'error' => $e->getMessage()
        ], 500);
    }
}
    // public function getPromoteursDisponibles(Coach $coach)
    // {
    //     try {
    //         // Récupérer les IDs des bénéficiaires déjà affectés à des coachs (sauf au coach actuel)
    //         $beneficiairesAffectes = DB::table('coach_beneficiaires')
    //             ->where('coach_id', '!=', $coach->id)
    //             ->where('est_actif', true)
    //             ->pluck('beneficiaires_id');

    //         // Récupérer tous les bénéficiaires qui ne sont pas dans cette liste
    //         $beneficiairesDisponibles = Beneficiaire::whereNotIn('id', $beneficiairesAffectes)
    //             ->select('id', 'nom', 'prenom', 'contact')
    //             ->get();

    //         // Journalisation correcte pour le débogage
    //         \Log::info('Beneficiaires disponibles', [
    //             'count' => $beneficiairesDisponibles->count(),
    //             'coach_id' => $coach->id,
    //             'ids' => $beneficiairesDisponibles->pluck('id')->toArray()
    //         ]);

    //         return response()->json($beneficiairesDisponibles);
    //     } catch (\Exception $e) {
    //         // Journaliser l'erreur pour faciliter le débogage
    //         \Log::error('Erreur lors de la récupération des promoteurs disponibles', [
    //             'coach_id' => $coach->id,
    //             'error' => $e->getMessage(),
    //             'file' => $e->getFile(),
    //             'line' => $e->getLine()
    //         ]);

    //         return response()->json([
    //             'message' => 'Une erreur est survenue lors de la récupération des promoteurs disponibles',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

}

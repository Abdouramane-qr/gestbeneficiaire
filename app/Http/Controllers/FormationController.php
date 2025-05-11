<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FormationController extends Controller
{
    public function index()
    {
        try {
            $formations = Formation::where('actif', true)
                ->orderBy('type')
                ->orderBy('ordre')
                ->orderBy('libelle')
                ->get();

            return  Inertia ::render('Formations/Index', [
                'formations' => $formations,
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des formations: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue'], 500);
        }
    }

    public function getByType($type)
    {
        try {
            $formations = Formation::where('actif', true)
                ->where('type', $type)
                ->orderBy('ordre')
                ->orderBy('libelle')
                ->get();

            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des formations: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue'], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:technique,entrepreneuriat',
            'libelle' => [
                'required',
                'string',
                'max:255',
                Rule::unique('formations')->where(function ($query) use ($request) {
                    return $query->where('type', $request->type)
                                 ->where('actif', true);
                }),
            ],
        ]);

        try {
            $maxOrdre = Formation::where('type', $validated['type'])->max('ordre') ?? 0;

            $formation = Formation::create([
                'type' => $validated['type'],
                'libelle' => $validated['libelle'],
                'actif' => true,
                'ordre' => $maxOrdre + 10,
                'user_id' => auth()->id(),
            ]);

            return Inertia::render('Formations/Index', [
                'formations' => Formation::where('actif', true)
                    ->orderBy('type')
                    ->orderBy('ordre')
                    ->orderBy('libelle')
                    ->get(),
            ])->with('success', 'Formation créée avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la formation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);

        $validated = $request->validate([
            'libelle' => [
                'required',
                'string',
                'max:255',
                Rule::unique('formations')->where(function ($query) use ($request, $formation) {
                    return $query->where('type', $formation->type)
                                 ->where('actif', true)
                                 ->where('id', '!=', $formation->id);
                }),
            ],
        ]);

        try {
            $formation->update([
                'libelle' => $validated['libelle'],
                'user_id' => auth()->id(),
            ]);

            return Inertia::render('Formations/Index', [
                'formations' => Formation::where('actif', true)
                    ->orderBy('type')
                    ->orderBy('ordre')
                    ->orderBy('libelle')
                    ->get(),
            ])->with('success', 'Formation mise à jour avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la formation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise à jour de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $formation = Formation::findOrFail($id);
            $formation->update([
                'actif' => false,
                'user_id' => auth()->id()
            ]);

        return Inertia::render('Formations/Index', [
            'formations' => Formation::where('actif', true)
                ->orderBy('type')
                ->orderBy('ordre')
                ->orderBy('libelle')
                ->get(),
        ])->with('success', 'Formation supprimée avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la formation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la suppression de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

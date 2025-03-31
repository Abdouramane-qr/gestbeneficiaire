<?php

namespace App\Http\Controllers;

use App\Models\InstitutionFinanciere;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstitutionFinanciereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $institutions = InstitutionFinanciere::orderBy('nom')->paginate(10);

        return Inertia::render('InstitutionFinanciere/InstitutionsFinancieres', [
            'institutions' => $institutions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        InstitutionFinanciere::create($validated);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(InstitutionFinanciere $institutionFinanciere)
    {
        $institutionFinanciere->load('beneficiaires');

        return Inertia::render('InstitutionFinanciere/Show', [
            'institution' => $institutionFinanciere
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InstitutionFinanciere $institutionFinanciere)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $institutionFinanciere->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InstitutionFinanciere $institutionFinanciere)
    {
        // Vérifier si l'institution a des bénéficiaires
        if ($institutionFinanciere->beneficiaires()->count() > 0) {
            return redirect()->back()->with('error', 'Impossible de supprimer une institution qui possède des bénéficiaires.');
        }

        $institutionFinanciere->delete();

        return redirect()->route('InstitutionFinanciere.index');
    }
}

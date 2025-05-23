<?php

namespace App\Http\Controllers;

use App\Models\ONG;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ONGController extends Controller
{
    /**
     * Liste toutes les ONG.
     */
    public function index(): Response
    {
        $ongs = ONG::orderBy('nom', 'asc')->get();

        return Inertia::render('ongs/ong', [
            'ongs' => $ongs,
        ]);
    }

    /**
     * Enregistre une nouvelle ONG.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:ongs,nom',
            'description' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
        ]);

        ONG::create($validated);

        return redirect()->route('ong.index')->with('success', 'ONG ajoutée avec succès.');
    }

    /**
     * Affiche une ONG spécifique.
     */
    public function show(ONG $ong): Response
    {
        return Inertia::render('ongs/show', [
            'ong' => $ong,
        ]);
    }

    /**
     * Met à jour une ONG existante.
     */
    public function update(Request $request, ONG $ong)
    {
        $validated = $request->validate([
            'nom' => "required|string|max:255|unique:ongs,nom,{$ong->id}",
            'description' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',
        ]);

        $ong->update($validated);

        return redirect()->route('ong.index')->with('success', 'ONG mise à jour avec succès.');
    }

    /**
     * Supprime une ONG.
     */
    public function destroy(ONG $ong)
    {
        $ong->delete();

        return redirect()->route('ong.index')->with('success', 'ONG supprimée avec succès.');
    }
}

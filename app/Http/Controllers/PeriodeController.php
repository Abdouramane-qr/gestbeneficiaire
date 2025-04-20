<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use App\Models\Exercice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PeriodeController extends Controller
{
    /**
     * Affiche la liste des périodes.
     */
    public function index()
    {
        $periodes = Periode::with('exercice')
            ->orderBy('date_debut', 'desc')
            ->paginate(10);

        return Inertia::render('Periodes/Index', [
            'periodes' => $periodes,
            'exercices' => Exercice::where('actif', true)->get()
        ]);
    }

    /**
     * Affiche le formulaire de création d'une période.
     */
    public function create()
    {
        // Récupérer toutes les périodes existantes pour vérifier les disponibilités
        $periodesExistantes = Periode::select('id', 'exercice_id', 'type_periode', 'numero', 'nom')->get();

        return Inertia::render('Periodes/Form', [
            'exercices' => Exercice::where('actif', true)->get(),
            'typesPeriodes' => [
                'mensuel' => 'Mensuel',
                'trimestriel' => 'Trimestriel',
                'semestriel' => 'Semestriel',
                'annuel' => 'Annuel'
            ],
            'periodesExistantes' => $periodesExistantes
        ]);
    }

    /**
     * Enregistre une nouvelle période.
     */
    public function store(Request $request)
    {

        \Log::info('Données reçues : ', $request->all());

        $validator = Validator::make($request->all(), [
            'exercice_id' => 'required|exists:exercices,id',
            'code' => 'required|string|max:10|unique:periodes,code',
            'nom' => 'required|string|max:255',
            'type_periode' => 'required|in:mensuel,trimestriel,semestriel,annuel',
            'numero' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    // Vérifier que le numéro n'est pas déjà utilisé pour ce type de période dans cet exercice
                    $exists = Periode::where('exercice_id', $request->exercice_id)
                        ->where('type_periode', $request->type_periode)
                        ->where('numero', $value)
                        ->exists();

                    if ($exists) {
                        $fail("Ce numéro est déjà utilisé pour ce type de période dans cet exercice.");
                    }

                    // Vérifier que le numéro est valide pour le type de période
                    $maxNumero = match($request->type_periode) {
                        'mensuel' => 12,
                        'trimestriel' => 4,
                        'semestriel' => 2,
                        'annuel' => 1,
                        default => 0
                    };

                    if ($value > $maxNumero) {
                        $fail("Le numéro maximum pour ce type de période est $maxNumero.");
                    }
                }
            ],
            'date_debut' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request) {
                    $exercice = Exercice::findOrFail($request->exercice_id);
                    $dateDebut = Carbon::parse($value);
                    $exerciceDebut = Carbon::parse($exercice->date_debut);

                    if ($dateDebut->lt($exerciceDebut)) {
                        $fail("La date de début doit être postérieure ou égale à la date de début de l'exercice ({$exercice->date_debut}).");
                    }
                }
            ],
            'date_fin' => [
                'required',
                'date',
                'after:date_debut',
                function ($attribute, $value, $fail) use ($request) {
                    $exercice = Exercice::findOrFail($request->exercice_id);
                    $dateFin = Carbon::parse($value);
                    $exerciceFin = Carbon::parse($exercice->date_fin);

                    if ($dateFin->gt($exerciceFin)) {
                        $fail("La date de fin doit être antérieure ou égale à la date de fin de l'exercice ({$exercice->date_fin}).");
                    }
                }
            ],
        ]);

        // Si la validation échoue, renvoie automatiquement avec les erreurs
        if ($validator->fails()) {
            \Log::info($validator->errors()); // Enregistre les erreurs dans le fichier de log
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Créer la nouvelle période
        $periode = Periode::create($validator->validated());

        // Rediriger avec un message de succès
        return redirect()->route('periodes.index')
            ->with('success', 'Période créée avec succès.');
    }

    /**
     * Affiche le formulaire d'édition d'une période.
     */
    public function edit(Periode $periode)
    {
        // Récupérer toutes les périodes existantes pour vérifier les disponibilités
        $periodesExistantes = Periode::select('id', 'exercice_id', 'type_periode', 'numero', 'nom')->get();

        return Inertia::render('Periodes/Form', [
            'periode' => $periode,
            'exercices' => Exercice::all(),
            'typesPeriodes' => [
                'mensuel' => 'Mensuel',
                'trimestriel' => 'Trimestriel',
                'semestriel' => 'Semestriel',
                'annuel' => 'Annuel'
            ],
            'periodesExistantes' => $periodesExistantes
        ]);
    }

    /**
     * Met à jour une période existante.
     */
    public function update(Request $request, Periode $periode)
    {
        $validator = Validator::make($request->all(), [
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('periodes')->ignore($periode->id)
            ],
            'nom' => 'required|string|max:255',
            'date_debut' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($periode) {
                    $exercice = $periode->exercice;
                    $dateDebut = Carbon::parse($value);
                    $exerciceDebut = Carbon::parse($exercice->date_debut);

                    if ($dateDebut->lt($exerciceDebut)) {
                        $fail("La date de début doit être postérieure ou égale à la date de début de l'exercice ({$exercice->date_debut}).");
                    }
                }
            ],
            'date_fin' => [
                'required',
                'date',
                'after:date_debut',
                function ($attribute, $value, $fail) use ($periode) {
                    $exercice = $periode->exercice;
                    $dateFin = Carbon::parse($value);
                    $exerciceFin = Carbon::parse($exercice->date_fin);

                    if ($dateFin->gt($exerciceFin)) {
                        $fail("La date de fin doit être antérieure ou égale à la date de fin de l'exercice ({$exercice->date_fin}).");
                    }
                }
            ],
        ]);

        // Si la validation échoue, renvoie automatiquement avec les erreurs
        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Mettre à jour la période
        $periode->update($validator->validated());

        // Rediriger avec un message de succès
        return redirect()->route('periodes.index')
            ->with('success', 'Période mise à jour avec succès.');
    }

    /**
     * Affiche les détails d'une période.
     */
    public function show(Periode $periode)
    {
        $periode->load('exercice');

        return Inertia::render('Periodes/Index', [
            'periode' => [
                'id' => $periode->id,
                'exercice' => $periode->exercice,
                'code' => $periode->code,
                'nom' => $periode->nom,
                'type_periode' => $periode->type_periode,
                'numero' => $periode->numero,
                'date_debut' => $periode->date_debut->toDateString(),
                'date_fin' => $periode->date_fin->toDateString(),
            ]
        ]);
    }

    public function cloture(Periode $periode)
    {
        if (!$periode->canBeClosed()) {
            return back()->withErrors([
                'error' => 'Cette période ne peut pas être clôturée.'
            ]);
        }

        $periode->cloturee = true;
        $periode->save();

        return redirect()->route('periodes.index')->with('success', 'Période clôturée avec succès');
    }

      /**
     * Réouvre une période clôturée.
     */
    public function reouverture(Periode $periode)
    {
        if (!$periode->canBeReopened()) {
            return back()->withErrors([
                'error' => 'Cette période ne peut pas être rouverte.'
            ]);
        }

        $periode->cloturee = false;
        $periode->save();

        return redirect()->route('periodes.index')->with('success', 'Période réouverte avec succès');
    }


    /**
     * Supprime une période.
     */
    public function destroy(Periode $periode)
    {
        $periode->delete();

        return redirect()->route('periodes.index')
            ->with('success', 'Période supprimée avec succès.');
    }
}

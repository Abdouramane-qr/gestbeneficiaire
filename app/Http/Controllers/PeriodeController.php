<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use App\Models\Exercice;
use App\Models\Collecte;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PeriodeController extends Controller
{
    /**
     * Affiche la liste des périodes avec des statistiques.
     */
    public function index()
    {
        $periodes = Periode::with('exercice')
            ->orderBy('date_debut', 'desc')
            ->paginate(10);

        // Ajouter des statistiques simples
        $statistiques = [
            'totalPeriodes' => Periode::count(),
            'periodeCourante' => Periode::courantes()->first(),
            'prochainesPeriodes' => Periode::where('date_debut', '>', Carbon::now())
                ->orderBy('date_debut', 'asc')
                ->limit(3)
                ->get(),
            'historique' => $this->getPeriodesHistorique()
        ];

        return Inertia::render('Periodes/Index', [
            'periodes' => $periodes,
            'exercices' => Exercice::all(),
            'statistiques' => $statistiques
        ]);
    }

    /**
     * Obtenir l'historique des périodes par année
     */
    private function getPeriodesHistorique()
    {
        $historique = [];
        $lastFiveYears = Carbon::now()->subYears(5)->year;

        for ($year = Carbon::now()->year; $year >= $lastFiveYears; $year--) {
            $count = Periode::byYear($year)->count();
            $clotureCount = Periode::byYear($year)->where('cloturee', true)->count();

            if ($count > 0) {
                $historique[] = [
                    'annee' => $year,
                    'count' => $count,
                    'clotureCount' => $clotureCount
                ];
            }
        }

        return $historique;
    }

    /**
     * Affiche le formulaire de création d'une période.
     */
    public function create()
    {
        // Récupérer toutes les périodes existantes pour vérifier les disponibilités
        $periodesExistantes = Periode::select('id', 'exercice_id', 'type_periode', 'numero', 'nom')->get();

        // Récupérer tous les exercices actifs
        $exercices = Exercice::where('actif', true)->get();

        return Inertia::render('Periodes/Form', [
            'exercices' => $exercices,
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
        Log::info('Données reçues pour création de période : ', $request->all());

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
                    // Validation des limites selon le type de période
                    $maxNumero = match($request->type_periode) {
                        'mensuel' => 12,
                        'trimestriel' => 4,
                        'semestriel' => 2,
                        'annuel' => 1,
                        default => 0
                    };

                    if ($value > $maxNumero) {
                        $fail("Le numéro maximum pour {$request->type_periode} est {$maxNumero}.");
                    }

                    // Validation de l'unicité pour l'année
                    $periodeExiste = Periode::where('exercice_id', $request->exercice_id)
                        ->where('type_periode', $request->type_periode)
                        ->where('numero', $value)
                        ->exists();

                    if ($periodeExiste) {
                        $exercice = Exercice::find($request->exercice_id);
                        $annee = $exercice ? $exercice->annee : '';
                        $fail("La période '{$request->type_periode} {$value}' existe déjà pour l'année {$annee}.");
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

                    // Si la date de début est obligatoirement celle de l'exercice pour le premier semestre,
                    // nous pouvons la définir automatiquement
                    if ($request->type_periode === 'semestriel' && $request->numero == 1) {
                        return; // Ne pas valider, nous allons ajuster cette date lors de la création
                    }

                    if ($dateDebut->lt($exerciceDebut)) {
                        $fail("La date de début doit être postérieure ou égale à la date de début de l'exercice ({$exercice->date_debut}).");
                    }
                }
            ],
            'date_fin' => [
                'required',
                'date',
                'after_or_equal:date_debut',
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

        if ($validator->fails()) {
            Log::info('Erreurs de validation pour la période : ', $validator->errors()->toArray());
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Pour le premier semestre, définir la date de début à celle de l'exercice
        $validatedData = $validator->validated();
        if ($validatedData['type_periode'] === 'semestriel' && $validatedData['numero'] == 1) {
            $exercice = Exercice::find($validatedData['exercice_id']);
            $validatedData['date_debut'] = $exercice->date_debut;
        }

        try {
            DB::beginTransaction();

            // Créer la nouvelle période
            $periode = Periode::create($validatedData);

            // Journaliser la création
            Log::info('Période créée avec succès : ID ' . $periode->id);

            DB::commit();

            // Rediriger avec un message de succès
            return redirect()->route('periodes.index')
                ->with('success', 'Période créée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création de la période : ' . $e->getMessage());

            return back()
                ->withErrors(['error' => 'Une erreur est survenue lors de la création de la période. Veuillez réessayer.'])
                ->withInput();
        }
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
        Log::info('Données reçues pour mise à jour de période : ', $request->all());

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

                    // Exception pour le premier semestre
                    if ($periode->type_periode === 'semestriel' && $periode->numero == 1) {
                        return;
                    }

                    if ($dateDebut->lt($exerciceDebut)) {
                        $fail("La date de début doit être postérieure ou égale à la date de début de l'exercice ({$exercice->date_debut}).");
                    }

                    // Vérifier s'il y a des collectes pour cette période
                    $collectesExistantes = Collecte::where('periode_id', $periode->id)->exists();
                    if ($collectesExistantes && $dateDebut->ne(Carbon::parse($periode->date_debut))) {
                        $fail("Impossible de modifier la date de début car il existe déjà des collectes pour cette période.");
                    }
                }
            ],
            'date_fin' => [
                'required',
                'date',
                'after_or_equal:date_debut',
                function ($attribute, $value, $fail) use ($periode) {
                    $exercice = $periode->exercice;
                    $dateFin = Carbon::parse($value);
                    $exerciceFin = Carbon::parse($exercice->date_fin);

                    if ($dateFin->gt($exerciceFin)) {
                        $fail("La date de fin doit être antérieure ou égale à la date de fin de l'exercice ({$exercice->date_fin}).");
                    }

                    // Vérifier s'il y a des collectes pour cette période
                    $collectesExistantes = Collecte::where('periode_id', $periode->id)->exists();
                    if ($collectesExistantes && $dateFin->ne(Carbon::parse($periode->date_fin))) {
                        $fail("Impossible de modifier la date de fin car il existe déjà des collectes pour cette période.");
                    }
                }
            ],
        ]);

        if ($validator->fails()) {
            Log::info('Erreurs de validation pour la mise à jour de la période : ', $validator->errors()->toArray());
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            // Mettre à jour la période
            $periode->update($validator->validated());

            // Journaliser la mise à jour
            Log::info('Période mise à jour avec succès : ID ' . $periode->id);

            DB::commit();

            // Rediriger avec un message de succès
            return redirect()->route('periodes.index')
                ->with('success', 'Période mise à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour de la période : ' . $e->getMessage());

            return back()
                ->withErrors(['error' => 'Une erreur est survenue lors de la mise à jour de la période. Veuillez réessayer.'])
                ->withInput();
        }
    }

    /**
     * Affiche les détails d'une période.
     */
    public function show(Periode $periode)
    {
        $periode->load('exercice');

        // Ajouter des statistiques sur les collectes
        $collectesStats = [
            'total' => Collecte::where('periode_id', $periode->id)->count(),
            'validees' => Collecte::where('periode_id', $periode->id)->where('status', 'validee')->count(),
            'enCours' => Collecte::where('periode_id', $periode->id)->where('status', 'en_cours')->count(),
        ];

        return Inertia::render('Periodes/Show', [
            'periode' => [
                'id' => $periode->id,
                'exercice' => $periode->exercice,
                'code' => $periode->code,
                'nom' => $periode->nom,
                'type_periode' => $periode->type_periode,
                'numero' => $periode->numero,
                'date_debut' => $periode->date_debut->toDateString(),
                'date_fin' => $periode->date_fin->toDateString(),
                'cloturee' => $periode->cloturee,
                'formatted_dates' => $periode->formatted_dates,
                'duree_en_jours' => $periode->duree_en_jours,
                'est_active' => $periode->est_active,
                'is_current' => $periode->is_current,
            ],
            'collectesStats' => $collectesStats
        ]);
    }

    /**
     * Clôture une période.
     */
    public function cloture(Periode $periode)
    {
        try {
            DB::beginTransaction();

            // Vérifier s'il existe des collectes non validées
            $collectesNonValidees = Collecte::where('periode_id', $periode->id)
                ->where('status', '!=', 'validee')
                ->exists();

            if ($collectesNonValidees) {
                return back()->withErrors([
                    'error' => 'Impossible de clôturer cette période car il existe des collectes non validées.'
                ]);
            }

            // Utiliser la méthode de modèle pour clôturer la période
            if (!$periode->cloturer()) {
                return back()->withErrors([
                    'error' => 'Cette période ne peut pas être clôturée.'
                ]);
            }

            DB::commit();

            return redirect()->route('periodes.index')
                ->with('success', 'Période clôturée avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la clôture de la période : ' . $e->getMessage());

            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la clôture de la période. Veuillez réessayer.'
            ]);
        }
    }

    /**
     * Réouvre une période clôturée.
     */
    public function reouverture(Periode $periode)
    {
        try {
            DB::beginTransaction();

            // Utiliser la méthode de modèle pour rouvrir la période
            if (!$periode->rouvrir()) {
                return back()->withErrors([
                    'error' => 'Cette période ne peut pas être rouverte.'
                ]);
            }

            DB::commit();

            return redirect()->route('periodes.index')
                ->with('success', 'Période réouverte avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la réouverture de la période : ' . $e->getMessage());

            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la réouverture de la période. Veuillez réessayer.'
            ]);
        }
    }

    /**
     * Supprime une période.
     */
    public function destroy(Periode $periode)
    {
        try {
            DB::beginTransaction();

            // Vérifier si la période peut être supprimée
            if ($periode->collectes()->exists()) {
                return back()->withErrors([
                    'error' => 'Impossible de supprimer cette période car elle contient des collectes de données.'
                ]);
            }

            // Vérifier si la période est déjà clôturée
            if ($periode->cloturee) {
                return back()->withErrors([
                    'error' => 'Impossible de supprimer une période clôturée.'
                ]);
            }

            $periode->delete();

            DB::commit();

            return redirect()->route('periodes.index')
                ->with('success', 'Période supprimée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression de la période : ' . $e->getMessage());

            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la suppression de la période. Veuillez réessayer.'
            ]);
        }
    }

    /**
     * Obtenir les périodes disponibles pour un exercice et un type.
     */
    public function getPeriodesPourExercice(Request $request)
    {
        $request->validate([
            'exercice_id' => 'required|exists:exercices,id',
            'type_periode' => 'required|in:mensuel,trimestriel,semestriel,annuel'
        ]);

        $periodes = Periode::where('exercice_id', $request->exercice_id)
                          ->where('type_periode', $request->type_periode)
                          ->where('cloturee', false)
                          ->orderBy('numero')
                          ->get();

        return response()->json([
            'periodes' => $periodes
        ]);
    }

    /**
     * Obtenir la période courante active.
     */
    public function getPeriodeCourante()
    {
        $periode = Periode::courantes()->first();

        if (!$periode) {
            // Trouver la période la plus récente non clôturée
            $periode = Periode::where('cloturee', false)
                ->orderBy('date_fin', 'desc')
                ->first();
        }

        return response()->json([
            'periode' => $periode
        ]);
    }

    /**
     * Synchroniser les périodes avec les exercices.
     * Cette fonction utilitaire peut être appelée pour générer automatiquement
     * les périodes manquantes pour tous les exercices actifs.
     */
    public function synchroniserPeriodes()
    {
        if (!auth()->user()->hasRole('admin')) {
            return back()->withErrors([
                'error' => 'Vous n\'avez pas les droits pour effectuer cette action.'
            ]);
        }

        try {
            DB::beginTransaction();

            $exercicesActifs = Exercice::where('actif', true)->get();
            $periodesCreees = 0;

            foreach ($exercicesActifs as $exercice) {
                $typesPeriodes = ['annuel', 'semestriel', 'trimestriel', 'mensuel'];

                foreach ($typesPeriodes as $typePeriode) {
                    $maxNumero = match($typePeriode) {
                        'mensuel' => 12,
                        'trimestriel' => 4,
                        'semestriel' => 2,
                        'annuel' => 1,
                        default => 0
                    };

                    for ($numero = 1; $numero <= $maxNumero; $numero++) {
                        // Vérifier si cette période existe déjà
                        $periodeExiste = Periode::where('exercice_id', $exercice->id)
                            ->where('type_periode', $typePeriode)
                            ->where('numero', $numero)
                            ->exists();

                        if (!$periodeExiste) {
                            // Créer la période manquante
                            $labelsPeriodes = [
                                'mensuel' => [
                                    1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
                                    5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
                                    9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre'
                                ],
                                'trimestriel' => [
                                    1 => '1er Trimestre', 2 => '2e Trimestre',
                                    3 => '3e Trimestre', 4 => '4e Trimestre'
                                ],
                                'semestriel' => [
                                    1 => '1er Semestre', 2 => '2e Semestre'
                                ],
                                'annuel' => [1 => 'Année complète']
                            ];

                            $prefixeCodes = [
                                'mensuel' => 'M',
                                'trimestriel' => 'T',
                                'semestriel' => 'S',
                                'annuel' => 'A',
                            ];

                            // Générer les dates
                            $dates = $this->calculerDatesPeriode($exercice->annee, $typePeriode, $numero, $exercice);

                            if ($dates) {
                                Periode::create([
                                    'exercice_id' => $exercice->id,
                                    'code' => $prefixeCodes[$typePeriode] . $numero . '/' . substr($exercice->annee, -2),
                                    'nom' => $labelsPeriodes[$typePeriode][$numero],
                                    'type_periode' => $typePeriode,
                                    'numero' => $numero,
                                    'date_debut' => $dates['debut'],
                                    'date_fin' => $dates['fin'],
                                    'cloturee' => false
                                ]);

                                $periodesCreees++;
                            }
                        }
                    }
                }
            }

            DB::commit();

            return redirect()->route('periodes.index')
                ->with('success', $periodesCreees . ' nouvelles périodes ont été créées.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la synchronisation des périodes : ' . $e->getMessage());

            return back()->withErrors([
                'error' => 'Une erreur est survenue lors de la synchronisation des périodes. Veuillez réessayer.'
            ]);
        }
    }

    /**
     * Calculer les dates pour une période
     */
    private function calculerDatesPeriode($annee, $typePeriode, $numero, $exercice)
    {
        try {
            $exerciceDebut = Carbon::parse($exercice->date_debut);
            $exerciceFin = Carbon::parse($exercice->date_fin);

            switch ($typePeriode) {
                case 'mensuel':
                    $debut = Carbon::createFromDate($annee, $numero, 1);
                    $fin = $debut->copy()->endOfMonth();
                    break;

                case 'trimestriel':
                    $debut = Carbon::createFromDate($annee, (($numero - 1) * 3) + 1, 1);
                    $fin = $debut->copy()->addMonths(3)->subDay();
                    break;

                case 'semestriel':
                    if ($numero == 1) {
                        $debut = $exerciceDebut;
                    } else {
                        $debut = Carbon::createFromDate($annee, (($numero - 1) * 6) + 1, 1);
                    }

                    if ($numero == 2) {
                        $fin = $exerciceFin;
                    } else {
                        $fin = $debut->copy()->addMonths(6)->subDay();
                    }
                    break;

                case 'annuel':
                    $debut = $exerciceDebut;
                    $fin = $exerciceFin;
                    break;

                default:
                    return null;
            }

            // Ajuster les dates pour qu'elles ne dépassent pas les limites de l'exercice
            if ($debut->lt($exerciceDebut)) {
                $debut = $exerciceDebut->copy();
            }

            if ($fin->gt($exerciceFin)) {
                $fin = $exerciceFin->copy();
            }

            return [
                'debut' => $debut->format('Y-m-d'),
                'fin' => $fin->format('Y-m-d')
            ];
        } catch (\Exception $e) {
            Log::error("Erreur lors du calcul des dates : " . $e->getMessage());
            return null;
        }
    }
}

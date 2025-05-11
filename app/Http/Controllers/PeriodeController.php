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
     * Valide qu'une période n'est pas déjà utilisée pour la même année
     */
    private function periodeUniquePerYear($request, $attribute, $value, $fail, $excludeId = null)
    {
        // Récupérer l'exercice pour obtenir l'année
        $exercice = Exercice::find($request->exercice_id);
        if (!$exercice) return;

        // Construire la requête de vérification
        $query = Periode::where('exercice_id', $request->exercice_id)
            ->where('type_periode', $request->type_periode)
            ->where('numero', $value);

        // Exclure l'enregistrement actuel en cas de modification
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        // Vérifier si une période existe déjà
        if ($query->exists()) {
            $fail("La période '{$request->type_periode} {$value}' existe déjà pour l'exercice {$exercice->annee}. Les périodes peuvent être réutilisées uniquement lors du passage à une nouvelle année.");
        }
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Données reçues : ', $request->all());

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
                    $this->periodeUniquePerYear($request, $attribute, $value, $fail);
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

        if ($validator->fails()) {
            Log::info($validator->errors());
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Créer la nouvelle période
        $periode = Periode::create($validator->validated());

        return redirect()->route('periodes.index')
            ->with('success', 'Période créée avec succès.');
    }

    /**
     * Update the specified resource in storage.
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

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Mettre à jour la période
        $periode->update($validator->validated());

        return redirect()->route('periodes.index')
            ->with('success', 'Période mise à jour avec succès.');
    }

    /**
     * Récupère les périodes disponibles pour un exercice donné
     */
    public function getPeriodesDisponibles($exerciceId, $typePeriode)
    {
        // Déterminer le nombre maximum de périodes selon le type
        $maxNumero = match($typePeriode) {
            'mensuel' => 12,
            'trimestriel' => 4,
            'semestriel' => 2,
            'annuel' => 1,
            default => 0
        };

        // Récupérer les périodes déjà existantes
        $periodeUtilisees = Periode::where('exercice_id', $exerciceId)
            ->where('type_periode', $typePeriode)
            ->pluck('numero')
            ->toArray();

        // Générer les périodes disponibles
        $periodesDisponibles = [];
        for ($i = 1; $i <= $maxNumero; $i++) {
            $labels = [
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

            $periodesDisponibles[] = [
                'value' => $i,
                'label' => $labels[$typePeriode][$i] ?? $i,
                'disabled' => in_array($i, $periodeUtilisees)
            ];
        }

        return $periodesDisponibles;
    }

    /**
     * Clôturer une période et ouvrir automatiquement la suivante si possible
     */
    public function cloture(Periode $periode)
    {
        if (!$periode->canBeClosed()) {
            return back()->withErrors([
                'error' => 'Cette période ne peut pas être clôturée.'
            ]);
        }

        $periode->cloturee = true;
        $periode->save();

        // Logique pour ouvrir automatiquement la période suivante
        $this->ouvrirPeriodeSuivante($periode);

        return redirect()->route('periodes.index')->with('success', 'Période clôturée avec succès');
    }

    /**
     * Ouvre automatiquement la période suivante si elle existe
     */
    private function ouvrirPeriodeSuivante(Periode $periode)
    {
        $numeroSuivant = $periode->numero + 1;
        $typePeriode = $periode->type_periode;

        // Vérifier les limites selon le type
        $maxNumero = match($typePeriode) {
            'mensuel' => 12,
            'trimestriel' => 4,
            'semestriel' => 2,
            'annuel' => 1,
            default => 0
        };

        // Si on atteint la fin de l'année, passer à l'exercice suivant
        if ($numeroSuivant > $maxNumero) {
            $exerciceSuivant = Exercice::where('annee', '>', $periode->exercice->annee)
                ->where('actif', true)
                ->orderBy('annee')
                ->first();

            if ($exerciceSuivant) {
                $this->creerPeriodeSuivante($exerciceSuivant->id, $typePeriode, 1);
            }
        } else {
            // Créer la période suivante dans le même exercice
            $this->creerPeriodeSuivante($periode->exercice_id, $typePeriode, $numeroSuivant);
        }
    }

    /**
     * Crée automatiquement la période suivante
     */
    private function creerPeriodeSuivante($exerciceId, $typePeriode, $numero)
    {
        // Ne créer que si la période suivante n'existe pas déjà
        $existe = Periode::where('exercice_id', $exerciceId)
            ->where('type_periode', $typePeriode)
            ->where('numero', $numero)
            ->exists();

        if ($existe) {
            return;
        }

        $exercice = Exercice::find($exerciceId);
        if (!$exercice) return;

        // Générer automatiquement les données de la nouvelle période
        $nouvellePeriode = $this->genererDonneesPeriode($exercice, $typePeriode, $numero);

        if ($nouvellePeriode) {
            Periode::create($nouvellePeriode);
        }
    }

    /**
     * Génère automatiquement les données d'une période
     */
    private function genererDonneesPeriode($exercice, $typePeriode, $numero)
    {
        $annee = $exercice->annee;

        // Générer le code
        $prefixe = match($typePeriode) {
            'mensuel' => 'M',
            'trimestriel' => 'T',
            'semestriel' => 'S',
            'annuel' => 'A',
        };
        $code = "{$prefixe}{$numero}/" . substr($annee, -2);

        // Générer le nom
        $noms = [
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
        $nom = $noms[$typePeriode][$numero] ?? $numero;

        // Générer les dates
        $dates = $this->calculerDatesPeriode($annee, $typePeriode, $numero);

        if (!$dates) {
            return null;
        }

        return [
            'exercice_id' => $exercice->id,
            'code' => $code,
            'nom' => $nom,
            'type_periode' => $typePeriode,
            'numero' => $numero,
            'date_debut' => $dates['debut'],
            'date_fin' => $dates['fin'],
            'cloturee' => false
        ];
    }

    /**
     * Calcule automatiquement les dates de début et fin d'une période
     */
    private function calculerDatesPeriode($annee, $typePeriode, $numero)
    {
        try {
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
                    $debut = Carbon::createFromDate($annee, (($numero - 1) * 6) + 1, 1);
                    $fin = $debut->copy()->addMonths(6)->subDay();
                    break;

                case 'annuel':
                    $debut = Carbon::createFromDate($annee, 1, 1);
                    $fin = $debut->copy()->endOfYear();
                    break;

                default:
                    return null;
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;

class Periode extends Model
{
    protected $fillable = [
        'exercice_id',
        'code',
        'nom',
        'type_periode',
        'numero',
        'date_debut',
        'date_fin',
        'cloturee'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'cloturee' => 'boolean',
        'numero' => 'integer',
    ];

    protected $appends = [
        'annee',
        'formatted_dates',
        'is_current',
        'can_be_closed_enhanced',
        'can_be_reopened_enhanced',
        'duree_en_jours',
        'est_active',
        'type_periode_standard'
    ];

    // Relations
    public function exercice(): BelongsTo
    {
        return $this->belongsTo(Exercice::class);
    }

    public function collectes(): HasMany
    {
        return $this->hasMany(Collecte::class);
    }

    // Accesseurs existants
  public function getDureeEnJoursAttribute()
{
    if ($this->date_debut && $this->date_fin) {
        return $this->date_debut->diffInDays($this->date_fin);
    }

    // Retourner 0 ou une valeur par défaut si l'une des dates est null
    return 0;
}

    public function getEstActiveAttribute()
    {
        $now = now();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }

    /**
     * Obtenir l'année de la période
     */
    public function getAnneeAttribute(): int
    {
        return $this->exercice ? $this->exercice->annee : 0;
    }

   /**
 * Obtenir les dates formatées
 */
public function getFormattedDatesAttribute(): string
{
    $dateDebut = $this->date_debut ? $this->date_debut->format('d/m/Y') : 'Date de début non définie';
    $dateFin = $this->date_fin ? $this->date_fin->format('d/m/Y') : 'Date de fin non définie';

    return "Du {$dateDebut} au {$dateFin}";
}


    /**
     * Vérifier si c'est la période courante
     */
  public function getIsCurrentAttribute(): bool
{
    $today = Carbon::now();

    // Vérification que les dates ne sont pas nulles
    if ($this->date_debut && $this->date_fin) {
        return $today->between($this->date_debut, $this->date_fin) && !$this->cloturee;
    }

    // Si l'une des dates est nulle, retourner false
    return false;
}

    /**
     * Vérifier si la période peut être clôturée (version améliorée)
     */
    public function getCanBeClosedEnhancedAttribute(): bool
{
    if ($this->cloturee) {
        return false;
    }

    // Une période peut être clôturée si nous sommes après sa date de fin
    // ou si elle a des collectes validées
    $today = Carbon::now();

    // Vérification que la date de fin n'est pas null avant de comparer
    if ($this->date_fin && $today->gt($this->date_fin)) {
        return true;
    }

    // Vérifier s'il y a des collectes validées pour cette période
    $hasValidatedCollects = $this->collectes()
        ->where('status', 'validee')
        ->exists();

    return $hasValidatedCollects;
}


    /**
     * Vérifier si la période peut être réouverte (version améliorée)
     */
    public function getCanBeReopenedEnhancedAttribute(): bool
    {
        if (!$this->cloturee) {
            return false;
        }

        // Une période peut être réouverte si elle est clôturée,
        // que l'exercice n'est pas lui-même clôturé,
        // et que nous ne sommes pas trop loin de sa date de fin
        $today = Carbon::now();
        $daysSinceEnd = $today->diffInDays($this->date_fin);

        return !$this->exercice->cloture && $daysSinceEnd <= 30;
    }

    /**
     * Mappage du type de période vers un format standard
     */
    public function getTypePeriodeStandardAttribute(): string
    {
        $typeMap = [
            'Mensuel' => 'Mensuelle',
            'mensuel' => 'Mensuelle',
            'Trimestriel' => 'Trimestrielle',
            'trimestriel' => 'Trimestrielle',
            'Semestriel' => 'Semestrielle',
            'semestriel' => 'Semestrielle',
            'Annuel' => 'Annuelle',
            'annuel' => 'Annuelle',
            // Mappings directs
            'Trimestrielle' => 'Trimestrielle',
            'Semestrielle' => 'Semestrielle',
            'Annuelle' => 'Annuelle',
        ];

        return $typeMap[$this->type_periode] ?? $this->type_periode;
    }

    /**
     * Vérifier si la période peut être clôturée (version originale)
     */
    public function canBeClosed(): bool
    {
        // On peut clôturer une période si elle n'est pas déjà clôturée
        return !$this->cloturee;
    }

    /**
     * Vérifier si la période peut être rouverte (version originale)
     */
    public function canBeReopened(): bool
    {
        // On peut rouvrir une période si elle est clôturée
        // et que l'exercice auquel elle appartient n'est pas lui-même clôturé
        return $this->cloturee && !$this->exercice->cloture;
    }

    /**
     * Vérifier si la période est active (non clôturée)
     */
    public function isActive(): bool
    {
        return !$this->cloturee && $this->exercice && $this->exercice->actif;
    }

    /**
     * Clôturer la période
     */
    public function cloturer(): bool
    {
        if (!$this->can_be_closed_enhanced) {
            return false;
        }

        $this->cloturee = true;
        $saved = $this->save();

        // Générer automatiquement la période suivante
        if ($saved) {
            $this->generateNextPeriod();
        }

        return $saved;
    }

    /**
     * Réouvrir la période
     */
    public function rouvrir(): bool
    {
        if (!$this->can_be_reopened_enhanced) {
            return false;
        }

        $this->cloturee = false;
        return $this->save();
    }

    /**
     * Obtenir la période suivante
     */
    public function suivante(): ?Periode
    {
        // D'abord, chercher dans le même exercice
        $next = self::where('exercice_id', $this->exercice_id)
            ->where('type_periode', $this->type_periode)
            ->where('numero', $this->numero + 1)
            ->first();

        if ($next) {
            return $next;
        }

        // Si on atteint la fin de l'année, chercher dans l'exercice suivant
        if ($this->isLastPeriodOfYear()) {
            $nextExercice = $this->exercice->suivant();
            if ($nextExercice) {
                return self::where('exercice_id', $nextExercice->id)
                    ->where('type_periode', $this->type_periode)
                    ->where('numero', 1)
                    ->first();
            }
        }

        return null;
    }

    /**
     * Vérifier si c'est la dernière période de l'année
     */
    public function isLastPeriodOfYear(): bool
    {
        $maxNumero = match($this->type_periode) {
            'mensuel' => 12,
            'trimestriel' => 4,
            'semestriel' => 2,
            'annuel' => 1,
            default => 0
        };

        return $this->numero === $maxNumero;
    }

    /**
     * Generer automatiquement la période suivante
     */
    public function generateNextPeriod(): ?Periode
    {
        // Ne pas générer si la période actuelle n'est pas clôturée
        if (!$this->cloturee) {
            return null;
        }

        // Ne pas générer si la période suivante existe déjà
        if ($this->suivante()) {
            return null;
        }

        // Déterminer l'exercice et le numéro pour la période suivante
        $nextNumero = $this->numero + 1;
        $nextExerciceId = $this->exercice_id;

        if ($this->isLastPeriodOfYear()) {
            $nextExercice = $this->exercice->suivant();
            if (!$nextExercice) {
                return null; // Pas d'exercice suivant disponible
            }
            $nextExerciceId = $nextExercice->id;
            $nextNumero = 1;
        }

        // Générer automatiquement les données de la nouvelle période
        $nextPeriode = $this->generatePeriodData($nextExerciceId, $nextNumero);

        if ($nextPeriode) {
            return self::create($nextPeriode);
        }

        return null;
    }

    /**
     * Générer les données pour une nouvelle période
     */
    private function generatePeriodData(int $exerciceId, int $numero): ?array
    {
        $exercice = Exercice::find($exerciceId);
        if (!$exercice) {
            return null;
        }

        // Générer le code
        $prefix = match($this->type_periode) {
            'mensuel' => 'M',
            'trimestriel' => 'T',
            'semestriel' => 'S',
            'annuel' => 'A',
        };
        $code = "{$prefix}{$numero}/" . substr($exercice->annee, -2);

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
        $nom = $noms[$this->type_periode][$numero] ?? $numero;

        // Générer les dates
        $dates = $this->calculatePeriodDates($exercice->annee, $numero);

        if (!$dates) {
            return null;
        }

        return [
            'exercice_id' => $exerciceId,
            'code' => $code,
            'nom' => $nom,
            'type_periode' => $this->type_periode,
            'numero' => $numero,
            'date_debut' => $dates['debut'],
            'date_fin' => $dates['fin'],
            'cloturee' => false
        ];
    }

    /**
     * Calculer les dates pour une période
     */
    private function calculatePeriodDates(int $annee, int $numero): ?array
    {
        try {
            switch ($this->type_periode) {
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

    /**
     * Vérifier qu'une période est unique pour l'année donnée
     */
    public static function isPeriodUniqueForYear($exerciceId, $typePeriode, $numero, $excludeId = null): bool
    {
        $query = self::where('exercice_id', $exerciceId)
            ->where('type_periode', $typePeriode)
            ->where('numero', $numero);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return !$query->exists();
    }

    /**
     * Obtenir toutes les périodes disponibles pour un exercice et un type
     */
    public static function getAvailablePeriodsForExercice($exerciceId, $typePeriode): array
    {
        $maxNumero = match($typePeriode) {
            'mensuel' => 12,
            'trimestriel' => 4,
            'semestriel' => 2,
            'annuel' => 1,
            default => 0
        };

        $usedPeriods = self::where('exercice_id', $exerciceId)
            ->where('type_periode', $typePeriode)
            ->pluck('numero')
            ->toArray();

        $available = [];
        for ($i = 1; $i <= $maxNumero; $i++) {
            if (!in_array($i, $usedPeriods)) {
                $available[] = $i;
            }
        }

        return $available;
    }

    /**
     * Scope pour obtenir les périodes d'une année spécifique
     */
    public function scopeByYear($query, int $year)
    {
        return $query->whereHas('exercice', function ($q) use ($year) {
            $q->where('annee', $year);
        });
    }

    /**
     * Scope pour obtenir les périodes non clôturées
     */
    public function scopeNonClôturées($query)
    {
        return $query->where('cloturee', false);
    }

    /**
     * Scope pour obtenir les périodes courantes
     */
    public function scopeCourantes($query)
    {
        $today = Carbon::now();
        return $query->where('date_debut', '<=', $today)
            ->where('date_fin', '>=', $today)
            ->where('cloturee', false);
    }

    /**
     * Scope pour obtenir les périodes par type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type_periode', $type);
    }

    /**
     * Scope pour obtenir les périodes actives
     */
    public function scopeActives($query)
    {
        return $query->nonClôturées()
            ->whereHas('exercice', function ($q) {
                $q->where('actif', true);
            });
    }

    /**
     * Obtenir le label complet de la période
     */
    public function getFullLabel(): string
    {
        $exerciceAnnee = $this->exercice ? $this->exercice->annee : '';
        return "{$this->nom} {$exerciceAnnee}";
    }

    /**
     * Obtenir l'ordre logique de la période pour l'affichage
     */
    public function getOrderAttribute(): int
    {
        $exerciceAnnee = $this->exercice ? $this->exercice->annee : 0;

        // Convertir l'année en nombre de base 10000 et ajouter le numéro
        return ($exerciceAnnee * 100) + $this->numero;
    }
}

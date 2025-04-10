<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'cloturee' => 'boolean'
    ];

    // Relations
    public function exercice()
    {
        return $this->belongsTo(Exercice::class);
    }

    public function collectes()
    {
        return $this->hasMany(Collecte::class);
    }

    // Accesseur pour obtenir la durée en jours
    public function getDureeEnJoursAttribute()
    {
        return $this->date_debut->diffInDays($this->date_fin);
    }

    // Accesseur pour savoir si la période est active
    public function getEstActiveAttribute()
    {
        $now = now();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }



   

    /**
     * Vérifier si la période peut être clôturée
     */
    public function canBeClosed(): bool
    {
        // On peut clôturer une période si elle n'est pas déjà clôturée
        return !$this->cloturee;
    }

    /**
     * Vérifier si la période peut être rouverte
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
}

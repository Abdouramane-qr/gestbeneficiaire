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
}

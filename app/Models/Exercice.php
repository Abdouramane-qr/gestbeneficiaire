<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercice extends Model
{
    protected $fillable = [
        'annee',
        'date_debut',
        'date_fin',
        'actif',
        'description'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'actif' => 'boolean'
    ];

    // Relations
    public function periodes()
    {
        return $this->hasMany(Periode::class);
    }

    public function collectes()
    {
        return $this->hasMany(Collecte::class);
    }

    // Mutateur pour activer automatiquement l'exercice si c'est le seul
    protected static function booted()
    {
        static::created(function ($exercice) {
            if (Exercice::count() === 1) {
                $exercice->actif = true;
                $exercice->save();
            }
        });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiaire extends Model
{
    protected $fillable = [
        'regions',
        'provinces',
        'communes',
        'village',
        'type_beneficiaire',
        'nom',
        'prenom',
        'date_de_naissance',
        'genre',
        'handicap',
        'contact',
        'niveau_instruction',
        'email',
    ];

    protected $casts = [
        'date_de_naissance' => 'date',
        'handicap' => 'boolean',
    ];

    // Un bénéficiaire peut avoir plusieurs entreprises
    public function entreprises()
    {
        return $this->hasMany(Entreprise::class, 'beneficiaires_id');
    }

    // Accesseur pour obtenir le nom complet du bénéficiaire
    public function getNomCompletAttribute()
    {
        return $this->nom . ' ' . $this->prenom;
    }
}

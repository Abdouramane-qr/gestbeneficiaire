<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiaire extends Model
{
    protected $fillable = ['nom', 'prenom', 'date_de_naissance', 'sexe', 'contact', 'email',
        'adresse', 'niveau_education', 'date_inscription', 'statut_actuel'];

            // Relation avec Entreprise
            public function entreprises()
            {
                return $this->hasMany(Entreprise::class);
            }
    // Relation avec ParticipationFormation

    public function participationsFormations()
    {
        return $this->hasMany(ParticipationFormation::class);
    }

    // Relation avec Financement

    public function financements()
    {
        return $this->hasMany(Financement::class);
    }
};

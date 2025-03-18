<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiaire extends Model
{
    protected $fillable = [
        'region',
        'village',
        'type_beneficiaire',
        'nom',
        'prenom',
        'date_de_naissance',
        'genre',
        'handicap',
        'contact',
        'email',
        'niveau_instruction',
        'activite',
        'domaine_activite',
        'niveau_mise_en_oeuvre',
        'ong_id',
        'institution_financiere_id',
        'date_inscription',
        'statut_actuel'
    ];
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
    // 🔹 Un Promoteur appartient à une ONG
    public function ong()
    {
        return $this->belongsTo(ONG::class);
    }
    // 🔹 Un Promoteur appartient à une Institution Financière
    public function institutionFinanciere()
    {
        return $this->belongsTo(InstitutionFinanciere::class);
    }
    protected $casts = [
        'handicap' => 'boolean',
        'date_de_naissance' => 'date',
    ];
};

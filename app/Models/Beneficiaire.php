<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beneficiaire extends Model
{
    protected $fillable = [
        'regions', 'provinces', 'communes', 'village', 'type_beneficiaire','entreprise_id',
        'nom', 'prenom', 'date_de_naissance', 'genre', 'handicap', 'contact',
        'email', 'niveau_instruction', 'activite', 'domaine_activite', 'niveau_mise_en_oeuvre',
        'ong_id', 'institution_financiere_id', 'date_inscription', 'statut_actuel'
    ];



    public function entreprise()
{
    return $this->hasMany(Entreprise::class, 'beneficiaires_id');
}


    // Relation avec ONG
    public function ong()
    {
        return $this->belongsTo(ONG::class);
    }

    // Relation avec Institution Financière
    public function institutionFinanciere()
    {
        return $this->belongsTo(InstitutionFinanciere::class, 'institution_financiere_id');
    }


    protected $casts = [
        'handicap' => 'boolean',
        'date_de_naissance' => 'date',
        'date_inscription' => 'date',

    ];
};

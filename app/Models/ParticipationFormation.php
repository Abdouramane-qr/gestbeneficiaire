<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipationFormation extends Model
{
    protected $fillable = [
        'beneficiaire_id', 'formation_id', 'date_participation', 'resultat_obtenu'
    ];

    // Relation avec Beneficiaire
    public function beneficiaire()
    {
        return $this->belongsTo(Beneficiaire::class);
    }

    // Relation avec Formation
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}

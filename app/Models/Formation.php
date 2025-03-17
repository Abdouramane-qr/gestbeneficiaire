<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    protected $fillable = ['titre', 'description', 'date_debut', 'date_fin', 'organisateur'];

    // Relation avec ParticipationFormation
    public function participations()
    {
        return $this->hasMany(ParticipationFormation::class);
    }
}

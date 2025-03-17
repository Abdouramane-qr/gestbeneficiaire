<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceEntreprise extends Model
{
    protected $fillable = [
        'entreprise_id', 'annee', 'chiffre_affaires', 'benefice', 'nombre_employes', 'autres_indicateurs'
    ];

    // Relation avec Entreprise
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }
}

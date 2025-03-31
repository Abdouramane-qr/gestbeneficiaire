<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndicateurSocial extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicateur_id',
        'entreprise_id',
        'nombre_employes',
        'nombre_stagiaires',
        'nombre_nouveaux_recrutements',
        'nombre_depart',
        'taux_renouvellement_effectifs'
    ];

    protected $table = 'indicateur_sociaux';
    
    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class, 'indicateur_id');
    }

    public function entreprise() {
        return $this->belongsTo(Entreprise::class);
    }
}

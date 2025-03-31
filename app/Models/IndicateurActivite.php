<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndicateurActivite extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicateur_id',
        'entreprise_id',
        'nombre_cycles_production',
        'nombre_clients',
        'taux_croissance_clients',
        'chiffre_affaires',
        'taux_croissance_ca'
    ];
    protected $table = 'indicateur_activites';

    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class, 'indicateur_id');
    }

    public function entreprise() {
        return $this->belongsTo(Entreprise::class);
    }
}

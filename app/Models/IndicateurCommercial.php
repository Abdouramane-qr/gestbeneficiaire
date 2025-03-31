<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndicateurCommercial extends Model
{
    use HasFactory;

    protected $fillable = [
        'indicateur_id',
        'entreprise_id',
        'nombre_clients_prospectes',
        'nombre_nouveaux_clients',
        'nombre_commandes'
    ];
    protected $table = 'indicateur_commerciaux';

    public function indicateur()
    {
        return $this->belongsTo(Indicateur::class, 'indicateur_id');
    }
    public function entreprise() {
        return $this->belongsTo(Entreprise::class);
    }
}

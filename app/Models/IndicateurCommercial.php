<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicateurCommercial extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_id',
        'nombre_clients',
        'nouveaux_clients',
        'taux_retention',
        'panier_moyen',
        'delai_paiement_moyen',
        'export_pourcentage',
        'top_5_clients_pourcentage',
        'backlog',
        'carnet_commandes'
    ];

    /**
     * Obtenir le rapport associé aux indicateurs commerciaux.
     */
    public function rapport(): BelongsTo
    {
        return $this->belongsTo(Rapport::class);
    }
}

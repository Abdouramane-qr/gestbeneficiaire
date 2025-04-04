<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicateurProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_id',
        'taux_utilisation',
        'taux_rebut',
        'delai_production_moyen',
        'cout_production',
        'stock_matieres_premieres',
        'stock_produits_finis',
        'rotation_stocks',
        'incidents_qualite',
        'certifications'
    ];

    /**
     * Obtenir le rapport associé aux indicateurs de production.
     */
    public function rapport(): BelongsTo
    {
        return $this->belongsTo(Rapport::class);
    }
}

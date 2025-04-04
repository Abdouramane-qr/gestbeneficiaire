<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicateurRH extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapport_id',
        'effectif_total',
        'cadres_pourcentage',
        'turnover',
        'absenteisme',
        'masse_salariale',
        'cout_formation',
        'anciennete_moyenne',
        'accidents_travail',
        'index_egalite'
    ];

    /**
     * Obtenir le rapport associé aux indicateurs RH.
     */
    public function rapport(): BelongsTo
    {
        return $this->belongsTo(Rapport::class);
    }
}

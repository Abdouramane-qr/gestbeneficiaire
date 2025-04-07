<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\IndicateurFinancier;
use App\Models\IndicateurCommercial;
use App\Models\IndicateurProduction;
use App\Models\IndicateurRH;




class Rapport extends Model
{
    use HasFactory;

    protected $fillable = [
        'entreprise_id',
        'periode',
        'annee',
        'statut',
        'date_soumission',
        'valide_par'
    ];

    /**
     * Obtenir l'entreprise associée au rapport.
     */
    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }

    /**
     * Obtenir les indicateurs financiers du rapport.
     */
    public function indicateursFinanciers(): HasOne
    {
        return $this->hasOne(IndicateurFinancier::class);
    }

    /**
     * Obtenir les indicateurs commerciaux du rapport.
     */
    public function indicateursCommerciaux(): HasOne
    {
        return $this->hasOne(IndicateurCommercial::class);
    }

    /**
     * Obtenir les indicateurs RH du rapport.
     */
    

    /**
     * Obtenir les indicateurs de production du rapport.
     */
    public function indicateursProduction(): HasOne
    {
        return $this->hasOne(IndicateurProduction::class);
    }
}
